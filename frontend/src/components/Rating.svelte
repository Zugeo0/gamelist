
<script lang="ts">

    // Imports
    import Icon from "@iconify/svelte";
    import { twMerge } from "tailwind-merge";
    import { createEventDispatcher } from "svelte";

    // Props
    export let rating: number;
    export let max: number;
    export let interactable: boolean = false;

    // Events
    const dispatch = createEventDispatcher<{
        update: number
    }>();

    // Update rating event handler
    function updateRating(newRating: number) {
        rating = newRating;
        dispatch('update', newRating);
    }

    // Allow class overrides
    let className: string = "";
    export {className as class};

</script>

<div class={twMerge("flex flex-row", className)}>

    <!-- Highlighted stars -->
    {#each Array(rating) as _, i}
        <button disabled={!interactable} on:click={() => updateRating(i + 1)}>
            <Icon width={24} class={twMerge("text-text", !interactable && "text-yellow")} icon="material-symbols-light:star" />
        </button>
    {/each}

    <!-- Grayed out stars -->
    {#each Array(max - rating) as _, i}
        <button disabled={!interactable} on:click={() => updateRating(rating + i + 1)}>
            <Icon width={24} class="text-surface2" icon="material-symbols-light:star" />
        </button>
    {/each}

</div>
