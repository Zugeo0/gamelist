
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getGameLists, type GameData, type GameList, getFrontGameInList, getGamesInList, createGame, moveGameToList, updateGame } from "../api";
    import Dropdown from "../components/Dropdown.svelte";
    import GameInfo from "../components/GameInfo.svelte";
    import EditGame from "../components/EditGame.svelte";

    let activeList: GameList | null = null;

    let gamelists: GameList[];
    let games: GameData[];

    let activeGame: GameData | null = null;
    let newGame: GameData | null = null;
    let editGame: GameData | null = null;

    async function refresh() {
        gamelists = await getGameLists();

        if (gamelists.length == 0) {
            games = [];
            return;
        }

        activeList = gamelists[0];
        games = await getGamesInList(activeList.id);
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
            let newGame = await createGame(
                gameData.name,
                gameData.description,
                gameData.genres,
                gameData.artwork_url,
                gameData.release_date,
                gameData.igdb_id,
                gameData.steam_id,
            );
            await moveGameToList(newGame.id, activeList.id);

            games = [...games, newGame];
        } catch (e) {
            console.log(e);
        }
    }

    function editActiveGame() {
        editGame = activeGame;
    }

    async function acceptEditGame(event: CustomEvent<GameData>) {
        editGame = null;
        let gameData = event.detail;

        try {
            let gameInList = games.find(game => game.id == gameData.id)!;
            let gameIndex = games.indexOf(gameInList);

            games[gameIndex] = await updateGame(
                gameData.id,
                gameData.name,
                gameData.description,
                gameData.genres,
                gameData.artwork_url,
                gameData.release_date,
                gameData.igdb_id,
                gameData.steam_id,
            );
            activeGame = games[gameIndex];
        } catch (e) {
            console.log(e);
        }
    }

    async function changeGameList(event: CustomEvent<number>) {
        activeList = gamelists.filter(list => list.id == event.detail)[0];
        games = await getGamesInList(activeList.id);
    }

</script>

{#await refresh()}
    Loading...
{:then}
    <div class="w-full h-full flex flex-row">
        <div class="h-full min-w-96 bg-mantle border-r border-r-overlay0 flex flex-col">

            <!-- Control Bar -->
            <div class="w-full h-8 bg-mantle border-b border-b-black">
                <Dropdown on:select={changeGameList} bg="bg-mantle" {gamelists} />
            </div>

            {#each games as game, i}

                {#if i == 0}

                    <!-- Current Game Label -->
                    <div class="w-full h-6 bg-green text-black text-center font-bold flex flex-row justify-around border-y border-black select-none">
                        <p>v v v</p> <p>PLAYING</p> <p>v v v</p>
                    </div>

                {/if}

                {#if i == 1}

                    <!-- Up Next Label -->
                    <div class="w-full h-6 bg-peach text-black text-center font-bold flex flex-row justify-around border-y border-black select-none">
                        <p>v v v</p> <p>UP NEXT</p> <p>v v v</p>
                    </div>

                {/if}

                <GameInfo on:click={() => activeGame = game} selected={game == activeGame} {game} />

            {/each}

            {#if activeList}
                <div class="w-full h-14 flex justify-center items-center">
                    <button on:click={createNewGame} class="bg-base rounded-lg p-1 w-24 hover:bg-surface0">
                        +
                    </button>
                </div>
            {/if}

        </div>
        <div class="h-full flex-grow bg-crust flex flex-col">
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
                        <p class="select-none text-mauve font-bold mr-6">{activeGame?.state?.last_played ?? "Never"}</p>

                        <!-- Playtime Display -->
                        <Icon width={20} height={20} icon="mingcute:time-fill" />
                        <p class="select-none">{activeGame?.state?.gametime_min ?? 0 / 60}</p>

                    </div>

                    <!-- Right Side -->
                    <div class="h-full w-full flex flex-row-reverse gap-2 items-center">

                        <!-- Complete Game Button -->
                        <button class="mr-2 px-2 h-6 bg-mantle rounded-md border border-green text-green font-bold flex flex-row items-center gap-2 hover:bg-green hover:text-black">
                            COMPLETE
                            <Icon width={16} icon="fluent-mdl2:completed-solid" />
                        </button>

                        <!-- Delete Game Button -->
                        <button class="px-2 h-6 bg-mantle rounded-md border border-base hover:bg-base">
                            <Icon width={20} icon="lets-icons:remove-fill" />
                        </button>

                        <!-- Move To Backlog Button -->
                        <button class="px-2 h-6 bg-mantle rounded-md border border-base hover:bg-base">
                            <Icon width={16} icon="fa6-solid:dumpster" />
                        </button>

                        <!-- Edit Button -->
                        <button on:click={editActiveGame} class="px-2 h-6 bg-mantle rounded-md border border-base font-bold flex flex-row items-center gap-2 hover:bg-base">
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
{/await}
