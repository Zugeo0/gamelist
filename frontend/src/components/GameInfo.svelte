<script lang="ts">
    import Icon from "@iconify/svelte";
    import { twMerge } from "tailwind-merge";
    import { type GameData } from "../api";

    export let game: GameData;
    export let selected: boolean;

    let className: string = "";

    export { className as class };
</script>

<button on:click class={twMerge(
    "h-24 w-full flex flex-row items-stretch flex-between hover:bg-base transition-all duration-75 border-b border-b-black",
    selected && "border-l-8 border-l-green bg-base",
    className
)}>
    <!-- Left Side -->
    <div class="h-full flex flex-col justify-around py-4 px-6 select-none">

        <!-- Game Title -->
        <h1 class="font-lalezar text-white text-2xl text-left">
            {game.name}
        </h1>

        <!-- Game Info -->
        <div class="flex flex-row gap-4 items-center">

            <!-- Description if no other information is present -->
            {#if game.genres.length == 0 && !game.release_date && !game.metacritic_score}
                <p>{game.description || 'No description'}</p>
            {/if}

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
                    <p>{game.metacritic_score}</p>
                </div>
            {/if}
        </div>

    </div>

    <!-- Right Side -->
    <div class="flex-grow flex flex-row-reverse gap-4">
        <!-- Artwork -->
        <div class="w-32 h-full bg-crust border-l border-l-base flex justify-center items-center">
            {#if game.artwork_url}
                <img class="select-none h-full object-cover" src={game.artwork_url} alt="Artwork">
            {:else}
                <p>No Artwork</p>
            {/if}
        </div>

        <!-- Custom Elements -->
        <slot />
    </div>
</button>
