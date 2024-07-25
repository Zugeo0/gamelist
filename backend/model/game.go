package model

import "time"

type Game struct {
    ID uint `gorm:"primaryKey" json:"id"`
    Name string `json:"name"`
    Description string `json:"description"`
    Rating int `json:"rating"`
    LastPlayed *time.Time `json:"last_played"`
    Playtime int `json:"playtime"`
    Cover string `json:"cover"`
    GameListID uint `json:"list"`
    Order int `json:"order"`
    Completed *time.Time `json:"completed"`
    IGDBID int `json:"igdb_id"`
}

