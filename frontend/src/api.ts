
export interface GameList {
    id: number,
    name: string,
}

export interface GameData {
    id:               number,
    name:             string,
    description:      string,
    genres:           string[],
    artwork_url:      string    | null,
    release_date:     Date      | null,
    igdb_id:          string    | null,
    metacritic_score: number    | null,
    steam_id:         string    | null,
    state:            GameState | null,
}

export interface GameState {
    game_list:     number   | null,
    user_rating:   number,
    gametime_min:  number,
    list_order:    number,
    custom_status: string,
    completed:     boolean,
    last_played:   Date     | null,
}

let games: GameData[] = [
    {
        id:                1,
        name:              'Disco Elysium',
        description:       'Disco  Elysium: The Final Cut is a groundbreaking role playing game. You’re a  detective with a unique skill system at your disposal and a whole city  to carve your path across.\n\nInterrogate unforgettable characters, crack  murders or take bribes. Become a hero or an absolute disaster of a human  being.\n\nThe Final Cut adds full voice acting to the game, as well as new  quests, more characters and fresh explorable areas.',
        genres:            ['RPG', 'Adventure'],
        artwork_url:       'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffs-prod-cdn.nintendo-europe.com%2Fmedia%2Fimages%2F10_share_images%2Fgames_15%2Fnintendo_switch_4%2FH2x1_NSwitch_DiscoElysiumTheFinalCut_image1600w.jpg&f=1&nofb=1&ipt=362c2245869b9ddcca432fad34c2af5dd67a3a24e609c79c1c2c48f5b841048c&ipo=images',
        release_date:      new Date('2019-04-27'),
        igdb_id:           null,
        metacritic_score:  92,
        steam_id:          null,
        state: {
            game_list:     1,
            user_rating:   4,
            gametime_min:  975,
            list_order:    0,
            custom_status: 'On Hold',
            completed:     false,
            last_played:   new Date('2024-04-13'),
        }
    },
    {
        id:                2,
        name:              'Yakuza Kiwami',
        description:       'Yakuza Kiwami is a remake of the 2005 open world action-adventure game Yakuza.',
        genres:            ['RPG', 'Adventure'],
        artwork_url:       'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgugimages.s3.us-east-2.amazonaws.com%2Fwp-content%2Fuploads%2F2020%2F09%2F30220155%2Fdeb92e3e-76fb-4d54-abfb-202612c3fcf7.jpeg&f=1&nofb=1&ipt=67ba33c8a986bc60077224940f92390e3e859817aa3f1180a33e3a4acb4b016f&ipo=images',
        release_date:      new Date('2017-08-29'),
        igdb_id:           null,
        metacritic_score:  81,
        steam_id:          null,
        state: {
            game_list:     1,
            user_rating:   0,
            gametime_min:  0,
            list_order:    0,
            custom_status: '',
            completed:     false,
            last_played:   null,
        }
    }
];

let gamelists: GameList[] = [
    {
        id: 1,
        name: 'Main',
    }
];

let nextGameId = 3;
let nextGamelistId = 2;

export async function updateGameStatus(gameid: number, status: string): Promise<GameData | null> {
    const game = games.find(game => game.id === gameid);

    if (!game || !game.state) {
        return null;
    }

    game.state.custom_status = status;
    return game;
}

export async function updateGameRating(gameid: number, rating: number): Promise<GameData | null> {
    const game = games.find(game => game.id === gameid);

    if (!game || !game.state) {
        return null;
    }

    game.state.user_rating = rating;
    return game;
}

export async function setGameCompleted(gameid: number, completed: boolean) {
    const game = games.find(game => game.id === gameid);

    if (!game || !game.state) {
        return;
    }

    game.state.last_played = new Date();
    game.state.completed = completed;
}

export async function moveGameToList(gameid: number, listid: number) {
    const game = games.find(game => game.id === gameid);

    if (!game) {
        return;
    }

    if (!game.state) {
        await attachState(game.id);
    }

    game.state!.game_list = listid;
}

