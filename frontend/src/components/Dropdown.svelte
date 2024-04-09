
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { createGameList, getGameLists, type GameList } from "../api";
    import { createEventDispatcher } from "svelte";

    export let gamelists: GameList[];

    const dispatch = createEventDispatcher<{select: number, listUpdated: undefined}>();

    let selection = 0;
    let selectionOpen = false;

    function select(i: number) {
        selection = i;
        selectionOpen = false;
        dispatch("select", gamelists[selection].id);
    }

    async function createList() {
        let name = prompt("List Name")

        if (name === null) {
            return;
        }

        let newList = await createGameList(name);
        gamelists = [...gamelists, newList];

        dispatch("listUpdated");
    }
</script>

<div class="relative h-full min-w-32 w-fit">
    <button on:click={() => selectionOpen = !selectionOpen} class="h-full w-full px-4 bg-crust font-bold border-r border-r-black flex flex-row items-center justify-between select-none">
        {#if gamelists.length > 0}
            <p class="overflow-hidden">{gamelists[selection].name}</p>
        {:else}
            <p class="overflow-hidden text-surface0">No Lists</p>
        {/if}
        <Icon icon="mingcute:down-fill" />
    </button>
    {#if selectionOpen}
        <div class="absolute top-full left-0 flex flex-col bg-crust min-w-full w-fit text-nowrap text-left border border-black">
            {#each gamelists as gamelist, i}
                <button on:click={() => select(i)} class="hover:bg-mantle select-none w-full text-left py-1 px-4">
                    {gamelist.name}
                </button>
            {/each}
            <button on:click={() => createList()} class="h-6 p-1 gap-2 hover:bg-mantle flex justify-center items-center border-t border-t-black">
                <Icon icon="tabler:plus" />
            </button>
        </div>
    {/if}
</div>
