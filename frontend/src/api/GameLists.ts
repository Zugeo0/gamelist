
import { GameAPI } from "./Games";

export type GameList = {
    id: number,
    name: string,
};

export class GameListAPI {
    static nextId: number = 2;
    static lists: GameList[] = [
        {
            id: 0,
            name: "Main",
        },
        {
            id: 1,
            name: "Side",
        }
    ];

    static async add(list: GameList) {
        let newList = {...list};
        newList.id = GameListAPI.nextId++;
        GameListAPI.lists.push(newList);
    }

    static async get(id: number): Promise<GameList | null> {
        let list = GameListAPI.lists.find(list => list.id === id) ?? null;

        if (list)
            list = {...list};

        return list;
    }

    static async all(): Promise<GameList[]> {
        return [...GameListAPI.lists.map(list => { return {...list} })];
    }

    static async put(list: GameList) {
        let newList = {...list};
        GameListAPI.lists = GameListAPI.lists.filter(l => l.id !== list.id);
        GameListAPI.lists.push(newList);
    }

    static async remove(id: number) {
        const list = GameListAPI.lists.find(list => list.id === id);

        if (!list) {
            return;
        }

        GameListAPI.lists = GameListAPI.lists.filter(list => list.id !== id);
        GameAPI.removeFromList(list);
    }
}

