
<script lang="ts">
    import { onMount } from "svelte";
    import GameInfo from "../components/GameInfo.svelte";
    import { getGamesInBacklog, moveGameToList, updateGame, updateGameStatus, type GameData, deleteGame } from "../api";
    import Icon from "@iconify/svelte";
    import EditGame from "../components/EditGame.svelte";

    let games: GameData[] = [];
    let gameToUpdate: GameData | null = null;

    onMount(async () => {
        games = await getGamesInBacklog();
    });

    async function updateCustomStatus(id: number) {
        const newStatus = prompt("New status");

        if (newStatus) {
            await updateGameStatus(id, newStatus);
            games = await getGamesInBacklog();
        }
    }

    async function acceptUpdateGame(event: CustomEvent<GameData>) {
        gameToUpdate = null;
        const gameData = event.detail;

        try {
            const gameInList = games.find(game => game.id == gameData.id)!;
            const gameIndex = games.indexOf(gameInList);

            // the id should always be correct so this should never return null
            games[gameIndex] = await updateGame(gameData) as GameData;
        } catch (e) {
            console.log(e);
        }
    }

    async function moveToList(id: number) {
        // FIXME: Remove this and replace it with a dropdown menu
        const listid = parseInt(prompt("List ID") ?? '0');

        if (listid) {
            moveGameToList(id, listid);
            games = games.filter(game => game.id !== id);
        }
    }

    async function removeGame(id: number) {
        if (confirm('Are you sure you want to delete this game?')) {
            deleteGame(id);
            games = games.filter(game => game.id != id);
        }
    }
</script>

{#if games.length > 0}
    <div class="flex flex-col w-full">
        {#each games as game}
            <GameInfo class="group h-20 hover:bg-base transition-none cursor-default" selected={false} {game}>

                <!-- Status Button -->
                <button on:click={() => updateCustomStatus(game.id)} class="w-64 my-4 rounded-lg border border-base font-lalezar text-2xl group-hover:border-surface0 hover:bg-surface0 hover:border-surface1">
                    {game.state?.custom_status}
                </button>

                <!-- Move To List Button -->
                <button on:click={() => moveToList(game.id)} class="w-12 my-4 rounded-lg bg-base border border-surface0 opacity-0 group-hover:opacity-100 hover:bg-peach hover:border-peach hover:text-white flex justify-center items-center">
                    <Icon width={24} icon="material-symbols:move-up" />
                </button>

                <!-- Edit Button -->
                <button on:click={() => gameToUpdate = game} class="w-12 my-4 rounded-lg bg-base border border-surface0 opacity-0 group-hover:opacity-100 hover:bg-surface0 hover:border-surface1 flex justify-center items-center">
                    <Icon width={24} icon="material-symbols:edit" />
                </button>

                <!-- Delete Button -->
                <button on:click={() => removeGame(game.id)} class="w-12 my-4 rounded-lg bg-base border border-surface0 opacity-0 group-hover:opacity-100 hover:bg-red hover:border-red hover:text-white flex justify-center items-center">
                    <Icon width={24} icon="material-symbols:delete" />
                </button>
            </GameInfo>
        {/each}
    </div>

    {#if gameToUpdate}
        <EditGame on:accept={acceptUpdateGame} on:close={() => gameToUpdate = null} game={gameToUpdate} />
    {/if}
{:else}
    <div class="w-full h-full flex flex-col justify-center items-center select-none">
        <p class="text-white font-lalezar text-4xl mb-4">No Games In Backlog</p>
        <p>Games that are not currently on a list will end up here</p>
    </div>
{/if}