export async function moveGameToBacklog(gameid: number) {
    const game = games.find(game => game.id === gameid);

    if (!game) {
        return;
    }

    if (!game.state) {
        await attachState(game.id);
    }

    game.state!.game_list = null;
}

export async function deleteGame(id: number) {
    games = games.filter(game => game.id !== id);
}

export async function updateGameOrder(id: number, newOrder: number): Promise<GameData | null> {
    const game = games.find(game => game.id === id);

    if (!game || !game.state) {
        return null;
    }

    game.state.list_order = newOrder;
    return game;
}

export async function updateGame(
    newGame: GameData
): Promise<GameData | null> {
    const game = games.find(game => game.id === newGame.id);

    if (!game) {
        return null;
    }

    game.name = newGame.name;
    game.description = newGame.description;
    game.genres = newGame.genres;
    game.artwork_url = newGame.artwork_url;
    game.release_date = newGame.release_date;
    game.igdb_id = newGame.igdb_id;
    game.steam_id = newGame.steam_id;

    return game;
}

export async function createGame(
    gameData: GameData
): Promise<GameData> {
    const newGame = {...gameData};
    newGame.id = nextGameId++;
    games.push(newGame);
    return newGame;
}

export async function attachState(
    id: number,
    defaultList: number | null = null,
): Promise<GameState | null> {
    const game = games.find(game => game.id === id);

    if (!game || game.state) {
        return null;
    }

    const state = {
        game_list:     defaultList,
        user_rating:   0,
        gametime_min:  0,
        list_order:    Math.max(...games.map(game => game.state?.list_order ?? 0)) + 1,
        custom_status: '',
        completed:     false,
        last_played:   null,
    }

    game.state = state;
    
    return state;
}

export async function detachState(
    id: number,
) {
    const game = games.find(game => game.id === id);

    if (!game || !game.state) {
        return null;
    }
    
    game.state = null;
}

export async function getGamesInList(listid: number): Promise<GameData[]> {
    return games.filter(game => game.state?.game_list == listid).toSorted((a, b) => a.state!.list_order - b.state!.list_order);
}

export async function getGamesInBacklog(): Promise<GameData[]> {
    return games.filter(game => game.state?.game_list === null && !game.state?.completed).toSorted((a, b) => a.state!.list_order - b.state!.list_order);
}

export async function getUncompletedGamesInList(listid: number): Promise<GameData[]> {
    return games.filter(game => game.state?.game_list === listid && !game.state.completed).toSorted((a, b) => a.state!.list_order - b.state!.list_order);
}

export async function getCompletedGames(): Promise<GameData[]> {
    return games.filter(game => game.state?.completed)
        .toSorted((a, b) => a.state!.last_played!.valueOf() - b.state!.last_played!.valueOf())
        .toReversed();
}

export async function createGameList(name: string): Promise<GameList> {
    const gamelist = {
        id: nextGamelistId++,
        name: name,
    };
    gamelists.push(gamelist);
    return gamelist;
}

export async function deleteGameList(id: number) {
    gamelists = gamelists.filter(list => list.id !== id);
    games.filter(game => game.state && game.state.game_list == id).forEach(game => {
        game.state!.game_list = null;
    });
}

export async function getGameLists(): Promise<GameList[]> {
    return [...gamelists];
}

export async function getGameList(id: number): Promise<GameList | null> {
    const lists = gamelists.filter(list => list.id == id);
    return lists.length > 0 ? lists[0] : null;
}

export async function getFrontGameInList(listid: number): Promise<GameData | null> {
    const gamesInList = games.filter(list => list.state?.game_list == listid && !list.state?.completed).toSorted((a, b) => a.state!.list_order - b.state!.list_order);
    return gamesInList.length > 0 ? gamesInList[0] : null;
}

