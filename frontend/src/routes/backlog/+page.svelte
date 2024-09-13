
<script lang="ts">
    import { onMount } from "svelte";
    import { GameAPI, type Game } from "$lib/api/Games";
    import Icon from "@iconify/svelte";
    import Modal from "$lib/components/Modal.svelte";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";
    import EditGameModal from "$lib/components/EditGameModal.svelte";
    import { twMerge } from "tailwind-merge";
    import AddToListModal from "$lib/components/AddToListModal.svelte";

    let games: Game[];
    let selectedGame: Game | null = null;

    let deleteGameModal: Modal;
    let editGameModal: Modal;
    let moveGameModal: Modal;

    let gameToEdit: Game | null = null;

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
                        if (selectedGame?.id === game.id)
                            selectedGame = null;
                        else
                            selectedGame = game;
                    }}
                    >
                    <img class={twMerge("game h-48", selectedGame?.id === game.id && "outline outline-mauve")} src={game.cover} alt="Game Cover">
                </button>
            {/each}
        {/if}
    </div>

    {#if selectedGame}
        <div class="mt-auto toolbar">
            <h1 class="toolbar-element flex-grow justify-start py-1 font-lalezar text-2xl">{selectedGame.name}</h1>

            <!-- Move game to game list button -->
            <button 
                on:click={() => moveGameModal.show()}
                class="toolbar-btn"
                >
                <p>Move to list</p>
                <Icon icon="material-symbols:move-up" />
            </button>

            <!-- Edit game list button -->
            <button 
                on:click={() => {
                    gameToEdit = selectedGame;
                    editGameModal.show();
                }}
                class="toolbar-btn"
                >
                <Icon icon="material-symbols:edit" />
            </button>

            <!-- Delete game list button -->
            <button 
                on:click={() => deleteGameModal.show()}
                class="toolbar-btn"
                >
                <Icon icon="mdi:trash" />
            </button>

        </div>
    {/if}

</div>

<Modal bind:this={deleteGameModal}>
    {#if selectedGame}
        <ConfirmationModal 
            message="Are you sure you want to delete {selectedGame.name}"
            on:cancel={() => deleteGameModal.hide()}
            on:confirm={async () => {
                if (!selectedGame) {
                    return;
                }

                deleteGameModal.hide();
                await GameAPI.remove(selectedGame.id);
                await refreshGames();
            }}
            />
    {/if}
</Modal>

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

<Modal bind:this={moveGameModal}>
    {#if selectedGame}
        <AddToListModal 
            on:select={async () => {
                await refreshGames();
                moveGameModal.hide();
            }}
            game={selectedGame}
            />
    {/if}
</Modal>
