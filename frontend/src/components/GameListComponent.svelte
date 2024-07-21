
<script lang="ts">

    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import { GameAPI, type Game } from "../api/Games";
    import { twMerge } from "tailwind-merge";
    import { onMount, createEventDispatcher } from "svelte";
    import { type GameList } from "../api/GameLists";

    const flipDurationMs = 50;

    export let gameList: GameList;
    export let selectedGame: Game | null;

    let games: Game[] = [];

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
        });

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
    class="flex flex-row gap-2 h-52 overflow-x-scroll p-2 pr-48"
    >
    {#each games as game (game.id)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img 
            class={twMerge("game h-48", selectedGame?.id === game.id && "outline outline-mauve")} 
            animate:flip={{duration: flipDurationMs}}
            on:click={() => {
                if (selectedGame && selectedGame.id === game.id) {
                    selectedGame = null;
                } else {
                    selectedGame = game;
                }
            }}
            src={game.cover} 
            alt="Game Cover"
            >
    {/each}

</section>
