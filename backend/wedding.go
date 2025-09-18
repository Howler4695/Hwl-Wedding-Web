package main

import (
	"context"
	"fmt"
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

	POSTGRES_URL := os.Getenv("PG_URL")
	HOST_URL := os.Getenv("HOST_URL")

	router := gin.Default()
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

	pool, err := pgxpool.New(context.Background(), POSTGRES_URL)
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
