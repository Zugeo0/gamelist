
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { twMerge } from "tailwind-merge";
    import { createEventDispatcher } from "svelte";

    export let rating: number;
    export let max: number;

    export let ratingFullClass: string = "";
    export let ratingEmptyClass: string = "";

    export let interactable: boolean = true;

    const dispatch = createEventDispatcher<{update: number}>();

    function updateRating(newRating: number) {
        rating = newRating;
        dispatch('update', newRating);
    }

    let className: string = "";
    export {className as class};
</script>

<div class={twMerge("h-full flex flex-row", className)}>
    {#each Array(rating) as _, i}
        <button disabled={!interactable} on:click={() => updateRating(i + 1)}>
            <Icon width={24} class={twMerge("text-text", ratingFullClass)} icon="material-symbols-light:star" />
        </button>
    {/each}
    {#each Array(max - rating) as _, i}
        <button disabled={!interactable} on:click={() => updateRating(rating + i + 1)}>
            <Icon width={24} class={twMerge("text-surface2", ratingEmptyClass)} icon="material-symbols-light:star" />
        </button>
    {/each}
</div>
