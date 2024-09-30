package handler

import (
	"backend/igdb"
	"backend/model"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type Game struct {
	DB   *gorm.DB
	Igdb *igdb.Client
}

func (o *Game) Create(w http.ResponseWriter, r *http.Request) {
	game := model.Game{}
	if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
		log.Fatal("Error decoding json ", err)
	}

	res := o.DB.Create(&game)
	if res.Error != nil {
		log.Fatal("Error creating database entry ", res.Error)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(game)
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
	if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
		log.Fatal("Error decoding json ", err)
	}

	res := o.DB.Save(game)
	if res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(game)
}

func (o *Game) DeleteByID(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.ParseUint(idParam, 10, 64)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	res := o.DB.Delete(model.Game{}, id)
	if res.Error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(id)
}

func (o *Game) Search(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")

	// Don't worry about sql injection. it's fine :)
	resp, err := o.Igdb.Post("/games", fmt.Sprintf("search \"%s\"; fields name,summary,cover.url;", name))
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	log.Println(resp)

	games := []struct {
		Id      int    `json:"id"`
		Name    string `json:"name"`
		Summary string `json:"summary"`
		Cover   struct {
			Id  int    `json:"id"`
			Url string `json:"url"`
		} `json:"cover"`
	}{}
	err = json.Unmarshal([]byte(resp), &games)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	type RespIgdbGame struct {
		Id      int    `json:"id"`
		Name    string `json:"name"`
		Summary string `json:"summary"`
		Cover   string `json:"cover"`
	}

	respGames := []RespIgdbGame{}

	for _, game := range games {
		respGames = append(respGames, RespIgdbGame{
			Id:      game.Id,
			Name:    game.Name,
			Summary: game.Summary,
			Cover:   game.Cover.Url,
		})
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(respGames)
}
