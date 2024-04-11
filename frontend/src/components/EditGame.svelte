
<script lang="ts">
    import { type GameData } from "../api";
    import { createEventDispatcher, onMount } from "svelte";
    import Icon from "@iconify/svelte";

    let dispatcher = createEventDispatcher<{close: undefined, accept: GameData}>();

    export let game: GameData;

    // deep copy
    game = {...game};
    game.genres = [...game.genres];

    if (game.state) {
        game.state = {...game.state};
    }

    function close() {
        dispatcher("close");
    }

    function accept() {
        dispatcher("accept", game);
    }

    function editArtwork() {
        let url = prompt("Enter Artwork URL");
        game.artwork_url = url ?? null;
    }
</script>

<div class="absolute inset-0 bg-[#00000088] flex flex-row justify-center items-center">
    <div class="relative w-[700px] h-[600px] bg-base border border-overlay0 rounded-2xl shadow-lg flex flex-col overflow-hidden">

        <!-- Header image -->
        {#if game.artwork_url}
            <img class="min-h-44 h-44 object-cover border-b border-b-black" src={game.artwork_url} alt="Game Artwork">
        {/if}

        <!-- Game Name -->
        <input bind:value={game.name} type="text" placeholder="No Name" class="bg-base outline-none max-h-28 py-2 font-lalezar text-center text-4xl text-white">

        <div class="h-full w-full bg-mantle border-t border-t-surface0 flex flex-col">

            <!-- Game Description -->
            <textarea bind:value={game.description} placeholder="No description." class="h-full w-full bg-mantle p-4 outline-none"></textarea>

            <!-- TODO: GameDB button -->

        </div>

        <!-- Additional Database Info -->
        <div class="h-24 min-h-24 bg-crust border-t border-t-surface0">

        </div>

        <div class="absolute m-2 right-0 top-0 flex flex-row-reverse gap-2">
            <!-- Accept button -->
            <button on:click={accept} class="bg-surface0 rounded-md p-2 shadow-xl hover:text-white hover:bg-surface1">
                <Icon width={32} icon="mingcute:check-fill" />
            </button>

            <!-- Close button -->
            <button on:click={close} class="bg-surface0 rounded-md p-2 shadow-xl hover:text-white hover:bg-surface1">
                <Icon width={32} icon="mingcute:close-fill" />
            </button>

            <!-- Edit artwork button -->
            <button on:click={editArtwork} class="bg-surface0 rounded-md p-2 shadow-xl hover:text-white hover:bg-surface1">
                <Icon width={32} icon="material-symbols:edit" />
            </button>
        </div>

    </div>
</div>
