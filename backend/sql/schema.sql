
CREATE TABLE GameList(
    id    SERIAL PRIMARY KEY,
    name  TEXT   NOT NULL
);

CREATE TABLE GameInfo(
    id           SERIAL  PRIMARY KEY,
    name         TEXT    NOT NULL,
    description  TEXT    NOT NULL,
    genres       TEXT[]  NOT NULL,
    artwork_url  TEXT,
    release_date DATE
);

CREATE TABLE GameDbInfo(
    game_info         INT     PRIMARY KEY REFERENCES GameInfo(id) ON DELETE CASCADE,
    igdb_id           TEXT    NOT NULL,
    metacritic_score  INT     NOT NULL,
    steam_id          TEXT    NOT NULL
);

CREATE TABLE GameState(
    game_info      INT   PRIMARY KEY REFERENCES GameInfo(id) ON DELETE CASCADE,
    game_list      INT   REFERENCES GameList(id),
    user_rating    INT   NOT NULL,
    gametime_min   INT   NOT NULL,
    list_order     INT   NOT NULL,
    custom_status  TEXT  NOT NULL DEFAULT '',
    last_played    DATE  DEFAULT NULL
);

CREATE SEQUENCE GameListOrder START 1;
