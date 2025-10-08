package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"crypto/tls"
	"crypto/x509"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"wedding/controller"
	"wedding/repositories"
	"wedding/routes"
	"wedding/services"

	"github.com/gin-gonic/gin"
)

func main() {
	err := godotenv.Load(".env")
	if err == nil {
		fmt.Println(".env detected: using .env")
	}

	HOST_URL := os.Getenv("HOST_URL")

	cfg, err := pgxpool.ParseConfig("")
	if err != nil {
		log.Fatal(err)
	}
	cfg.ConnConfig.Host = os.Getenv("DB_HOST")
	cfg.ConnConfig.Port = 5432
	cfg.ConnConfig.Database = os.Getenv("DB_DATABASE")
	cfg.ConnConfig.User = os.Getenv("DB_USER")
	cfg.ConnConfig.Password = os.Getenv("DB_PASSWORD")
	cfg.ConnConfig.TLSConfig = nil
	// cfg.ConnConfig.Config.RuntimeParams["sslmode"] = os.Getenv("DB_SSLMODE")
	// Use system cert pool (ensure ca-certificates are installed)
	roots, err := x509.SystemCertPool()
	if err != nil || roots == nil {
		roots = x509.NewCertPool()
	}

	cfg.ConnConfig.TLSConfig = &tls.Config{
		ServerName: os.Getenv("DB_HOST"),
		RootCAs:    roots,
		MinVersion: tls.VersionTLS12,
	}
	if err != nil {
		log.Fatal(err)
	}
	router := gin.Default()
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	repo := repositories.GetRepo(pool)
	cont := &controller.Controller{Repo: repo, Services: &services.Services{}}

	rout := &routes.Routes{Router: router, Cont: cont}
	rout.MapAllRoutes()

	router.Run(HOST_URL)
}
