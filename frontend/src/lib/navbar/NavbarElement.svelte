
<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';

    let dispatch = createEventDispatcher<{selected: number}>();

    export let selection: number;
    export let label: string;
    export let icon: string;
    export let id: number;

    $: selected = selection == id;

    function clicked(e: Event) {
        dispatch('selected', id)
    }
</script>

<button on:click={clicked} class={twMerge("w-full min-h-14 rounded-lg flex flex-row gap-4 pl-6 items-center group hover:bg-surface0 transition-all duration-75", selected && "bg-surface0 border-l-8 border-l-green")}>
    <Icon class={twMerge("text-text group-hover:text-white", selected && "text-white")} width={32} height={32} {icon} />
    <p class={twMerge("text-xl text-text select-none group-hover:text-white", selected && "text-white")}>
        {label}
    </p>
</button>
