package handler

import (
	"backend/model"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type Game struct{
    DB *gorm.DB
}

func (o *Game) Create(w http.ResponseWriter, r *http.Request) {
    game := model.Game{}
    if err := json.NewDecoder(r.Body).Decode(game); err != nil {
        log.Fatal("Error decoding json ", err)
    }

    res := o.DB.Create(&game)
    if res.Error != nil {
        log.Fatal("Error creating database entry ", res.Error)
    }

    w.WriteHeader(http.StatusOK)
}

func (o *Game) List(w http.ResponseWriter, r *http.Request) {
    games := []model.Game{}
    res := o.DB.Find(&games)
    if res.Error != nil {
        log.Fatal("Error processing request ", res.Error)
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(games)
}

func (o *Game) GetByID(w http.ResponseWriter, r *http.Request) {
    idParam := chi.URLParam(r, "id")
    id, err := strconv.ParseUint(idParam, 10, 64)

    if err != nil {
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    game := model.Game{}
    res := o.DB.Find(&game, id)

    if res.RowsAffected == 0 {
        w.WriteHeader(http.StatusNotFound)
        return
    } else {
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(game)
    }
}

func (o *Game) Put(w http.ResponseWriter, r *http.Request) {
    game := model.Game{}
    if err := json.NewDecoder(r.Body).Decode(game); err != nil {
        log.Fatal("Error decoding json ", err)
    }

    o.DB.Save(game)
    w.WriteHeader(http.StatusOK)
}

func (o *Game) DeleteByID(w http.ResponseWriter, r *http.Request) {
    idParam := chi.URLParam(r, "id")
    id, err := strconv.ParseUint(idParam, 10, 64)

    if err != nil {
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    o.DB.Delete(model.Game{}, id)
}

