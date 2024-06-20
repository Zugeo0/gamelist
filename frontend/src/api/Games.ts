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
            order: 0
        },
        {
            id: 1,
            name: "Yakuza Kiwami",
            description: "Descr",
            rating: 0,
            lastPlayed: null,
            playtime: 0,
            cover: "https://cdn2.steamgriddb.com/thumb/9daff58346c37a54d31d0219bd873f6a.jpg",
            list: 0,
            order: 1
        }
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
}
