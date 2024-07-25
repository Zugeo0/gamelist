
import { API_URL } from "./Common";

export type GameList = {
    id: number,
    name: string,
};

export class GameListAPI {
    static async add(list: GameList) {
        const response = await fetch(API_URL + "/lists", { 
            method: "POST", 
            body: JSON.stringify({
                name: list.name,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add new game list: ${response.status} ${response.statusText}`);
        }
    }

    static async get(id: number): Promise<GameList | null> {
        const response = await fetch(API_URL + `/lists/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch game lists: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    static async all(): Promise<GameList[]> {
        const response = await fetch(API_URL + "/lists");

        if (!response.ok) {
            throw new Error(`Failed to fetch game lists: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    static async put(list: GameList) {
        const response = await fetch(API_URL + "/lists", { 
            method: "PUT", 
            body: JSON.stringify({
                id: list.id,
                name: list.name,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add new game list: ${response.status} ${response.statusText}`);
        }
    }

    static async remove(id: number) {
        const response = await fetch(API_URL + `/lists/${id}`, { 
            method: "DELETE", 
        });

        if (!response.ok) {
            throw new Error(`Failed to add new game list: ${response.status} ${response.statusText}`);
        }
    }
}

