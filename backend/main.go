package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

const APP_NAME string = "gamelist"
const APP_VERSION string = "0.1"

func main() {
	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5070"
	}

	app := fiber.New(fiber.Config{
		AppName:       fmt.Sprintf("%s v%s", APP_NAME, APP_VERSION),
		CaseSensitive: false,
	})

	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello world")
	})

	address := fmt.Sprintf(":%s", port)

	app.Listen(address)
}
