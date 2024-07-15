
<script lang="ts">
    import { onMount } from "svelte";
    import { GameAPI, type Game } from "../api/Games";
    import Icon from "@iconify/svelte";

    let games: Game[];
    let selectedGame: Game | null = null;

    onMount(async () => {
        await refreshGames();
    });

    async function refreshGames() {
        games = await GameAPI.backlog();
    }
</script>

<div class="w-full h-full flex flex-col p-4 gap-4">

    <div class="flex flex-wrap gap-4 items-center">
        {#if games}
            {#each games as game}
                <button 
                    on:click={() => {
                        if (selectedGame === game)
                            selectedGame = null;
                        else
                            selectedGame = game;
                    }}
                    >
                    {#if game === selectedGame}
                        <img class="game h-48 outline outline-mauve" src={game.cover} alt="Game Cover">
                    {:else}
                        <img class="game h-48" src={game.cover} alt="Game Cover">
                    {/if}
                </button>
            {/each}
        {/if}
    </div>

    {#if selectedGame}
        <div class="mt-auto toolbar">
            <h1 class="toolbar-element flex-grow justify-start py-1 font-lalezar text-2xl">{selectedGame.name}</h1>

            <!-- Move game to game list button -->
            <button class="toolbar-btn">
                <p>Move to list</p>
                <Icon icon="material-symbols:move-up" />
            </button>

            <!-- Edit game list button -->
            <button class="toolbar-btn">
                <Icon icon="material-symbols:edit" />
            </button>

            <!-- Delete game list button -->
            <button class="toolbar-btn">
                <Icon icon="mdi:trash" />
            </button>

        </div>
    {/if}

</div>
