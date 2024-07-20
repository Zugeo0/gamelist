
<script lang="ts">
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game } from "../api/Games";
    import { formatDate } from "../util";
    import { Link, navigate } from 'svelte-routing';
    import Icon from "@iconify/svelte";
    import Rating from "../components/Rating.svelte";
    import { onMount } from "svelte";
    import Modal from "../components/Modal.svelte";
    import ConfirmationModal from "../components/ConfirmationModal.svelte";

    let lists: GameList[] | null = null;

    let deleteConfirmModal: Modal;
    let gameToDelete: Game;

    onMount(async () => {
        lists = await fetchLists();
    })

    async function refreshList() {
        lists = await fetchLists();
    }

    async function fetchLists(): Promise<GameList[]> {
        return await GameListAPI.all();
    }

    async function fetchFront(list: GameList): Promise<Game | null> {
        return await GameAPI.front(list)
    }

    async function updateRating(game: Game, rating: number) {
        await GameAPI.updateRating(game, rating);
    }

    async function completeGame(game: Game) {
        await GameAPI.complete(game);
        navigate('/completions');
    }

    async function moveGameToBacklog(game: Game) {
        await GameAPI.moveToBacklog(game);
        await refreshList();
    }
</script>

<div class="w-full h-full flex flex-col">
    {#if lists} 
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

                            {#if game}

                                <!-- Edit game button -->
                                <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                    <Icon icon="material-symbols:edit" />
                                </button>

                                <!-- Delete game button -->
                                <button 
                                    on:click={() => {
                                        gameToDelete = game;
                                        deleteConfirmModal.show();
                                    }} 
                                    class="toolbar-btn opacity-0 group-hover:opacity-100"
                                    >
                                    <Icon icon="mdi:trash" />
                                </button>

                                <!-- Move game to backlog button -->
                                <button on:click={() => moveGameToBacklog(game)} class="toolbar-btn opacity-0 group-hover:opacity-100">
                                    <Icon icon="fa6-solid:dumpster" />
                                </button>

                                <!-- Complete game button -->
                                <button on:click={() => completeGame(game)} class="toolbar-btn">
                                    <p>Complete</p>
                                    <Icon icon="fluent-mdl2:completed-solid" />
                                </button>

                            {/if}

                        </div>

                        <!-- Game Details -->
                        <div class="flex flex-row gap-2 h-48 px-2">
                            {#if game}

                                <!-- Game info -->
                                <div class="flex flex-col flex-grow">
                                    <h1 class="font-lalezar text-white text-3xl uppercase">{ game.name }</h1>

                                    <Rating rating={game.rating} max={5} on:update={e => updateRating(game, e.detail)} interactable />

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
    {/if}
</div>

<Modal bind:this={deleteConfirmModal}>
    {#if gameToDelete}
        <ConfirmationModal 
            on:cancel={() => deleteConfirmModal.hide()}
            on:confirm={async () => {
                deleteConfirmModal.hide();
                await GameAPI.remove(gameToDelete.id);
                await refreshList();
            }}
            message="Are you sure you want to delete {gameToDelete.name}"
            />
    {/if}
</Modal>
