
<script lang="ts">
    import Icon from "@iconify/svelte";
    import Dropdown from "../components/Dropdown.svelte";
    import Rating from "../components/Rating.svelte";
    import { getGameLists, type GameList, getFrontGameInList, type GameData, type ActiveGame } from "../api";
    import EditMenu from "./EditMenu.svelte";

    interface GameInfo {
        title: string,
        custom_rating: number,
        last_played: Date,
        playtime_min: number
    }

    let activeList: GameList | null = null;
    let editMenuOpen: boolean = false;

    async function setActiveList(gamelists: GameList[]) {
        let id = localStorage.activeGamesGameList

        if (id == null) {
            console.log("test")
            id = gamelists[0]?.id ?? null;

            if (id === null) {
                return;
            }

            localStorage.activeGamesGameList = activeList;
        }

        activeList = gamelists.find(gl => gl.id == id)!;
        localStorage.activeGamesGameList = id;
    }

    async function fetchGameLists(): Promise<GameList[]> {
        let gamelists = await getGameLists();
        await setActiveList(gamelists)
        return gamelists
    }

    async function fetchFrontGame(): Promise<ActiveGame | null> {
        if (!activeList) {
            return null;
        }

        return await getFrontGameInList(activeList.id);
    }
</script>

{#await fetchGameLists()}
    Loading...
{:then gamelists} 
    <div class="w-full h-full flex-col">
        {#await fetchFrontGame()}
            Loading game...
        {:then game}
            <!-- Artwork -->
            <img class="select-none w-full h-2/5 object-cover" src="https://source.unsplash.com/random" alt="Artwork">

            <!-- Control Bar -->
            <div class="h-8 bg-crust flex flex-row gap-2 items-center border-t border-b border-black">

                <!-- Left Side -->
                <div class="h-full w-full flex flex-row gap-2 items-center">

                    <!-- Game List Selection Dropdown -->
                    <Dropdown>
                        {#if gamelists.length == 0}
                            No Lists
                        {:else}
                            {#each gamelists as gamelist}
                                <option>{gamelist.name}</option>
                            {/each}
                        {/if}
                    </Dropdown>

                    {#if game}
                        <!-- Last Played Display -->
                        <p class="select-none mx-2">Last Played</p>
                        <p class="select-none text-mauve font-bold mr-6">{game.state.last_played ?? "Never"}</p>

                        <!-- Playtime Display -->
                        <Icon width={20} height={20} icon="mingcute:time-fill" />
                        <p class="select-none">{game.state.gametime_min ?? 0 / 60}</p>
                    {/if}
                </div>

                <!-- Right Side -->
                <div class="h-full w-full flex flex-row-reverse gap-2 items-center">
                    {#if game}
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
                        <button on:click={() => editMenuOpen = true} class="px-2 h-6 bg-mantle rounded-md border border-base font-bold flex flex-row items-center gap-2 hover:bg-base">
                            Edit
                            <Icon width={16} icon="material-symbols:edit" />
                        </button>

                        <Rating class="mx-2" rating={game.state.user_rating ?? 0} max={5} />
                    {/if}
                </div>
            </div>

            <!-- Game Info -->
            <div class="h-full p-4 pt-8">
                {#if game}
                    <!-- Game title -->
                    <h1 class="text-5xl font-bungee text-white mb-4">
                        {game.data.name}
                    </h1>

                    <!-- Game description -->
                    <p>
                        {game.data.description || "No description"}
                    </p>
                {/if}
            </div>
            {#if game}
                {#if editMenuOpen}
                    <EditMenu game={game} on:close={() => editMenuOpen = false} />
                {/if}
            {/if}
        {/await}
    </div>
{/await}
