
<script lang="ts">

    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import { GameAPI, type Game } from "../api/Games";
    import { showAddButtonStore } from "./GameListComponentState";
    import { twMerge } from "tailwind-merge";
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import { type GameList } from "../api/GameLists";

    const flipDurationMs = 50;

    export let gameList: GameList;

    let games: Game[] = [];
    let showAddButton = false;

    let unsubscribe = showAddButtonStore.subscribe((value) => showAddButton = value);

    const dispatch = createEventDispatcher<{
        update: null;
        add: null;
    }>();

    onMount(async () => {
        games = await GameAPI.fromList(gameList);
    });

    onDestroy(() => { unsubscribe(); });

    async function handleConsider(e: CustomEvent<DndEvent<Game>>) {
        showAddButtonStore.set(false);
        games = e.detail.items;
    }

    async function handleFinalize(e: CustomEvent<DndEvent<Game>>) {
        showAddButtonStore.set(true);
        games = e.detail.items;

        games.forEach((game, i) => {
            game.order = i;
            game.list = gameList.id;
            GameAPI.put(game);
        })

        dispatch('update');
    }

    async function handleAdd() {
        dispatch('add');
    }

    function disableEvent(e: Event) {
        e.stopImmediatePropagation();
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

    {#if showAddButton}
        <button 
            on:mousedown={disableEvent}
            on:touchstart={disableEvent}
            on:click={handleAdd}
            class="game h-48 border-4 border-base text-surface1 flex justify-center items-center font-bold text-3xl hover:bg-base transition-colors"
            >
            +
        </button>
    {/if}

</section>
