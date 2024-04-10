
<script lang="ts">
    import Icon from "@iconify/svelte";
    import Rating from "../components/Rating.svelte";
    import { getGameLists, type GameList, getFrontGameInList, type GameData } from "../api";
    import EditGame from "../components/EditGame.svelte";
    import Dropdown from "../components/Dropdown.svelte";

    let activeList: GameList | null = null;
    let editMenuOpen: boolean = false;

    let gamelists: GameList[];
    let game: GameData | null;

    async function refresh() {
        gamelists = await getGameLists();

        if (gamelists.length == 0) {
            return;
        }

        activeList = gamelists[0];
        game = await getFrontGameInList(activeList.id);
    }
</script>

{#await refresh()}
    Loading...
{:then} 
    <div class="w-full h-full flex-col">
        <!-- Artwork -->
        <img class="select-none w-full h-2/5 object-cover" src="https://source.unsplash.com/random" alt="Artwork">

        <!-- Control Bar -->
        <div class="h-8 bg-crust flex flex-row gap-2 items-center border-t border-b border-black">

            <!-- Left Side -->
            <div class="h-full w-full flex flex-row gap-2 items-center">

                <!-- Game List Selection Dropdown -->
                <Dropdown {gamelists} />

                <!-- Game Info -->
                {#if game}
                    <!-- Last Played Display -->
                    <p class="select-none mx-2">Last Played</p>
                    <p class="select-none text-mauve font-bold mr-6">{game?.state?.last_played ?? "Never"}</p>

                    <!-- Playtime Display -->
                    <Icon width={20} height={20} icon="mingcute:time-fill" />
                    <p class="select-none">{game?.state?.gametime_min ?? 0 / 60}</p>
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

                    <Rating class="mx-2" rating={game?.state?.user_rating ?? 0} max={5} />
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
            {/if}
        </div>

        <!-- Edit Menu -->
        {#if game && editMenuOpen}
            <EditGame game={game} on:close={() => editMenuOpen = false} />
        {/if}
    </div>
{/await}
