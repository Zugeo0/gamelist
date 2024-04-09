package routes

import (
	"gamelist-server/app"
	"gamelist-server/database"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func defineGamelistRoutes(router fiber.Router) {
	gamelist := router.Group("/gamelists")
	gamelist.Post("/", createGameList)
	gamelist.Get("/", getGameLists)
	gamelist.Put("/:id", updateGameList)
	gamelist.Delete("/:id", deleteGameList)
	gamelist.Get("/:id", getGameList)
	gamelist.Get("/:id/front", getFrontGame)
	gamelist.Get("/:id/games", getGamesInList)
	gamelist.Get("/backlog", getGamesInBacklog)
}

func createGameList(ctx *fiber.Ctx) error {
	payload := struct {
		Name string `validate:"required"`
	}{}

	valid := validator.New()
	ctx.BodyParser(&payload)
	if err := valid.Struct(&payload); err != nil {
		return err
	}

	list, err := app.CreateGameList(payload.Name)
	if err != nil {
		return err
	}

	return ctx.Status(201).JSON(list)
}

func updateGameList(ctx *fiber.Ctx) error {
	payload := struct {
		Name string `validate:"required"`
	}{}

	valid := validator.New()
	ctx.BodyParser(&payload)
	if err := valid.Struct(&payload); err != nil {
		return err
	}

	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	_, err = app.UpdateGameList(int32(id), payload.Name)
	if err != nil {
		return err
	}

	return ctx.SendStatus(200)
}

func deleteGameList(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}
	err = app.DeleteGameList(int32(id))
	if err != nil {
		return err
	}
	return ctx.SendStatus(200)
}

func getFrontGame(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	game, err := app.GetFrontGameInList(int32(id))
	if err != nil {
		// TODD: Filter error
		// return err

		return ctx.Status(200).JSON(nil)
	}

	return ctx.Status(200).JSON(game)
}

func getGamesInList(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	games, err := app.GetGamesInList(int32(id))
	if err != nil {
		return err
	}

	if games == nil {
		games = []database.GetGameListGamesRow{}
	}

	return ctx.Status(200).JSON(games)
}

func getGamesInBacklog(ctx *fiber.Ctx) error {
	games, err := app.GetBacklogGames()
	if err != nil {
		return err
	}

	if games == nil {
		games = []database.GetBacklogGamesRow{}
	}

	return ctx.Status(200).JSON(games)
}

func getGameLists(ctx *fiber.Ctx) error {
	gamelists, err := app.GetGameLists()
	if err != nil {
		return err
	}

	if gamelists == nil {
		gamelists = []database.Gamelist{}
	}

	return ctx.Status(200).JSON(gamelists)
}

func getGameList(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return err
	}

	gamelist, err := app.GetGameList(int32(id))
	if err != nil {
		return err
	}

	return ctx.Status(200).JSON(gamelist)
}
