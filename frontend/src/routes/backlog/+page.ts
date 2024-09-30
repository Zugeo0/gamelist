
import { GameAPI } from '$lib/api/Games';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    return {
        games: await GameAPI.backlog(),
    }
};
