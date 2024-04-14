
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getCompletedGames, setGameCompleted, type GameData } from "../api";
    import GameInfo from "../components/GameInfo.svelte";
    import { onMount } from "svelte";

    let games: GameData[] = [];

    onMount(async () => {
        games = await getCompletedGames();
    });

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

    async function moveToList(id: number) {
        setGameCompleted(id, false);
        games = games.filter(game => game.id !== id);
    }
</script>

{#if games.length > 0}
    <div class="flex flex-col w-full">
        {#each games as game}
            {#if game.state}
                <GameInfo class="group h-20 hover:bg-base transition-none cursor-default" selected={false} {game}>
                    <div class="w-24 flex flex-col justify-center items-center gap-1 mx-4 text-peach">
                        <Icon width={24} icon="mingcute:time-fill" />
                        <p class="select-none">{game.state.gametime_min < 60 ? `${Math.round(game.state.gametime_min)} minutes` : `${Math.round(game.state.gametime_min / 6) / 10} hours`}</p>
                    </div>
                    <div class="w-24 flex flex-col justify-center items-center gap-1 mx-4 text-mauve">
                        <Icon width={24} icon="bxs:calendar" />
                        <p>{game.state.last_played ? formatDate(game.state.last_played) : "Never"}</p>
                    </div>

                    <!-- Move To List Button -->
                    <button on:click={() => moveToList(game.id)} class="w-12 my-4 rounded-lg bg-base border border-surface0 opacity-0 group-hover:opacity-100 hover:bg-peach hover:border-peach hover:text-white flex justify-center items-center">
                        <Icon width={24} icon="material-symbols:move-up" />
                    </button>
                </GameInfo>
            {/if}
        {/each}
    </div>
{:else}
    <div class="w-full h-full flex flex-col justify-center items-center select-none">
        <p class="text-white font-lalezar text-4xl mb-4">No Completed Games</p>
        <p>Games marked as completed will end up here</p>
    </div>
{/if}
