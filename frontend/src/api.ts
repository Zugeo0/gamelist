
import axios from "axios";

const apiPath = import.meta.env.VITE_API_URL || '';

export interface GameList {
    id: number,
    name: string,
}

export interface GameData {
    id: number,
    name: string,
    description: string,
    genres: string[],
    artwork_url: string | null,
    release_date: Date | null,
    igdb_id: string | null,
    metacritic_score: string | null,
    steam_id: string | null,
    state: GameState | null,
}

export interface GameState {
    game_list: number,
    user_rating: number,
    gametime_min: number,
    list_order: number,
    custom_status: string,
    last_played: Date | null,
}


export async function moveGameToList(gameid: number, listid: number) {
    await axios(apiPath + `/api/games/${gameid}/move/${listid}`, {
        method: "PUT",
    });
}

export async function moveGameToBacklog(gameid: number) {
    await axios(apiPath + `/api/games/${gameid}/move/backlog`, {
        method: "PUT",
    });
}

export async function createGame(
    name: string,
    description: string,
    genres: string[],
    artwork_url: string | null,
    release_date: Date | null,
    igdb_id: string | null,
    steam_id: string | null,

): Promise<GameData> {
    let response = await axios(apiPath + "/api/games", {
        method: "POST",
        data: {
            name,
            description,
            genres,
            artwork_url,
            release_date,
            igdb_id,
            steam_id,
        },
    });

    return mapToActiveGame(response.data);
}

export async function getGamesInList(listid: number): Promise<GameData[]> {
    let response = await axios(apiPath + `/api/gamelists/${listid}/games`);
    let games: any[] = response.data;

    return games.map(mapToActiveGame);
}

export async function createGameList(name: string): Promise<GameList> {
    let response = await axios(apiPath + "/api/gamelists", {
        method: "POST",
        data: {
            name: name
        },
    });

    return {
        id: response.data.ID,
        name: response.data.Name,
    };
}

export async function deleteGameList(id: number) {
    await axios(apiPath + "/api/gamelists/" + id, {
        method: "DELETE",
    });
}

export async function getGameLists(): Promise<GameList[]> {
    let response = await axios(apiPath + "/api/gamelists")
    let gamelists: GameList[] = [];

    response.data.forEach((gamelist: any) => {
        gamelists.push({
            id: gamelist.ID,
            name: gamelist.Name,
        })
    })

    return gamelists;
}

export async function getGameList(id: number): Promise<GameList> {
    let response = await axios(apiPath + "/api/gamelists/" + id);
    let gamelist = response.data;

    return {
        id: gamelist.ID,
        name: gamelist.Name,
    };
}

export async function getFrontGameInList(listid: number): Promise<GameData | null> {
    let response = await axios(apiPath + "/api/gamelists/" + listid + "/front");
    let game = response.data;

    if (!game) {
        return null;
    }

    return mapToActiveGame(game);
}

function mapToActiveGame(game: any): GameData {
    return {
        id: game.ID,
        name: game.Name,
        description: game.Description,
        genres: game.Genres,
        artwork_url: game.ArtworkUrl,
        release_date: game.ReleaseDate,
        igdb_id: game.IgdbId,
        metacritic_score: game.MetacriticScore,
        steam_id: game.SteamId,
        state: {
            game_list: game.GameList,
            user_rating: game.UserRating,
            gametime_min: game.GametimeMin,
            list_order: game.ListOrder,
            custom_status: game.CustomStatus,
            last_played: game.LastPlayed,
        },
    }
}
