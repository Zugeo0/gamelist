
<script lang="ts">
    import { type ActiveGame } from "../api";
    import { createEventDispatcher } from "svelte";
    import Icon from "@iconify/svelte";

    let dispatcher = createEventDispatcher();

    export let game: ActiveGame;

    // deep copy
    let originalGame: ActiveGame = {...game};
    originalGame.data = {...game.data};
    originalGame.data.genres = [...game.data.genres];
    originalGame.state = {...game.state};

    function close() {
        dispatcher("close");
    }

    function accept() {
        close()
    }

    $: changesMade = JSON.stringify(game) !== JSON.stringify(originalGame);
</script>

<div class="absolute inset-0 bg-[#00000088] flex flex-row justify-center items-center">
    <div class="relative w-[700px] h-[600px] bg-base border border-overlay0 rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <!-- Header image -->
        <img class="min-h-44 h-44 object-cover border-b border-b-black" src="https://source.unsplash.com/random" alt="Game Artwork">

        <!-- Game Name -->
        <h1 class="font-bungee text-center py-2 text-4xl text-white">
            {game.data.name}
        </h1>

        <!-- Game Description -->
        <div class="h-full bg-mantle border-t border-t-surface0 p-4">
            {game.data.description || "No description"}
        </div>

        <!-- Additional Database Info -->
        <div class="h-24 min-h-24 bg-crust border-t border-t-surface0">

        </div>

        <div class="absolute m-2 right-0 top-0 flex flex-row-reverse gap-2">
            {#if changesMade}
                <!-- Accept button -->
                <button on:click={accept} class="bg-green rounded-md p-2 shadow-xl text-white">
                    <Icon width={32} icon="mingcute:check-fill" />
                </button>
            {/if}

            <!-- Close button -->
            <button on:click={close} class="bg-surface0 rounded-md p-2 shadow-xl">
                <Icon width={32} icon="mingcute:close-fill" />
            </button>
        </div>
    </div>
</div>
