package model

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDatabase() (*gorm.DB, error) {
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbname := os.Getenv("DB_NAME")
    host := os.Getenv("DB_HOST")
    port := os.Getenv("DB_PORT")

    dsn := fmt.Sprintf(
        "user=%v password=%v dbname=%v host=%v port=%v sslmode=disable",
        user,
        password,
        dbname,
        host,
        port,
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }

    db.AutoMigrate(Game{})
    db.AutoMigrate(GameList{})

    return db, nil
}
