package api

import (
	"github.com/gofiber/fiber/v2"
)

func Make(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello world")
	})
}
