
import { validate } from "./Common";
import { env } from "$env/dynamic/public";

export type GameList = {
    id: number,
    name: string,
};

export class GameListAPI {
    static async add(list: GameList) {
        const response = await fetch(env.PUBLIC_API_URL + "/lists", {
            method: "POST",
            body: JSON.stringify({
                name: list.name,
            }),
        });

        validate(response, "Failed to add new game list");
    }

    static async get(id: number): Promise<GameList | null> {
        const response = await fetch(env.PUBLIC_API_URL + `/lists/${id}`);

        validate(response, "Failed to fetch game list by id");

        return await response.json();
    }

    static async all(): Promise<GameList[]> {
        const response = await fetch(env.PUBLIC_API_URL + "/lists");

        validate(response, "Failed to fetch game lists");

        return await response.json();
    }

    static async put(list: GameList) {
        const response = await fetch(env.PUBLIC_API_URL + "/lists", {
            method: "PUT",
            body: JSON.stringify({
                id: list.id,
                name: list.name,
            }),
        });

        validate(response, "Failed to update game list");
    }

    static async remove(id: number) {
        const response = await fetch(env.PUBLIC_API_URL + `/lists/${id}`, {
            method: "DELETE",
        });

        validate(response, "Failed to remove game list");
    }
}

