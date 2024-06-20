
<script lang="ts">
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game } from "../api/Games";
    import { Link } from 'svelte-routing';
    import {  } from "@iconify/svelte";

    async function fetchLists(): Promise<GameList[]> {
        return await GameListAPI.all();
    }

    async function fetchFront(list: GameList): Promise<Game | null> {
        return await GameAPI.front(list)
    }
</script>

<div class="w-full h-full flex flex-col">
    {#await fetchLists()}
        <p>Loading...</p>
    {:then lists} 
        {#each lists as list}
            {#await fetchFront(list)}
                <p>Loading...</p>
            {:then game} 

                <!-- Game List -->
                <div class="w-full p-3 flex flex-row gap-2 border-b border-base items-stretch h-fit">

                    <!-- Up Next Cover -->
                    {#if game}
                        <img class="game h-0 min-h-full" src={game.cover} alt="Game Cover">
                    {:else}
                        <div class="game h-0 min-h-full border border-base flex justify-center items-center text-base font-bold text-3xl">
                            EMPTY
                        </div>
                    {/if}

                    <div class="w-px h-full bg-base"></div>

                    <!-- List Details -->
                    <div class="flex flex-col gap-2 flex-grow">

                        <!-- Toolbar -->
                        <Link to="games" class="toolbar hover:bg-surface0 transition-colors">
                            <h1 class="font-lalezar my-2 ml-4 mr-auto text-2xl">{list.name}</h1>
                        </Link>

                        <!-- Games -->
                        <div class="flex flex-row gap-2 h-48">
                        </div>

                    </div>

                </div>
                
            {/await}
        {/each}
    {/await}
</div>
