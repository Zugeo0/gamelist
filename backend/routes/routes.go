package routes

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	api := app.Group("/api")

	defineGamesRoutes(api)
	defineGamelistRoutes(api)
}