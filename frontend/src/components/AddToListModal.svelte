
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { GameListAPI, type GameList } from "../api/GameLists";
    import { type Game, GameAPI } from "../api/Games";

    export let game: Game;

    const dispatcher = createEventDispatcher<{
        select: undefined;
    }>();

    let searchBar: HTMLInputElement;
    let searchResults: GameList[] = [];

    async function searchLists(search: string) {
        const lists = await GameListAPI.all()
        searchResults = lists
            .filter(list => {
                // TODO: Sort based on relevancy
                const listName = list.name.toLowerCase();
                const searchParams = search.toLowerCase().split(' ');
                for (let i = 0; i < searchParams.length; i++) {
                    if (!listName.includes(searchParams[i]))
                        return false;
                }
                return true;
            });
    }
</script>

<div class="flex flex-col gap-2">
    <input
        class="bg-base text-text px-4 py-2 mb-4 rounded-md placeholder:text-surface0 w-[500px] outline-none focus:outline-mauve"
        type="text"
        placeholder="Search backlog"
        bind:this={searchBar}
        on:focus={() => searchLists('')}
        on:input={(e) => searchLists(e.target.value)}
        >

    <div class="flex flex-col overflow-y-scroll max-h-80">
        {#each searchResults as list}
            <button 
                class="flex gap-4 p-2 w-[500px] rounded-md hover:bg-base"
                on:click={async () => {
                    await GameAPI.moveToList(game, list);
                    dispatcher("select");
                }}
                >
                <h1 class="text-white uppercase font-lalezar text-xl">{list.name}</h1>
            </button>
        {/each}
    </div>
</div>
