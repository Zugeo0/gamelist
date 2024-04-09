
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
}

export interface GameState {
    game_list: number,
    user_rating: number,
    gametime_min: number,
    list_order: number,
    custom_status: string,
    last_played: Date | null,
}

export interface ActiveGame {
    data: GameData,
    state: GameState,
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

export async function getFrontGameInList(listid: number): Promise<ActiveGame | null> {
    let response = await axios(apiPath + "/api/gamelists/" + listid + "/front");
    let game = response.data;

    if (!game) {
        return null;
    }

    return {
        data: {
            id: game.ID,
            name: game.Name,
            description: game.Description,
            genres: game.Genres,
            artwork_url: game.ArtworkUrl,
            release_date: game.ReleaseDate,
            igdb_id: game.IgdbId,
            metacritic_score: game.MetacriticScore,
            steam_id: game.SteamId,
        },
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
