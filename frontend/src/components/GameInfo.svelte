<script lang="ts">
    import Icon from "@iconify/svelte";
    import { twMerge } from "tailwind-merge";
    import { type GameData } from "../api";

    export let game: GameData;
    export let selected: boolean;
</script>

<button on:click class={twMerge(
    "h-24 w-full flex flex-row hover:bg-base transition-all duration-75 border-b border-b-black",
    selected && "border-l-8 border-l-green bg-base"
)}>
    <div class="w-full h-full flex flex-col justify-around py-4 px-6 select-none">
        <!-- Game Title -->
        <h1 class="font-lalezar text-white text-xl text-left">
            {game.name}
        </h1>

        <!-- Game Info -->
        <div class="flex flex-row gap-4 items-center">

            <!-- Genres -->
            {#if game.genres.length > 0}
                <p>{game.genres[0]}</p>
            {/if}

            <!-- Release Date -->
            {#if game.release_date}
                <p>{game.release_date.getFullYear()}</p>
            {/if}

            <!-- Metacritic Score -->
            {#if game.metacritic_score}
                <div class="flex flex-row items-center gap-2">
                    <Icon icon="simple-icons:metacritic" />
                    <p>85</p>
                </div>
            {/if}
        </div>
    </div>

    <!-- Artwork -->
    {#if game.artwork_url}
        <img class="select-none w-32 h-full object-cover" src={game.artwork_url} alt="Artwork">
    {/if}
</button>
