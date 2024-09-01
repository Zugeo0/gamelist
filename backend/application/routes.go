package application

import (
	"backend/handler"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (app *App) loadRoutes() {
    router := chi.NewRouter()

    router.Use(middleware.Logger)
    router.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{"https://*", "http://*"},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
        ExposedHeaders:   []string{"Link"},
        AllowCredentials: false,
        MaxAge:           300,
    }))
    router.Route("/api", app.loadApiRoutes)

    app.router = router
}

func (app *App) loadApiRoutes(router chi.Router) {
    router.Get("/", func(w http.ResponseWriter, r *http.Request) {
        // Write a small little greeting!
        w.Write([]byte("<!DOCTYPE html><html><head><title>GameList API</title></head><body><h1>GameList API</h1><p>Welcome! The API is currently up and running!</p><img src=\"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.tenor.com%2Fimages%2F6beee0eb52457af434f918e25d0c6a45%2Ftenor.gif&f=1&nofb=1&ipt=3e052814960a4040a27933e8f03e7f7fbef16ca2606eab5241127ba21a7c26dd&ipo=images\"></img></body></html>"))
    })

    router.Route("/games", app.loadGameRoutes)
    router.Route("/lists", app.loadGameListRoutes)
}

func (app *App) loadGameRoutes(router chi.Router) {
    gameHandler := &handler.Game{
        DB: app.db,
        Igdb: app.igdb,
    }

    router.Post("/", gameHandler.Create)
    router.Get("/", gameHandler.List)
    router.Put("/", gameHandler.Put)
    router.Get("/{id}", gameHandler.GetByID)
    router.Delete("/{id}", gameHandler.DeleteByID)
    router.Get("/search/{name}", gameHandler.Search)
}

func (app *App) loadGameListRoutes(router chi.Router) {
    gameListHandler := &handler.GameList{
        DB: app.db,
    }

    router.Post("/", gameListHandler.Create)
    router.Get("/", gameListHandler.List)
    router.Put("/", gameListHandler.Put)
    router.Get("/{id}", gameListHandler.GetByID)
    router.Delete("/{id}", gameListHandler.DeleteByID)
}

