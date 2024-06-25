
<script lang="ts">
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game } from "../api/Games";
    import { formatDate } from "../util";
    import { Link } from 'svelte-routing';
    import Icon from "@iconify/svelte";
    import Rating from "../components/Rating.svelte";

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

                    <div class="min-w-px h-full bg-base"></div>

                    <!-- List Details -->
                    <div class="flex flex-col gap-2 flex-grow">

                        <!-- Toolbar -->
                        <div class="toolbar overflow-hidden group">

                            <!-- Go to game lists button -->
                            <Link to="games" class="toolbar-btn flex-grow justify-start py-1 font-lalezar text-2xl">{list.name}</Link>

                            <!-- Edit game button -->
                            <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="material-symbols:edit" />
                            </button>

                            <!-- Delete game button -->
                            <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="lets-icons:remove-fill" />
                            </button>

                            <!-- Move game to backlog button -->
                            <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="fa6-solid:dumpster" />
                            </button>

                            <!-- Complete game button -->
                            <button class="toolbar-btn">
                                <p>Complete</p>
                                <Icon icon="fluent-mdl2:completed-solid" />
                            </button>

                        </div>

                        <!-- Game Details -->
                        <div class="flex flex-row gap-2 h-48 px-2">
                            {#if game}

                                <!-- Game info -->
                                <div class="flex flex-col">
                                    <h1 class="font-lalezar text-white text-3xl uppercase">{ game.name }</h1>

                                    <Rating rating={3} max={5} interactable />

                                    <p class="text-surface2 line-clamp-5">{ game.description }</p>
                                </div>

                                <div class="min-w-px h-full bg-base"></div>

                                <!-- Playtime stats -->
                                <div class="flex flex-col items-stretch gap-2 min-w-[300px]">
                                    
                                    <!-- Last played -->
                                    <div class="flex flex-row justify-between">
                                        <p>Last Played</p>
                                        {#if game.lastPlayed}
                                            <p class="font-bold text-mauve">{ formatDate(game.lastPlayed) }</p>
                                        {:else}
                                            <p class="font-bold text-mauve">Never</p>
                                        {/if}
                                    </div>

                                    <!-- Playtime -->
                                    <div class="flex flex-row justify-between">
                                        <p>Play Time</p>
                                        <p class="font-bold text-peach">{game.playtime} hours</p>
                                    </div>
                                    
                                </div>
                            
                            {:else}

                                <div class="text-3xl text-cat-base font-bold font-lalezar size-full flex justify-center items-center uppercase">
                                    No game in list
                                </div>

                            {/if}
                        </div>


                    </div>

                </div>
                
            {/await}
        {/each}
    {/await}
</div>
