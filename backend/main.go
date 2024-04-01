package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"gamelist-server/api"
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

	app.Static("/", "./frontend")

	api.Make(app)

	address := fmt.Sprintf(":%s", port)

	app.Listen(address)
}
