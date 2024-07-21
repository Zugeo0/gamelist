
<script lang="ts">
    import { onMount } from "svelte";
    import { GameAPI, type Game } from "../api/Games";
    import Rating from "../components/Rating.svelte";
    import Icon from "@iconify/svelte";
    import { formatDate } from "../util";
    import Modal from "../components/Modal.svelte";
    import EditGameModal from "../components/EditGameModal.svelte";

    let games: Game[] = []

    let editGameModal: Modal;
    let gameToEdit: Game | null = null;

    onMount(async () => {
        await refreshGames();
    });

    async function refreshGames() {
        games = await GameAPI.completed()
    }

    async function moveToBacklog(game: Game) {
        await GameAPI.moveToBacklog(game);
        games = await GameAPI.completed();
    }
</script>

<div class="w-full h-full flex flex-col p-4 gap-4 overflow-y-scroll">
    {#each games as game}
        <div class="flex gap-4 group">
            <img class="game h-32" src={game.cover} alt="Game Cover">

            <div class="flex flex-col flex-grow">
                <h1 class="justify-start font-lalezar text-2xl">{game.name}</h1>
                <Rating rating={game.rating} max={5} />

                <p class="text-surface0 line-clamp-3 group-hover:line-clamp-1">{game.description}</p>

                <div class="hidden group-hover:toolbar mt-auto">

                    <!-- Move game to list button -->
                    <button 
                        on:click={() => moveToBacklog(game)}
                        class="toolbar-btn"
                        >
                        <p>Move to backlog</p>
                        <Icon icon="fa6-solid:dumpster" />
                    </button>

                    <!-- Edit game list button -->
                    <button 
                        on:click={() => {
                            gameToEdit = game;
                            editGameModal.show();
                        }}
                        class="toolbar-btn"
                        >
                        <p>Edit Game</p>
                        <Icon icon="material-symbols:edit" />
                    </button>

                </div>

            </div>

            <div class="min-w-px h-full bg-base"></div>

            {#if game.completed}
                <div class="text-mauve flex flex-col items-center justify-center h-full gap-2 px-8">
                    <Icon class="text-2xl" icon="bxs:calendar" />
                    <p class="text-center w-24 text-nowrap">{formatDate(game.completed)}</p>
                </div>
            {/if}

            <div class="text-peach flex flex-col items-center justify-center h-full gap-2 px-8">
                <Icon class="text-2xl" icon="mingcute:time-fill" />
                <p class="text-center w-24 text-nowrap">{game.playtime / 60} hours</p>
            </div>

        </div>
    {/each}
</div>

<Modal 
    bind:this={editGameModal} 
    on:close={async () => {
        gameToEdit = null;
        await refreshGames();
    }}
    >
    {#if gameToEdit}
        <EditGameModal game={gameToEdit} />
    {/if}
</Modal>
