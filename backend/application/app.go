package application

import (
	"backend/igdb"
	"backend/model"
	"context"
	"fmt"
	"net/http"
	"time"

	"gorm.io/gorm"
)

type App struct {
    router http.Handler
    db *gorm.DB
    igdb *igdb.Client
}

func New() (*App, error) {
    db, err := model.ConnectDatabase()
    if err != nil {
        return nil, fmt.Errorf("Failed to connect to database: %w", err)
    }

    igdb, err := igdb.Connect()
    if err != nil {
        return nil, fmt.Errorf("Failed to connect to IGDB: %w", err)
    }

    app := &App{
        db: db,
        igdb: igdb,
    }
    app.loadRoutes()
    return app, nil
}

func (a *App) Run(ctx context.Context) error {
    server := &http.Server{
        Addr: ":3000",
        Handler: a.router,
    }

    // Run server on a seperate thread
    ch := make(chan error, 1)
    go func() {
        err := server.ListenAndServe()
        if err != nil {
            ch <- fmt.Errorf("Failed to start server: %w", err)
        }
        close(ch)
    }()

    // Close server on either error or interrupt signal
    select {
    case err := <-ch:
        return err
    case <-ctx.Done():
        timeout, cancel := context.WithTimeout(context.Background(), time.Second * 10)
        defer cancel()

        return server.Shutdown(timeout)
    }
}

