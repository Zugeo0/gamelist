
<script lang="ts">
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game } from "../api/Games";
    import {  } from "@iconify/svelte";

    async function fetchLists(): Promise<GameList[]> {
        return await GameListAPI.all();
    }

    async function fetchGames(list: GameList): Promise<Game[]> {
        return await GameAPI.fromList(list)
    }
</script>

<div class="w-full h-full flex flex-col">
    {#await fetchLists()}
        <p>Loading...</p>
    {:then lists} 
        {#each lists as list}
            {#await fetchGames(list)}
                <p>Loading...</p>
            {:then games} 

                <!-- Game List -->
                <div class="w-full p-3 flex flex-row gap-2 border-b border-base items-stretch h-fit">

                    <!-- Up Next Cover -->
                    {#if games[0]}
                        <img class="game h-0 min-h-full" src={games[0].cover} alt="Game Cover">
                    {:else}
                        <div class="game h-0 min-h-full border border-base flex justify-center items-center text-base font-bold text-3xl">
                            EMPTY
                        </div>
                    {/if}

                    <div class="min-w-px h-full bg-base"></div>

                    <!-- List Details -->
                    <div class="flex flex-col gap-2 flex-grow">

                        <!-- Toolbar -->
                        <div class="toolbar">
                            <h1 class="toolbar-element flex-grow justify-start py-1 font-lalezar text-2xl">{list.name}</h1>
                        </div>

                        <!-- Games -->
                        <div class="flex flex-row gap-2">
                            {#each games as game}
                                <img class="game h-48" src={game.cover} alt="Game Cover">
                            {/each}

                            <button class="game h-48 border-4 border-base text-surface1 flex justify-center items-center font-bold text-3xl hover:bg-base transition-colors">
                                +
                            </button>
                        </div>

                    </div>

                </div>
                
            {/await}
        {/each}
    {/await}
</div>
