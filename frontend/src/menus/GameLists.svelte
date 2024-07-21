
<script lang="ts">
    import { onMount } from "svelte";
    import { GameListAPI, type GameList } from "../api/GameLists"; 
    import { GameAPI, type Game, type IGDBGame } from "../api/Games";
    import GameListComponent from "../components/GameListComponent.svelte";
    import Icon from "@iconify/svelte";
    import { Link } from "svelte-routing";
    import Modal from "../components/Modal.svelte";
    import Rating from "../components/Rating.svelte";
    import EditGameModal from "../components/EditGameModal.svelte";
    import ConfirmationModal from "../components/ConfirmationModal.svelte";

    let lists: GameList[] | null = null;

    let addGameModal: Modal;
    let addGameList: GameList;

    let deleteListConfirmModal: Modal;
    let listToDelete: GameList;

    let deleteGameConfirmModal: Modal;

    let addGameListModal: Modal;
    let addGameListName: HTMLInputElement;

    let editGameListModal: Modal;
    let editGameListName: HTMLInputElement;
    let listToEdit: GameList;

    let editGameModal: Modal;
    let gameToEdit: Game | null = null;

    let backlogSearch: Game[] = [];
    let igdbSearch: IGDBGame[] = [];
    let backlogSearchBar: HTMLInputElement;
    let igdbSearchBar: HTMLInputElement;

    let selectedGame: Game | null = null;

    onMount(async () => {
        await refreshLists();
    })

    async function refreshLists() {
        lists = await GameListAPI.all();
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

    async function addList(name: string) {
        await GameListAPI.add({
            id: 0,
            name: name,
        })
        await refreshLists();
    }

    async function editName(list: GameList, name: string) {
        list.name = name;
        await GameListAPI.put(list);
        await refreshLists();
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
            });
    }
</script>

