
----------------------------------
-- Game State
----------------------------------

-- name: CreateGameList :one
INSERT INTO GameList(
    name
) VALUES ($1) RETURNING *;

-- name: GetGameListFrontGame :one
SELECT
    G.id,
    G.name,
    G.description,
    G.genres,
    G.artwork_url,
    G.release_date,
    DB.igdb_id,
    DB.metacritic_score,
    DB.steam_id,
    ST.game_list,
    ST.user_rating,
    ST.gametime_min,
    ST.list_order,
    ST.custom_status,
    ST.last_played
FROM GameInfo G
JOIN GameState ST ON ST.game_info = G.id
LEFT JOIN GameDbInfo DB ON DB.game_info = G.id
WHERE ST.game_list = $1
ORDER BY ST.list_order;

-- name: GetGameListGames :many
SELECT
    G.id,
    G.name,
    G.description,
    G.genres,
    G.artwork_url,
    G.release_date,
    DB.igdb_id,
    DB.metacritic_score,
    DB.steam_id,
    ST.game_list,
    ST.user_rating,
    ST.gametime_min,
    ST.list_order,
    ST.custom_status,
    ST.last_played
FROM GameInfo G
JOIN GameState ST ON ST.game_info = G.id
LEFT JOIN GameDbInfo DB ON DB.game_info = G.id
WHERE ST.game_list = $1
ORDER BY ST.list_order;

-- name: GetGameList :one
SELECT * FROM GameList
WHERE id = $1;

-- name: GetGameLists :many
SELECT * FROM GameList;

-- name: GetBacklogGames :many
SELECT
    G.id,
    G.name,
    G.description,
    G.genres,
    G.artwork_url,
    G.release_date,
    DB.igdb_id,
    DB.metacritic_score,
    DB.steam_id,
    ST.game_list,
    ST.user_rating,
    ST.gametime_min,
    ST.list_order,
    ST.custom_status,
    ST.last_played
FROM GameInfo G
JOIN GameState ST ON ST.game_info = G.id
LEFT JOIN GameDbInfo DB ON DB.game_info = G.id
WHERE ST.game_list IS NULL
ORDER BY ST.list_order;

-- name: UpdateGameList :one
UPDATE GameList SET name = $2
WHERE id = $1
RETURNING *;

-- name: DeleteGameList :exec
WITH res AS (
    DELETE FROM GameList WHERE id = $1 RETURNING id AS list_id
)
UPDATE GameState SET game_list = NULL
WHERE game_list = (SELECT list_id FROM res);

----------------------------------
-- Game Info
----------------------------------

-- name: CreateGame :one
INSERT INTO GameInfo(
    name,
    description,
    genres,
    artwork_url,
    release_date
) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: GetGame :one
SELECT
    G.id,
    G.name,
    G.description,
    G.genres,
    G.artwork_url,
    G.release_date,
    DB.igdb_id,
    DB.metacritic_score,
    DB.steam_id,
    ST.game_list,
    ST.user_rating,
    ST.gametime_min,
    ST.list_order,
    ST.custom_status,
    ST.last_played
FROM GameInfo G
LEFT JOIN GameDbInfo DB ON DB.game_info = G.id
LEFT JOIN GameState ST ON ST.game_info = G.id
WHERE G.id = $1;

-- name: GetGames :many
SELECT
    G.id,
    G.name,
    G.description,
    G.genres,
    G.artwork_url,
    G.release_date,
    DB.igdb_id,
    DB.metacritic_score,
    DB.steam_id,
    ST.game_list,
    ST.user_rating,
    ST.gametime_min,
    ST.list_order,
    ST.custom_status,
    ST.last_played
FROM GameInfo G
LEFT JOIN GameDbInfo DB ON DB.game_info = G.id
LEFT JOIN GameState ST ON ST.game_info = G.id;

-- name: UpdateGame :one
UPDATE GameInfo
SET name = $2,
    description = $3,
    genres = $4,
    artwork_url = $5,
    release_date = $6
WHERE id = $1
RETURNING *;

-- name: DeleteGame :exec
DELETE FROM GameInfo WHERE id = $1;

----------------------------------
-- Game State
----------------------------------

-- name: AttachState :one
INSERT INTO GameState(
    game_info,
    game_list,
    user_rating,
    gametime_min,
    list_order
) VALUES ($1, $2, $3, $4, nextval('GameListOrder')) RETURNING *;

-- name: DetachState :exec
DELETE FROM GameState
WHERE game_info = $1;

-- name: AttachDbInfo :one
INSERT INTO GameDbInfo(
    igdb_id,
    metacritic_score,
    steam_id,
    game_info
) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: DetachDbInfo :exec
DELETE FROM GameDbInfo
WHERE game_info = $1;

-- name: SetList :exec
UPDATE GameState
SET game_list = $2
WHERE game_info = $1;

-- name: GetGameState :one
SELECT * FROM GameState
WHERE game_info = $1;
