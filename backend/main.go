package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"gamelist-server/app"
	"gamelist-server/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5070"
	}

	ctx := context.Background()
	app.Init(ctx)

	server := fiber.New()

	server.Use(logger.New())
	server.Use(cors.New())

	server.Static("/", "./frontend")

	routes.Setup(server)

	address := fmt.Sprintf(":%s", port)
	log.Fatal(server.Listen(address))
}
