package app

import (
	"gamelist-server/database"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func CreateGame(name string, description string, genres []string, artworkUrl *string, releaseDate *time.Time) (database.Gameinfo, error) {
	pgArtworkUrl := pgtype.Text{}
	pgReleaseDate := pgtype.Date{}

	if artworkUrl != nil {
		pgArtworkUrl.String = *artworkUrl
		pgArtworkUrl.Valid = true
	}

	if releaseDate != nil {
		pgReleaseDate.Time = *releaseDate
		pgReleaseDate.Valid = true
	}

	return appState.queries.CreateGame(appState.ctx, database.CreateGameParams{
		Name:        name,
		Description: description,
		Genres:      genres,
		ArtworkUrl:  pgArtworkUrl,
		ReleaseDate: pgReleaseDate,
	})
}

func GetGame(id int32) (database.GetGameRow, error) {
	return appState.queries.GetGame(appState.ctx, id)
}

func GetGames() ([]database.GetGamesRow, error) {
	return appState.queries.GetGames(appState.ctx)
}

func UpdateGame(id int32, name string, description string, genres []string, artworkUrl *string, releaseDate *time.Time) (database.Gameinfo, error) {
	pgArtworkUrl := pgtype.Text{}
	pgReleaseDate := pgtype.Date{}

	if artworkUrl != nil {
		pgArtworkUrl.String = *artworkUrl
		pgArtworkUrl.Valid = true
	}

	if releaseDate != nil {
		pgReleaseDate.Time = *releaseDate
		pgReleaseDate.Valid = true
	}

	return appState.queries.UpdateGame(appState.ctx, database.UpdateGameParams{
		ID:          id,
		Name:        name,
		Description: description,
		Genres:      genres,
		ArtworkUrl:  pgArtworkUrl,
		ReleaseDate: pgReleaseDate,
	})
}

func MoveGameToBacklog(id int32) error {
	return appState.queries.SetList(appState.ctx, database.SetListParams{
		GameInfo: id,
		GameList: pgtype.Int4{
			Valid: false,
		},
	})
}

func MoveGameToList(id int32, list int32) error {
	return appState.queries.SetList(appState.ctx, database.SetListParams{
		GameInfo: id,
		GameList: pgtype.Int4{
			Int32: list,
			Valid: true,
		},
	})
}

func DeleteGame(id int32) error {
	return appState.queries.DeleteGame(appState.ctx, id)
}

func GetGameState(id int32) (database.Gamestate, error) {
	return appState.queries.GetGameState(appState.ctx, id)
}

func AttachState(id int32) (database.Gamestate, error) {
	return appState.queries.AttachState(appState.ctx, database.AttachStateParams{
		GameInfo: id,
		GameList: pgtype.Int4{
			Int32: 0,
			Valid: false,
		},
		UserRating:  0,
		GametimeMin: 0,
	})
}

func DetachState(id int32) error {
	return appState.queries.DetachState(appState.ctx, int32(id))
}
