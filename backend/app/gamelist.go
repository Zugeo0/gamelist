package app

import (
	"gamelist-server/database"

	"github.com/jackc/pgx/v5/pgtype"
)

func CreateGameList(name string) (database.Gamelist, error) {
	return appState.queries.CreateGameList(appState.ctx, name)
}

func GetGamesInList(id int32) ([]database.GetGameListGamesRow, error) {
	return appState.queries.GetGameListGames(appState.ctx, pgtype.Int4{Int32: id, Valid: true})
}

func GetFrontGameInList(id int32) (database.GetGameListFrontGameRow, error) {
	return appState.queries.GetGameListFrontGame(appState.ctx, pgtype.Int4{Int32: id, Valid: true})
}

func UpdateGameList(id int32, name string) (database.Gamelist, error) {
	return appState.queries.UpdateGameList(appState.ctx, database.UpdateGameListParams{
		ID:   id,
		Name: name,
	})
}

func DeleteGameList(id int32) error {
	return appState.queries.DeleteGameList(appState.ctx, id)
}

func GetBacklogGames() ([]database.GetBacklogGamesRow, error) {
	return appState.queries.GetBacklogGames(appState.ctx)
}

func GetGameList(id int32) (database.Gamelist, error) {
	return appState.queries.GetGameList(appState.ctx, id)
}

func GetGameLists() ([]database.Gamelist, error) {
	return appState.queries.GetGameLists(appState.ctx)
}
