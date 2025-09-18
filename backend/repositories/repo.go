package repositories

import (
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type Repo struct {
	PgPool *pgxpool.Pool
}

func GetRepo(pgConn *pgxpool.Pool) *Repo {
	r := &Repo{}
	r.PgPool = pgConn
	err := godotenv.Load(".env")
	if err == nil {
		fmt.Println("Repo .env detected: using .env")
	}

	return r
}
