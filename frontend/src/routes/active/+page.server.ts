
import { GameListAPI, type GameList } from '$lib/api/GameLists';
import { GameAPI, type Game } from '$lib/api/Games';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export interface ActivePageGameList {
    data: GameList,
    front: Game | null,
};

export const load: PageServerLoad = async ({ params }) => {
    let listData = await GameListAPI.all();
    let lists: ActivePageGameList[] = [];

    for (let i = 0; i < listData.length; i++) {
        lists.push({
            data: listData[i],
            front: await GameAPI.front(listData[i])
        })
    }

    return {
        lists: lists,
    }
};

export const actions: Actions = {
    completeGame: async ({ request }) => {
        const data = await request.formData()
        const gameid = data.get('id');

        if (!gameid || Number.isNaN(Number(gameid))) {
            throw error(400, 'gameid must be provided');
        }

        const game = await GameAPI.get(Number(gameid));

        if (!game)
            throw error(404, 'Game not found');

        await GameAPI.complete(game);
        //throw redirect(308, '/completions');
    },

    deleteGame: async ({ request }) => {
        const data = await request.formData()
        const gameid = data.get('id');

        if (!gameid || Number.isNaN(Number(gameid))) {
            throw error(400, 'gameid must be provided');
        }

        await GameAPI.remove(Number(gameid));
    },

    moveToBacklog: async ({ request }) => {
        const data = await request.formData();
        const gameid = data.get('id');

        if (!gameid || Number.isNaN(Number(gameid))) {
            throw error(400, 'gameid must be provided');
        }

        const game = await GameAPI.get(Number(gameid));

        if (!game)
            throw error(404, 'Game not found');

        await GameAPI.moveToBacklog(game);
    }
}