<div class="w-full h-full relative">
    <div class="w-full h-full flex flex-col overflow-y-scroll">
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
                                <img class="game h-0 min-h-full" src={games[0].cover} alt="Game Cover">
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

                                <!-- Edit game list button -->
                                <button 
                                    on:click={() => {
                                        listToEdit = list;
                                        editGameListModal.show();
                                    }}
                                    class="toolbar-btn opacity-0 group-hover:opacity-100"
                                    >
                                    <Icon icon="material-symbols:edit" />
                                </button>

                                <!-- Delete game list button -->
                                <button 
                                    on:click={() => {
                                        listToDelete = list;
                                        deleteListConfirmModal.show();
                                    }} 
                                    class="toolbar-btn opacity-0 group-hover:opacity-100"
                                    >
                                    <Icon icon="mdi:trash" />
                                </button>

                                <!-- Add game button -->
                                <button 
                                    class="toolbar-btn"
                                    on:click={() => {
                                        addGameList = list;
                                        addGameModal.show();
                                    }}>
                                    <p>Add Game</p>
                                    <Icon icon="material-symbols:add" />
                                </button>

                            </div>

                            <!-- Games -->
                            <GameListComponent
                                bind:selectedGame={selectedGame}
                                gameList={list}
                                on:update={() => refreshLists()}
                                />

                        </div>

                    </div>
                    
                {/await}
            {/each}

            <!-- Create game list button -->
            <button 
                class="mx-auto px-16 py-4 mt-12 mb-24 bg-base rounded-md hover:bg-surface0"
                on:click={() => addGameListModal.show()}
                >
                <Icon icon="material-symbols:add">
                </Icon>
            </button>

        {/if}
    </div>

    {#if selectedGame}
        <div class="absolute left-0 right-0 bottom-0 p-4">
            <div class="toolbar">
                <h1 class="toolbar-element flex-grow justify-start py-1 font-lalezar text-2xl">{selectedGame.name}</h1>

                <!-- Move game to game list button -->
                <button 
                    on:click={async () => {
                        if (selectedGame) {
                            GameAPI.moveToBacklog(selectedGame);
                            await refreshLists();
                            selectedGame = null;
                        }
                    }}
                    class="toolbar-btn"
                    >
                    <p>Move to backlog</p>
                    <Icon icon="fa6-solid:dumpster" />
                </button>

                <!-- Edit game list button -->
                <button 
                    on:click={() => {
                        gameToEdit = selectedGame;
                        editGameModal.show();
                    }}
                    class="toolbar-btn"
                    >
                    <Icon icon="material-symbols:edit" />
                </button>

                <!-- Delete game list button -->
                <button 
                    on:click={() => deleteGameConfirmModal.show()}
                    class="toolbar-btn"
                    >
                    <Icon icon="mdi:trash" />
                </button>

            </div>
        </div>
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
            on:focus={() => {
                searchBacklog('');
                igdbSearch = [];
                igdbSearchBar.value = '';
            }}
            on:input={(e) => searchBacklog(e.target.value)}
            >

        <div class="flex flex-col overflow-y-scroll max-h-80">
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
            bind:this={igdbSearchBar}
            on:focus={() => {
                backlogSearch = [];
                backlogSearchBar.value = '';
            }}
            on:input={async (e) => {
                igdbSearch = await GameAPI.searchIGDB(e.target.value);
            }}
            >

        <div class="flex flex-col overflow-y-scroll max-h-80">
            {#each igdbSearch as game}
                <button 
                    class="flex gap-4 p-2 w-[500px] rounded-md hover:bg-base"
                    on:click={async () => {
                        let newGame = await GameAPI.addIGDB(game);
                        await GameAPI.moveToList(newGame, addGameList);
                        addGameModal.hide();
                        lists = lists;
                    }}
                    >
                    <img class="game h-24" src={game.cover} alt="Game Cover">
                    <div class="flex flex-col text-left">
                        <h1 class="text-white uppercase font-lalezar text-xl">{game.name}</h1>
                        <p class="text-surface0 line-clamp-3">{game.description}</p>
                    </div>
                </button>
            {/each}
        </div>
    </div>
</Modal>

<Modal bind:this={deleteListConfirmModal}>
    {#if listToDelete}
        <div class="flex flex-col gap-4 items-center">
            <h1 class="text-lg font-lalezar text-white">Are you sure you want to delete {listToDelete.name}</h1>
            <div class="flex gap-2">
                <button 
                    class="text-text px-4 py-2 bg-base rounded-md font-bold w-24"
                    on:click={() => deleteListConfirmModal.hide()}
                    >
                    NO
                </button>
                <button 
                    class="text-text px-4 py-2 bg-base rounded-md font-bold w-24"
                    on:click={() => {
                        deleteListConfirmModal.hide();
                        removeList(listToDelete.id);
                    }}
                    >
                    YES
                </button>
            </div>
        </div>
    {/if}
</Modal>

<Modal 
    bind:this={addGameListModal} 
    on:close={() => (addGameListName.value = '')}
    >
    <div class="flex gap-4 items-center w-[500px]">
        <!-- TODO: Fix type error -->
        <input
            class="bg-base text-text px-4 py-2 rounded-md placeholder:text-surface0 w-[500px] outline-none focus:outline-mauve"
            type="text"
            bind:this={addGameListName}
            placeholder="Game list name"
            >

        <button 
            class="text-text px-4 py-2 bg-base rounded-md font-bold w-24"
            on:click={() => {
                addGameListModal.hide();
                addList(addGameListName.value);
            }}
            >
            CREATE
        </button>
    </div>
</Modal>

<Modal 
    bind:this={editGameListModal} 
    on:close={() => (editGameListName.value = '')}
    >
    <div class="flex gap-4 items-center w-[500px]">
        <!-- TODO: Fix type error -->
        <input
            class="bg-base text-text px-4 py-2 rounded-md placeholder:text-surface0 w-[500px] outline-none focus:outline-mauve"
            type="text"
            bind:this={editGameListName}
            placeholder="Game list name"
            >

        <button 
            class="text-text px-4 py-2 bg-base rounded-md font-bold w-24"
            on:click={() => {
                editGameListModal.hide();
                editName(listToEdit, editGameListName.value);
            }}
            >
            UPDATE
        </button>
    </div>
</Modal>

<Modal 
    bind:this={editGameModal} 
    on:close={async () => {
        gameToEdit = null;
        await refreshLists();
    }}
    >
    {#if gameToEdit}
        <EditGameModal game={gameToEdit} />
    {/if}
</Modal>

<Modal bind:this={deleteGameConfirmModal}>
    {#if selectedGame}
        <ConfirmationModal 
            on:cancel={() => deleteListConfirmModal.hide()}
            on:confirm={async () => {
                if (!selectedGame) {
                    return;
                }

                deleteGameConfirmModal.hide();
                await GameAPI.remove(selectedGame.id);
                await refreshLists();
            }}
            message="Are you sure you want to delete {selectedGame.name}?"
            />
    {/if}
</Modal>
