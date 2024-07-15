
<script lang="ts">
    import { onMount } from "svelte";
    import { GameAPI, type Game } from "../api/Games";
    import Rating from "../components/Rating.svelte";
    import Icon from "@iconify/svelte";
    import { formatDate } from "../util";

    let games: Game[] = []

    onMount(async () => {
        await getCompletedGames();
    });

    async function getCompletedGames() {
        games = await GameAPI.completed()
    }
</script>

<div class="w-full h-full flex flex-col p-4 gap-4">
    {#each games as game}
        <div class="flex gap-4">
            <img class="game h-32" src={game.cover} alt="Game Cover">

            <div class="flex flex-col">
                <h1 class="justify-start font-lalezar text-2xl">{game.name}</h1>
                <Rating rating={game.rating} max={5} />
                <p class="text-surface0 line-clamp-3">{game.description}</p>
            </div>

            <div class="min-w-px h-full bg-base"></div>

            <div class="text-mauve flex flex-col items-center justify-center h-full gap-2 px-8">
                <Icon class="text-2xl" icon="bxs:calendar" />
                <p class="w-fit text-nowrap">{formatDate(game.completed)}</p>
            </div>

            <div class="text-peach flex flex-col items-center justify-center h-full gap-2 px-8">
                <Icon class="text-2xl" icon="mingcute:time-fill" />
                <p class="w-fit text-nowrap">{game.playtime / 60} hours</p>
            </div>

        </div>
    {/each}
</div>
