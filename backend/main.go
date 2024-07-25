package main

import (
	"backend/application"
	"context"
	"log"
	"os"
	"os/signal"

	"github.com/joho/godotenv"
)

func main() {
    // Load environment variables fron .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Create context for handling graceful shutdown
    ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
    defer cancel()

    // Create and run server
    app, err := application.New()
    if err != nil {
        log.Fatal("failed to run application: ", err)
    }

    err = app.Run(ctx)
    if err != nil {
        log.Fatal("failed to run application: ", err)
    }
}

