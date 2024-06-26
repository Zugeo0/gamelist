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
    completed: boolean,
};

export class GameAPI {
    private static nextId = 0;
    private static games: Game[] = [
        {
            id: 0,
            name: "Disco Elysium",
            description: "Disco Elysium: The Final Cut is a groundbreaking role playing game. You’re a detective with a unique skill system at your disposal and a whole city to carve your path across. Interrogate unforgettable characters, crack murders or take bribes. Become a hero or an absolute disaster of a human being. The Final Cut adds full voice acting to the game, as well as new quests, more characters and fresh explorable areas.",
            rating: 3,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/e17233dc1c4e3457d5a259c06c7eb502.jpg",
            list: 0,
            order: 0,
            completed: false,
        },
        {
            id: 1,
            name: "Yakuza Kiwami",
            description: "Yakuza Kiwami is a remake of the 2005 open world action-adventure game Yakuza.",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/9daff58346c37a54d31d0219bd873f6a.jpg",
            list: 0,
            order: 1,
            completed: false,
        },
        {
            id: 2,
            name: "Resident Evil 2",
            description: "",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/fb5b3b5d234aa718062e3b4f6c826e23.jpg",
            list: 0,
            order: 0,
            completed: false
        },
        {
            id: 3,
            name: "Alan Wake",
            description: "",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/ef95b846b1e8469e32e7831643ca00ef.jpg",
            list: 0,
            order: 0,
            completed: false
        },
        {
            id: 4,
            name: "Quantum Break",
            description: "",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/583a9a3c0b349b7282d5db3aee07ac43.jpg",
            list: 0,
            order: 0,
            completed: false
        },
        {
            id: 5,
            name: "Control",
            description: "",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/f66a0c26ea3a640283a18af4915c577a.jpg",
            list: 0,
            order: 0,
            completed: false
        },
        {
            id: 6,
            name: "Alan Wake 2",
            description: "",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/a7147fd59ab64d16e49e819733ad2187.jpg",
            list: 0,
            order: 0,
            completed: false
        },
        {
            id: 7,
            name: "Final Fantasy VII",
            description: "",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/fb038c3ed829a992d6d4cc3ce6654290.jpg",
            list: 0,
            order: 0,
            completed: false
        },
    ];

    static async add(game: Game) {
        let newGame = {...game};
        newGame.id = GameAPI.nextId++;
        GameAPI.games.push(newGame);
    }

    static async get(id: number): Promise<Game | null> {
        let game = GameAPI.games.find(game => game.id === id) ?? null;

        if (game)
            game = {...game};

        return game;
    }

    static async front(list: GameList): Promise<Game | null> {
        let game = GameAPI.games
            .filter(game => game.list === list.id)
            .sort((a, b) => a.order - b.order)
            .at(0);
        
        if (game)
            game = {...game};

        return game ?? null;
    }

    static async all(): Promise<Game[]> {
        return [...GameAPI.games.map(game => { return {...game} })];
    }

    static async put(game: Game) {
        let newGame = {...game};
        GameAPI.games = GameAPI.games.filter(g => g.id !== game.id);
        GameAPI.games.push(newGame);
    }

    static async remove(id: number) {
        GameAPI.games = GameAPI.games.filter(game => game.id !== id);
    }

    static async fromList(list: GameList): Promise<Game[]> {
        return GameAPI.games
            .filter(game => game.list === list.id)
            .sort((a, b) => a.order - b.order);
    }

    static async updateRating(game: Game, rating: number) {
        if (rating < 0 || rating > 5) {
            return;
        }

        game.rating = rating;
        await GameAPI.put(game);
    }

    static async complete(game: Game) {
        game.list = null;
        game.completed = true;
        await GameAPI.put(game);
    }

    static async moveToBacklog(game: Game) {
        game.list = null;
        game.completed = false;
        await GameAPI.put(game);
    }

    static async setOrder(game: Game, newOrder: number) {
        game.order = newOrder;
        await GameAPI.put(game);
    }

    static async removeFromList(list: GameList) {
        GameAPI.games
            .filter(game => game.list == list.id)
            .forEach(game => game.list = null);
    }
}
