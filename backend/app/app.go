package app

import (
	"context"
	"gamelist-server/database"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

type state struct {
	ctx     context.Context
	conn    *pgx.Conn
	queries *database.Queries
}

var appState state

func Init(ctx context.Context) {
	conn := setupDbConnection(ctx)
	queries := database.New(conn)

	appState = state{
		ctx,
		conn,
		queries,
	}
}

func setupDbConnection(ctx context.Context) *pgx.Conn {
	database_url, ok := os.LookupEnv("POSTGRES_URL")
	if !ok {
		log.Fatal("missing environment variable POSTGRES_URL")
	}

	conn, err := pgx.Connect(ctx, database_url)
	if err != nil {
		panic(err)
	}

	return conn
}
