
<script lang="ts">
    import { onMount } from "svelte";
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game } from "../api/Games";
    import GameListComponent from "../components/GameListComponent.svelte";
    import Icon from "@iconify/svelte";
    import { Link } from "svelte-routing";
    import Modal from "../components/Modal.svelte";
    import Rating from "../components/Rating.svelte";

    let lists: GameList[] | null = null;

    let addGameModal: Modal;
    let addGameList: GameList;
    let backlogSearch: Game[] = [];
    let backlogSearchBar: HTMLInputElement;

    onMount(async () => {
        lists = await fetchLists();
    })

    async function refreshLists() {
        lists = await fetchLists();
    }

    async function fetchLists(): Promise<GameList[]> {
        return await GameListAPI.all();
    }

    async function fetchGames(list: GameList): Promise<Game[]> {
        return await GameAPI.fromList(list)
    }

    async function removeList(id: number) {
        await GameListAPI.remove(id);
        await refreshLists();
    }

    async function moveToList(game: Game, list: GameList) {
        await GameAPI.moveToList(game, list);
    }

    async function searchBacklog(search: string) {
        const backlog = await GameAPI.backlog()
        backlogSearch = backlog
            .filter(game => {
                // TODO: Sort based on relevancy
                const gameName = game.name.toLowerCase();
                const searchParams = search.toLowerCase().split(' ');
                for (let i = 0; i < searchParams.length; i++) {
                    if (!gameName.includes(searchParams[i]))
                        return false;
                }
                return true;
            })
            .slice(0, 3);
    }
</script>

<div class="w-full h-full flex flex-col">
    {#if lists}
        {#each lists as list}
            {#await fetchGames(list)}
                <p>Loading...</p>
            {:then games} 

                <!-- Game List -->
                <div class="w-full p-3 flex flex-row gap-2 border-b border-base items-stretch h-fit">

                    <!-- Up Next Cover -->
                    {#if games[0]}
                        <Link class="game h-0 min-h-full" to="/">
                            <img class="game" src={games[0].cover} alt="Game Cover">
                        </Link>
                    {:else}
                        <div class="game h-0 min-h-full border border-base flex justify-center items-center text-base font-bold text-3xl">
                            EMPTY
                        </div>
                    {/if}

                    <div class="min-w-px h-full bg-base"></div>

                    <!-- List Details -->
                    <div class="flex flex-col gap-2 flex-grow">

                        <!-- Toolbar -->
                        <div class="toolbar group">
                            <h1 class="toolbar-element flex-grow justify-start py-1 font-lalezar text-2xl">{list.name}</h1>

                            <!-- Edit game button -->
                            <button class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="material-symbols:edit" />
                            </button>

                            <!-- Delete game button -->
                            <button on:click={() => removeList(list.id)} class="toolbar-btn opacity-0 group-hover:opacity-100">
                                <Icon icon="mdi:trash" />
                            </button>

                        </div>

                        <!-- Games -->
                        <GameListComponent
                            gameList={list}
                            on:update={() => refreshLists()}
                            on:add={() => {
                                addGameList = list;
                                addGameModal.show();
                            }}
                            />

                    </div>

                </div>
                
            {/await}
        {/each}
    {/if}
</div>

<Modal 
    bind:this={addGameModal} 
    on:close={() => {
        backlogSearch = [];
        backlogSearchBar.value = '';
    }}
    >
    <div class="flex flex-col gap-2">
        <!-- TODO: Fix type error -->
        <input
            class="bg-base text-text px-4 py-2 rounded-md placeholder:text-surface0 w-[500px] outline-none focus:outline-mauve"
            type="text"
            placeholder="Search backlog"
            bind:this={backlogSearchBar}
            on:focus={() => searchBacklog('')}
            on:input={(e) => searchBacklog(e.target.value)}
            >

        <div class="flex flex-col">
            {#each backlogSearch as game}
                <button 
                    class="flex gap-4 p-2 w-[500px] rounded-md hover:bg-base"
                    on:click={() => {
                        moveToList(game, addGameList);
                        addGameModal.hide();
                        lists = lists;
                    }}
                    >
                    <img class="game h-24" src={game.cover} alt="Game Cover">
                    <div class="flex flex-col text-left">
                        <h1 class="text-white uppercase font-lalezar text-xl">{game.name}</h1>
                        <Rating rating={game.rating} max={5} />
                        <p class="text-surface0 line-clamp-2">{game.description}</p>
                    </div>
                </button>
            {/each}
        </div>

        <div class="flex items-center gap-2">
            <div class="h-px flex-grow bg-base"></div>
            <p class="text-surface0">OR</p>
            <div class="h-px flex-grow bg-base"></div>
        </div>

        <input 
            class="bg-base text-text px-4 py-2 rounded-md placeholder:text-surface0 w-[500px] outline-none focus:outline-mauve"
            type="text"
            placeholder="Search IGDB"
            on:focus={() => {
                backlogSearch = [];
                backlogSearchBar.value = '';
            }}
            >
    </div>
</Modal>
