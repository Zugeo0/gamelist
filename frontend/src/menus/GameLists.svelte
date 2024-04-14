
<script lang="ts">
    import Icon from "@iconify/svelte";
    import Dropdown from "../components/Dropdown.svelte";
    import GameInfo from "../components/GameInfo.svelte";
    import EditGame from "../components/EditGame.svelte";
    import { getGameLists, deleteGame, type GameData, type GameList, getUncompletedGamesInList, createGame, moveGameToList, updateGame, moveGameToBacklog, setGameCompleted, updateGameOrder } from "../api";
    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import { onMount } from "svelte";

    let activeList: GameList | null = null;

    let gamelists: GameList[];
    let games: GameData[];

    let activeGame: GameData | null = null;
    let newGame: GameData | null = null;
    let editGame: GameData | null = null;

    onMount(async () => {
        await updateGameLists();
        activeList = gamelists[0];
        games = await getUncompletedGamesInList(activeList.id);
    });

    async function updateGameLists() {
        gamelists = await getGameLists();

        if (gamelists.length == 0) {
            games = [];
            return;
        }
    }

    function createNewGame() {
        newGame = {
            id: 0,
            name: "",
            description: "",
            genres: [],
            artwork_url: "",
            release_date: null,
            igdb_id: null,
            steam_id: null,
            metacritic_score: null,
            state: null,
        }
    }

    async function acceptCreateGame(event: CustomEvent<GameData>) {
        newGame = null;
        let gameData = event.detail;

        if (activeList == null) {
            console.error("Active list is null");
            return;
        }

        try {
            let newGame = await createGame(gameData);
            await moveGameToList(newGame.id, activeList.id);

            games = [...games, newGame];
        } catch (e) {
            console.log(e);
        }
    }

    async function acceptEditGame(event: CustomEvent<GameData>) {
        editGame = null;
        let gameData = event.detail;

        try {
            let gameInList = games.find(game => game.id == gameData.id)!;
            let gameIndex = games.indexOf(gameInList);

            // the id should always be correct so this should never return null
            games[gameIndex] = await updateGame(gameData) as GameData;
            activeGame = games[gameIndex];
        } catch (e) {
            console.log(e);
        }
    }

    async function changeGameList(event: CustomEvent<number>) {
        await updateGameLists();
        activeList = gamelists.filter(list => list.id == event.detail)[0];
        games = await getUncompletedGamesInList(activeList.id);
    }

    async function moveActiveGameToBacklog() {
        if (!activeGame) {
            return;
        }

        moveGameToBacklog(activeGame.id);
        games = await getUncompletedGamesInList(activeList!.id);
        activeGame = null;
    }

    async function deleteActiveGame() {
        if (!activeGame) {
            return;
        }

        if (!confirm(`Are you sure you want to delete ${activeGame.name}?`)) {
            return;
        }

        deleteGame(activeGame!.id);
        games = await getUncompletedGamesInList(activeList!.id);
        activeGame = null;
    }

    async function completeActiveGame() {
        if (!activeGame) {
            return;
        }

        setGameCompleted(activeGame.id, true);
        games = await getUncompletedGamesInList(activeList!.id);
        activeGame = games[0] ?? null;
    }

    function handleConsider(e: CustomEvent<DndEvent<GameData>>) {
        games = e.detail.items;
    }

    async function handleFinalize(e: CustomEvent<DndEvent<GameData>>) {
        games = e.detail.items;
        let order = 0;
        for (let game of games) {
            if (!game.state) {
                continue;
            }
            game = await updateGameOrder(game.id, order++) as GameData;
        }
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
        return `${date.getDay()}. ${month} ${date.getFullYear()}`
    }
</script>

