package routes

import (
	"gamelist-server/app"
	"gamelist-server/database"
	"log"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func defineGamesRoutes(router fiber.Router) {
	games := router.Group("/games")
	games.Post("/", createGame)
	games.Get("/", getGames)
	games.Put("/:id", updateGame)
	games.Delete("/:id", deleteGame)
	games.Get("/:id", getGame)
	games.Put("/:id/move/backlog", moveGameToBacklog)
	games.Put("/:id/move/:listid", moveGameToList)
}

func createGame(ctx *fiber.Ctx) error {
	payload := struct {
		Name        string `validate:"required"`
		Description string
		Genres      []string
		ArtworkUrl  *string
		ReleaseDate *time.Time
	}{}

	valid := validator.New()
	ctx.BodyParser(&payload)

	if err := valid.Struct(&payload); err != nil {
		return err
	}

	if payload.Genres == nil {
		payload.Genres = []string{}
	}

	game, err := app.CreateGame(
		payload.Name,
		payload.Description,
		payload.Genres,
		payload.ArtworkUrl,
		payload.ReleaseDate,
	)

	if err != nil {
		return err
	}

	return ctx.Status(201).JSON(game)
}

func updateGame(ctx *fiber.Ctx) error {
	payload := struct {
		Name        string `validate:"required"`
		Description string
		Genres      []string
		ArtworkUrl  *string
		ReleaseDate *time.Time
	}{}

	valid := validator.New()
	ctx.BodyParser(&payload)

	if err := valid.Struct(&payload); err != nil {
		return err
	}

	if payload.Genres == nil {
		payload.Genres = []string{}
	}

	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	game, err := app.UpdateGame(
		int32(id),
		payload.Name,
		payload.Description,
		payload.Genres,
		payload.ArtworkUrl,
		payload.ReleaseDate,
	)

	if err != nil {
		return err
	}

	return ctx.Status(201).JSON(game)
}

func getGames(ctx *fiber.Ctx) error {
	games, err := app.GetGames()
	if err != nil {
		return err
	}

	if games == nil {
		games = []database.GetGamesRow{}
	}

	return ctx.Status(200).JSON(games)
}

func getGame(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	game, err := app.GetGame(int32(id))
	if err != nil {
		return err
	}

	return ctx.Status(200).JSON(game)
}

func deleteGame(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}
	err = app.DeleteGame(int32(id))
	if err != nil {
		return err
	}
	return ctx.SendStatus(200)
}

func moveGameToBacklog(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	err = app.MoveGameToBacklog(int32(id))
	if err != nil {
		return err
	}

	return ctx.SendStatus(200)
}

func moveGameToList(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	listid, err := ctx.ParamsInt("listid")
	if err != nil {
		return err
	}

	_, err = app.GetGameState(int32(id))

	if err != nil {
		app.AttachState(int32(id))
		log.Printf("No state attached to game %v. Creating...", id)
	}

	err = app.MoveGameToList(int32(id), int32(listid))
	if err != nil {
		return err
	}

	return ctx.SendStatus(200)
}
