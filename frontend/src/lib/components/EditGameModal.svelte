
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { GameAPI, type Game } from "$lib/api/Games";
    import Rating from "./Rating.svelte";
    import { formatDate, zeroPad } from "$lib/utils";
    import { twMerge } from "tailwind-merge";

    export let game: Game;
    export let editMode: boolean = false;

    let newLastPlayed: Date | null = game.lastPlayed;

    async function apply() {
        game.lastPlayed = newLastPlayed;
        if (game.lastPlayed && game.lastPlayed > new Date()) {
            game.lastPlayed = new Date();
        }
        await GameAPI.put(game);
    }

    async function toggleComplete(game: Game) {
        if (game.completed) {
            await GameAPI.moveToBacklog(game);
            game = await GameAPI.get(game.id) ?? game;
        } else {
            await GameAPI.complete(game);
            game = await GameAPI.get(game.id) ?? game;
        }
    }

    async function updateLastPlayed(format: string) {
        let date = new Date(format);
        if (!date) {
            newLastPlayed = null;
            return;
        }
        newLastPlayed = date;
    }

    function formatISODate(date: Date): string {
        return `${zeroPad(date.getUTCFullYear(), 4)}-${zeroPad(date.getUTCMonth(), 2)}-${zeroPad(date.getUTCDate(), 2)}`;
    }
</script>

<div class="flex gap-2 h-full w-[900px]">

    <img class="game h-56" src={game.cover} alt="Game Cover">

    <div class="min-w-px min-h-full bg-base"></div>

    <div class="flex flex-col flex-grow">
    
        <h1 class="font-lalezar text-4xl text-white overflow-hidden">{game.name}</h1>

        {#if !editMode}
            <div class="flex gap-6">
                <Rating rating={game.rating} max={5} />
                <p class="text-mauve font-bold">{game.lastPlayed ? formatDate(game.lastPlayed) : "Never"}</p>
                <p class="text-peach font-bold">{game.playtime / 60} hours</p>
                <p class={twMerge("text-red font-bold", game.completed && "text-green")}>{game.completed ? "Complete" : "Incomplete"}</p>
            </div>

            <p class="text-surface2 line-clamp-4 mb-auto mt-2">{game.description}</p>

            <div class="toolbar">

                <button 
                    on:click={() => editMode = true}
                    class="toolbar-btn text-text"
                    >
                    Update play info
                    <Icon icon="material-symbols:edit" />
                </button>

                <button 
                    on:click={async () => toggleComplete(game)}
                    class="toolbar-btn text-text"
                    >
                    Mark {game.completed ? "incomplete" : "complete"}
                    <Icon icon="fluent-mdl2:completed-solid" />
                </button>
                
            </div>
        {:else}
            <Rating 
                on:update={async (e) => {
                    game.rating = e.detail;
                }}
                rating={game.rating} 
                max={5} 
                interactable
                />

            <p class="text-surface2 font-semibold text-lg mt-2">Playtime</p>
            <input
                class="minimal-input"
                value={game.playtime / 60}
                type="text"
                on:input={(e) => game.playtime = e.target.value * 60}
                >

            <p class="text-surface2 font-semibold text-lg mt-2">Last Played</p>
            <input 
                class="minimal-input"
                value={game.lastPlayed ? formatISODate(game.lastPlayed) : ""}
                placeholder={formatISODate(new Date())}
                type="text"
                on:input={(e) => updateLastPlayed(e.target.value)}
                >
        {/if}
    </div>

    {#if editMode}
        <div class="min-w-px min-h-full bg-base"></div>

        <div class="flex flex-col">
            <p class="text-surface2 line-clamp-7">{game.description}</p>

            <div class="toolbar mt-auto">

                <button 
                    on:click={async () => {
                        editMode = false;
                        await apply();
                    }}
                    class="toolbar-btn text-text"
                    >
                    Apply changes
                    <Icon icon="fluent-mdl2:completed-solid" />
                </button>

                <button 
                    on:click={async () => {
                        editMode = false;
                        game = await GameAPI.get(game.id) ?? game;
                    }}
                    class="toolbar-btn text-text"
                    >
                    Cancel
                    <Icon icon="lets-icons:back" />
                </button>
                
            </div>
        </div>
    {/if}

</div>

