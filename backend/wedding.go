package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"wedding/auth"
	"wedding/controller"
	"wedding/repositories"
	"wedding/routes"
	"wedding/services"

	"github.com/gin-gonic/gin"
)

func main() {
	godotenv.Load(".env")

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

	if os.Getenv("DB_MODE") == "remote" {

		roots, _ := x509.SystemCertPool()
		if roots == nil {
			roots = x509.NewCertPool()
		}
		pem, _ := os.ReadFile(os.Getenv("DB_ROOTCERT_LOCATION"))
		roots.AppendCertsFromPEM(pem)

		cfg.ConnConfig.TLSConfig = &tls.Config{
			ServerName: os.Getenv("DB_HOST"),
			RootCAs:    roots,
			MinVersion: tls.VersionTLS12,
		}
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		log.Fatal(err)
	}

	gin.SetMode(os.Getenv("GIN_MODE"))
	router := gin.Default()
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("BACKEND_ORIGIN")}, // add your prod origins too
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true, // only if you send cookies/Authorization and need them
		MaxAge:           12 * time.Hour,
	}))

	defer pool.Close()

	cognitoCFG := auth.CognitoConfig{
		Region:     os.Getenv("COGNITO_REGION"),
		UserPoolID: os.Getenv("COGNITO_USER_POOL_ID"),
		ClientID:   os.Getenv("COGNITO_APP_CLIENT_ID"),
	}

	if err := auth.Init(cognitoCFG); err != nil {
		log.Fatalf("Failed to init JWKS: %v", err)
	}

	repo := repositories.GetRepo(pool)
	cont := &controller.Controller{Repo: repo, Services: &services.Services{}}

	router.GET("/health", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
		defer cancel()
		if err := pool.Ping(ctx); err != nil {
			c.JSON(503, gin.H{"status": "error"})
			return
		}
		c.JSON(200, gin.H{"status": "ok"})
	})

	rout := &routes.Routes{Router: router, Cont: cont}
	rout.MapAllRoutes()

	router.Run(HOST_URL)
}
