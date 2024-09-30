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

type GameList struct {
	DB *gorm.DB
}

func (o *GameList) Create(w http.ResponseWriter, r *http.Request) {
	list := model.GameList{}
	if err := json.NewDecoder(r.Body).Decode(&list); err != nil {
		log.Fatal("Error decoding json ", err)
	}

	res := o.DB.Create(&list)
	if res.Error != nil {
		log.Fatal("Error creating database entry ", res.Error)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(list)
}

func (o *GameList) List(w http.ResponseWriter, r *http.Request) {
	lists := []model.GameList{}
	res := o.DB.Find(&lists)
	if res.Error != nil {
		log.Fatal("Error processing request ", res.Error)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lists)
}

func (o *GameList) GetByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idParam, 10, 64)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	list := model.GameList{}
	res := o.DB.Find(&list, id)

	if res.RowsAffected == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(list)
	}
}

func (o *GameList) Put(w http.ResponseWriter, r *http.Request) {
	game := model.GameList{}
	if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
		log.Fatal("Error decoding json ", err)
	}

	o.DB.Save(game)
	w.WriteHeader(http.StatusOK)
}

func (o *GameList) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idParam, 10, 64)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	res := o.DB.Delete(model.GameList{}, id)
	if res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(id)
}
