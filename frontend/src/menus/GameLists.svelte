
<script lang="ts">
    import { onMount } from "svelte";
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game } from "../api/Games";
    import GameListComponent from "../components/GameListComponent.svelte";
    import Icon from "@iconify/svelte";
    import { Link } from "svelte-routing";

    let lists: GameList[] | null = null;

    onMount(async () => {
        lists = await fetchLists();
    })

    async function refreshLists() {
        lists = await fetchLists();
    }

    async function fetchLists(): Promise<GameList[]> {
        return await GameListAPI.all();
    }

    async function fetchGames(list: GameList): Promise<Game[]> {
        return await GameAPI.fromList(list)
    }
</script>

<div class="w-full h-full flex flex-col">
    {#if lists}
        {#each lists as list}
            {#await fetchGames(list)}
                <p>Loading...</p>
            {:then games} 

                <!-- Game List -->
                <div class="w-full p-3 flex flex-row gap-2 border-b border-base items-stretch h-fit">

                    <!-- Up Next Cover -->
                    {#if games[0]}
                        <Link class="game h-0 min-h-full" to="/">
                            <img class="game" src={games[0].cover} alt="Game Cover">
                        </Link>
                    {:else}
                        <div class="game h-0 min-h-full border border-base flex justify-center items-center text-base font-bold text-3xl">
                            EMPTY
                        </div>
                    {/if}

                    <div class="min-w-px h-full bg-base"></div>

                    <!-- List Details -->
                    <div class="flex flex-col gap-2 flex-grow">

                        <!-- Toolbar -->
                        <div class="toolbar group">
                            <h1 class="toolbar-element flex-grow justify-start py-1 font-lalezar text-2xl">{list.name}</h1>

                            <!-- Edit game button -->
                            <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="material-symbols:edit" />
                            </button>

                            <!-- Delete game button -->
                            <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="mdi:trash" />
                            </button>

                        </div>

                        <!-- Games -->
                        <GameListComponent
                            gameList={list}
                            on:update={() => refreshLists()}
                            />

                    </div>

                </div>
                
            {/await}
        {/each}
    {/if}
</div>
