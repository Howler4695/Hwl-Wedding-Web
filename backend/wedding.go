package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"log"
	"os"

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

	roots, _ := x509.SystemCertPool()
	if roots == nil {
		roots = x509.NewCertPool()
	}
	pem, _ := os.ReadFile("/etc/ssl/certs/rds-ca-bundle.pem")
	roots.AppendCertsFromPEM(pem)

	cfg.ConnConfig.TLSConfig = &tls.Config{
		ServerName: "database-1-instance-1.cbue6s2qw23y.us-east-2.rds.amazonaws.com",
		RootCAs:    roots,
		MinVersion: tls.VersionTLS12,
	}
	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		log.Fatal(err)
	}
	router := gin.Default()
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

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
