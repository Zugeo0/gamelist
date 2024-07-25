package model

type GameList struct {
    ID uint `gorm:"primaryKey" json:"id"`
    Name string `json:"name"`
    Games []Game `json:"games"`
}

