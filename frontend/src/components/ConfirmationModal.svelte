
<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let message: string = "Are you sure?";

    const dispatcher = createEventDispatcher<{
        confirm: null,
        cancel: null,
    }>();
</script>

<div class="flex flex-col gap-4 items-center">
    <h1 class="text-lg font-lalezar text-white">{ message }</h1>
    <div class="flex gap-2">
        <button 
            class="text-text px-4 py-2 bg-base rounded-md font-bold w-24"
            on:click={() => dispatcher("cancel")}
            >
            NO
        </button>
        <button 
            class="text-text px-4 py-2 bg-base rounded-md font-bold w-24"
            on:click={() => dispatcher("confirm")}
            >
            YES
        </button>
    </div>
</div>
