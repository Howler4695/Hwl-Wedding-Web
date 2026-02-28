package repositories

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repo struct {
	PgPool *pgxpool.Pool
}

func GetRepo(pgConn *pgxpool.Pool) *Repo {
	r := &Repo{}
	r.PgPool = pgConn
	return r
}
