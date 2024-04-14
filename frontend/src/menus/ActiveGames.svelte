
<script lang="ts">
    import Icon from "@iconify/svelte";
    import Rating from "../components/Rating.svelte";
    import { getGameLists, setGameCompleted, type GameList, getFrontGameInList, type GameData, moveGameToBacklog, updateGameRating } from "../api";
    import Dropdown from "../components/Dropdown.svelte";
    import { onMount } from "svelte";

    let activeList: GameList | null = null;

    let gamelists: GameList[];
    let game: GameData | null;

    onMount(async () => {
        await updateGameLists();
    });

    async function updateGameLists() {
        gamelists = await getGameLists();

        if (gamelists.length == 0) {
            activeList = null;
            return;
        }

        activeList = gamelists[0];
        game = await getFrontGameInList(activeList.id);
    }

    async function setGameList(event: CustomEvent<number>) {
        const listId = event.detail;
        activeList = gamelists.find(list => list.id == listId) ?? null;

        if (!activeList) {
            game = null;
            return;
        }

        game = await getFrontGameInList(activeList.id);
    }

    async function completeActiveGame() {
        setGameCompleted(game!.id, true);
        game = await getFrontGameInList(activeList!.id);
    }

    async function moveActiveGameToBacklog() {
        moveGameToBacklog(game!.id);
        game = await getFrontGameInList(activeList!.id);
    }

    async function setActiveGameRating(event: CustomEvent<number>) {
        updateGameRating(game!.id, event.detail);
    }

    function formatDate(date: Date): string {
        let month = '';
        switch (date.getMonth()) {
            case 0:  month = 'Jan'; break;
            case 1:  month = 'Feb'; break;
            case 2:  month = 'Mar'; break;
            case 3:  month = 'Apr'; break;
            case 4:  month = 'May'; break;
            case 5:  month = 'Jun'; break;
            case 6:  month = 'Jul'; break;
            case 7:  month = 'Aug'; break;
            case 8:  month = 'Sep'; break;
            case 9:  month = 'Oct'; break;
            case 10: month = 'Nov'; break;
            case 11: month = 'Dec'; break;
        }
        return `${date.getDate()}. ${month} ${date.getFullYear()}`
    }
</script>

{#if activeList}
    <div class="w-full h-full flex-col">
        <!-- Artwork -->
        {#if game?.artwork_url}
            <img class="select-none w-full h-2/5 object-cover" src={game.artwork_url} alt="Artwork">
        {/if}

        <!-- Control Bar -->
        <div class="h-8 bg-crust flex flex-row justify-between gap-2 items-center border-t border-b border-black">

            <!-- Left Side -->
            <div class="h-full flex flex-row gap-2 items-center">

                <!-- Game List Selection Dropdown -->
                <Dropdown on:listUpdated={updateGameLists} on:select={setGameList} {gamelists} />

                <!-- Game Info -->
                {#if game}
                    <!-- Last Played Display -->
                    <p class="select-none mx-2">Last Played</p>
                    <p class="select-none text-mauve font-bold mr-6">{game.state?.last_played ? formatDate(game.state?.last_played) : "Never"}</p>

                    <!-- Playtime Display -->
                    {#if game.state && game.state.gametime_min > 0}
                        <Icon width={20} height={20} icon="mingcute:time-fill" />
                        <p class="select-none">{game.state.gametime_min < 60 ? `${Math.round(game.state.gametime_min)} minutes` : `${Math.round(game.state.gametime_min / 6) / 10} hours`}</p>
                    {/if}
                {/if}
            </div>

            <!-- Right Side -->
            <div class="h-full flex flex-row-reverse gap-2 items-center">
                {#if game && game.state}
                    <!-- Complete Game Button -->
                    <button on:click={completeActiveGame} class="mr-2 px-2 h-6 bg-mantle rounded-md border border-green text-green font-bold flex flex-row items-center gap-2 hover:bg-green hover:text-black">
                        COMPLETE
                        <Icon width={16} icon="fluent-mdl2:completed-solid" />
                    </button>

                    <!-- Move To Backlog Button -->
                    <button on:click={moveActiveGameToBacklog} class="px-2 h-6 bg-mantle rounded-md border border-base hover:bg-peach hover:border-peach hover:text-black">
                        <Icon width={16} icon="fa6-solid:dumpster" />
                    </button>

                    {#if game.state.last_played}
                        <Rating on:update={setActiveGameRating} class="mx-2" rating={game.state.user_rating ?? 0} max={5} />
                    {/if}
                {/if}
            </div>
        </div>

        <!-- Game Info -->
        <div class="h-full p-4 pt-8">
            {#if game}
                <!-- Game title -->
                <h1 class="text-5xl font-lalezar text-white mb-4">
                    {game.name}
                </h1>

                <!-- Game description -->
                <p>
                    {game.description || "No description"}
                </p>
            {:else}
                <div class="w-full h-full flex flex-col justify-center items-center select-none">
                    <p class="text-white font-lalezar text-4xl mb-4">No Active Game in {activeList.name}</p>
                    <p>Go to Game Lists to add a game to this game list</p>
                </div>
            {/if}
        </div>
    </div>
{:else}
    <div class="w-full h-full flex flex-col justify-center items-center select-none">
        <p class="text-white font-lalezar text-4xl mb-4">No Game Lists</p>
        <p>Go to Game Lists to create a new game list</p>
    </div>
{/if}
