
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { twMerge } from "tailwind-merge";

    export let rating: number;
    export let max: number;

    let className: string = "";
    export {className as class};
</script>

<div class={twMerge("h-full flex flex-row", className)}>
    {#each Array(rating) as _, i}
        <button on:click={() => rating = i + 1}>
            <Icon width={24} class="text-text" icon="material-symbols-light:star" />
        </button>
    {/each}
    {#each Array(max - rating) as _, i}
        <button on:click={() => rating += i + 1}>
            <Icon width={24} class="text-surface2" icon="material-symbols-light:star" />
        </button>
    {/each}
</div>
