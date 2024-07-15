
<script lang="ts">

    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import { GameAPI, type Game } from "../api/Games";
    import { twMerge } from "tailwind-merge";
    import { onMount, createEventDispatcher } from "svelte";
    import { type GameList } from "../api/GameLists";

    const flipDurationMs = 50;

    export let gameList: GameList;

    let games: Game[] = [];
    let showAddButton = false;

    const dispatch = createEventDispatcher<{
        update: null;
        add: null;
    }>();

    onMount(async () => {
        games = await GameAPI.fromList(gameList);
    });

    async function handleConsider(e: CustomEvent<DndEvent<Game>>) {
        games = e.detail.items;
    }

    async function handleFinalize(e: CustomEvent<DndEvent<Game>>) {
        games = e.detail.items;

        games.forEach((game, i) => {
            game.order = i;
            game.list = gameList.id;
            GameAPI.put(game);
        })

        dispatch('update');
    }

</script>

<section
    use:dndzone={{
        items: games,
        flipDurationMs,
        dropTargetStyle: {},
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
    class={twMerge("flex flex-row gap-2 h-48 overflow-x-scroll", !showAddButton && "w-full")}
    >
    {#each games as game (game.id)}
        <img animate:flip={{duration: flipDurationMs}} class="game h-48" src={game.cover} alt="Game Cover">
    {/each}

</section>
