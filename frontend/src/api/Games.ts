import { API_URL, validate } from "./Common";
import type { GameList } from "./GameLists";

export type Game = {
    id: number,
    name: string,
    description: string,
    rating: number,
    lastPlayed: Date | null,
    playtime: number, // in minutes
    cover: string, // url
    list: number | null, // GameList[id] or backlog
    order: number,
    completed: Date | null,
    igdbId: number,
};

export type IGDBGame = {
    id: number,
    name: string,
    description: string,
    cover: string, // url
};

function gameFromResponse(game: any): Game {
    return {
        id: game.id,
        name: game.name,
        description: game.description,
        rating: game.rating,
        lastPlayed: game.last_played ? new Date(game.last_played) : null,
        playtime: game.playtime,
        cover: game.cover,
        list: game.list === 0 ? null : game.list,
        order: game.order,
        completed: game.completed ? new Date(game.completed) : null,
        igdbId: game.igdb_id,
    };
}

function igdbGameFromResponse(game: any): IGDBGame {
    return {
        id: game.id,
        name: game.name,
        description: game.summary,
        cover: game.cover,
    };
}

function gameToRequest(game: Game): string {
    return JSON.stringify({
        id: game.id,
        name: game.name,
        description: game.description,
        rating: game.rating,
        last_played: game.lastPlayed,
        playtime: game.playtime,
        cover: game.cover,
        list: game.list,
        order: game.order,
        completed: game.completed,
        igdb_id: game.igdbId,
    });
}

export class GameAPI {
    static async add(game: Game): Promise<Game> {
        const response = await fetch(API_URL + "/games", {
            method: "POST",
            body: gameToRequest(game),
        })

        validate(response, "Failed to add new game");

        return gameFromResponse(await response.json());
    }

    static async get(id: number): Promise<Game | null> {
        const response = await fetch(API_URL + `/games/${id}`);

        validate(response, "Failed to fetch game by id");

        return gameFromResponse(await response.json());
    }

    static async front(list: GameList): Promise<Game | null> {
        const games = await GameAPI.all();
        let game = games
            .filter(game => game.list === list.id)
            .sort((a, b) => a.order - b.order)
            .at(0);

        return game ?? null;
    }

    static async all(): Promise<Game[]> {
        const response = await fetch(API_URL + `/games`);

        validate(response, "Failed to fetch games");

        const json = await response.json();
        return json.map((game: any) => gameFromResponse(game));
    }

    static async backlog(): Promise<Game[]> {
        const games = await GameAPI.all();
        return games.filter(game => game.list === null && !game.completed);
    }

    static async completed(): Promise<Game[]> {
        const games = await GameAPI.all();
        return games
            .filter(game => game.completed)
            .sort((a, b) => a.completed!.getTime() - b.completed!.getTime())
            .toReversed();
    }

    static async put(game: Game) {
        const response = await fetch(API_URL + "/games", {
            method: "PUT",
            body: gameToRequest(game),
        })

        validate(response, "Failed to update game");
    }

    static async remove(id: number) {
        const response = await fetch(API_URL + `/games/${id}`, {
            method: "DELETE",
        })

        validate(response, "Failed to delete game");
    }

    static async fromList(list: GameList): Promise<Game[]> {
        const games = await GameAPI.all();
        return games
            .filter(game => game.list === list.id)
            .sort((a, b) => a.order - b.order);
    }

    static async updateRating(game: Game, rating: number) {
        game = {...game};

        if (rating < 0 || rating > 5) {
            return;
        }

        game.rating = rating;
        await GameAPI.put(game);
    }

    static async complete(game: Game) {
        game = {...game};
        game.list = null;
        game.completed = new Date();

        if (!game?.lastPlayed || game.completed > game.lastPlayed) {
            game.lastPlayed = game.completed;
        }

        await GameAPI.put(game);
    }

    static async moveToList(game: Game, list: GameList) {
        game = {...game};
        game.list = list.id;
        game.completed = null;
        game.order = (await GameAPI.fromList(list)).length;
        await GameAPI.put(game);
    }

    static async moveToBacklog(game: Game) {
        game = {...game};
        game.list = null;
        game.completed = null;
        game.order = 0;
        await GameAPI.put(game);
    }

    static async setOrder(game: Game, newOrder: number) {
        game = {...game};
        game.order = newOrder;
        await GameAPI.put(game);
    }

    static async removeFromList(list: GameList) {
        const games = await GameAPI.all();
        games
            .filter(game => game.list == list.id)
            .forEach(game => {
                game.list = null;
                GameAPI.put(game);
            });
    }

    static async searchIGDB(search: string): Promise<IGDBGame[]> {
        const response = await fetch(API_URL + `/games/search/${search}`);

        validate(response, "Failed to fetch games");

        const json = await response.json();
        console.log(json);
        return json.map((game: any) => igdbGameFromResponse(game));
    }

    static async addIGDB(game: IGDBGame): Promise<Game> {
        return await GameAPI.add({
            id: 0,
            name: game.name,
            description: game.description,
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: game.cover,
            list: null,
            order: 0,
            completed: null,
            igdbId: game.id,
        });
    }
}
