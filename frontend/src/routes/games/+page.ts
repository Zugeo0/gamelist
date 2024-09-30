
import { GameListAPI, type GameList } from '$lib/api/GameLists';
import { GameAPI, type Game } from '$lib/api/Games';
import type { PageLoad } from './$types';

export interface GamesPageGameList {
    data: GameList,
    front: Game | null,
    games: Game[],
};

export const load: PageLoad = async ({ params }) => {
    let listData = await GameListAPI.all();
    let lists: GamesPageGameList[] = [];

    for (let i = 0; i < listData.length; i++) {
        lists.push({
            data: listData[i],
            front: await GameAPI.front(listData[i]),
            games: await GameAPI.fromList(listData[i]),
        })
    }

    return {
        lists: lists,
    }
};