{#if gamelists && games}
    <div class="w-full h-full flex flex-row">
        <div class="h-full min-w-96 bg-mantle border-r border-r-overlay0 flex flex-col">

            <!-- Control Bar -->
            <div class="w-full h-8 bg-mantle border-b border-b-black">
                <Dropdown on:select={changeGameList} bg="bg-mantle" {gamelists} />
            </div>

            <!-- Current Game Label -->
            {#if games.length > 0}
                <div class="w-full h-6 bg-green text-black text-center font-bold flex flex-row justify-around border-y border-black select-none">
                    <p>v v v</p> <p>PLAYING</p> <p>v v v</p>
                </div>
            {/if}

            <section use:dndzone={{items: games}} on:consider={handleConsider} on:finalize={handleFinalize}>
                {#each games as game (game.id)}

                    <GameInfo
                        on:click={() => activeGame === game ? activeGame = null : activeGame = game}
                        selected={game === activeGame} {game}
                    />

                {/each}
            </section>

            {#if activeList}
                <div class="w-full h-14 flex justify-center items-center">
                    <button on:click={createNewGame} class="bg-base rounded-lg p-1 w-24 font-bold hover:bg-surface0">
                        +
                    </button>
                </div>
            {/if}

        </div>

        <div class="h-full flex-grow bg-crust flex flex-col justify-between">
            {#if activeGame}

                <!-- Artwork -->
                {#if activeGame.artwork_url}
                    <img class="select-none h-2/5 object-cover border-b border-b-overlay0" src={activeGame.artwork_url} alt="Artwork">
                {/if}

                <!-- Control Bar -->
                <div class="h-8 bg-crust flex flex-row gap-2 items-center border-b border-black">

                    <!-- Left Side -->
                    <div class="h-full w-full flex flex-row gap-2 items-center">

                        <!-- Last Played Display -->
                        <p class="select-none mx-2">Last Played</p>
                        <p class="select-none text-mauve font-bold mr-6">{activeGame.state?.last_played ? formatDate(activeGame.state?.last_played) : "Never"}</p>

                        <!-- Playtime Display -->
                        {#if activeGame.state && activeGame.state.gametime_min > 0}
                            <Icon width={20} height={20} icon="mingcute:time-fill" />
                            <p class="select-none">{activeGame.state.gametime_min < 60 ? `${activeGame.state.gametime_min} minutes` : `${Math.round(activeGame.state.gametime_min / 6) / 10} hours`}</p>
                        {/if}

                    </div>

                    <!-- Right Side -->
                    <div class="h-full flex flex-row-reverse gap-2 items-center">

                        <!-- Complete Game Button -->
                        <button on:click={completeActiveGame} class="mr-2 px-2 h-6 bg-mantle rounded-md border border-green text-green font-bold flex flex-row items-center gap-2 hover:bg-green hover:text-black">
                            <Icon width={16} icon="fluent-mdl2:completed-solid" />
                        </button>

                        <!-- Delete Game Button -->
                        <button on:click={deleteActiveGame} class="px-2 h-6 bg-mantle rounded-md border border-base hover:bg-red hover:border-red hover:text-black">
                            <Icon width={20} icon="lets-icons:remove-fill" />
                        </button>

                        <!-- Move To Backlog Button -->
                        <button on:click={moveActiveGameToBacklog} class="px-2 h-6 bg-mantle rounded-md border border-base hover:bg-peach hover:border-peach hover:text-black">
                            <Icon width={16} icon="fa6-solid:dumpster" />
                        </button>

                        <!-- Edit Button -->
                        <button on:click={() => editGame = activeGame} class="px-2 h-6 bg-mantle rounded-md border border-base font-bold flex flex-row items-center gap-2 hover:bg-blue hover:border-blue hover:text-black">
                            Edit
                            <Icon width={16} icon="material-symbols:edit" />
                        </button>

                    </div>
                </div>

                <div class="w-full px-4 py-8 flex-grow">
                    <h1 class="text-5xl font-lalezar text-white mb-4">
                        {activeGame.name}
                    </h1>

                    <p>
                        {activeGame.description || "No description"}
                    </p>
                </div>
            {/if}
        </div>

        {#if newGame}
            <EditGame on:close={() => newGame = null} on:accept={acceptCreateGame} game={newGame} />
        {/if}

        {#if editGame}
            <EditGame on:close={() => editGame = null} on:accept={acceptEditGame} game={editGame} />
        {/if}
    </div>
{/if}
