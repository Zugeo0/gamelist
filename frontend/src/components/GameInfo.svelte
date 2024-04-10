<script lang="ts">
    import Icon from "@iconify/svelte";
    import { twMerge } from "tailwind-merge";
    import { type GameData } from "../api";

    export let game: GameData;

    let selected = false;
</script>

<button on:click={() => selected = !selected} class={twMerge(
    "h-24 w-full flex flex-row hover:bg-base transition-all duration-75 border-b border-b-black",
    selected && "border-l-8 border-l-green bg-base"
)}>
    <div class="w-full h-full flex flex-col justify-around py-4 px-6 select-none">
        <h1 class="font-lalezar text-white text-xl text-left">
            {game.name}
        </h1>
        <div class="flex flex-row gap-4 items-center">
            <p>RPG</p>
            <p>2019</p>
            <div class="flex flex-row items-center gap-2">
                <Icon icon="simple-icons:metacritic" />
                <p>85</p>
            </div>
        </div>
    </div>
    <img class="select-none min-w-32 h-full object-cover" src="https://source.unsplash.com/random" alt="Artwork">
</button>