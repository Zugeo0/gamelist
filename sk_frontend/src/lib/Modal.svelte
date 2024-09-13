
<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    export let visible: boolean = false;
    export let autostart: boolean = false;

    export function show() {
        visible = true;
    }

    export function hide() {
        visible = false;
        dialog.close();
    }

    const dispatcher = createEventDispatcher<{
        close: null,
    }>();

    let dialog: HTMLDialogElement;

    $: if (dialog && visible) dialog.showModal();

    // For debug purposes
    onMount(() => {
        if (autostart)
            dialog.showModal()
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}
    on:close={() => {
        visible = false;
        dispatcher('close')
    }}
    on:click|self={() => dialog.close()}
    class="backdrop:bg-black backdrop:opacity-60 outline-none rounded-md bg-mantle"
    >
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            on:click|stopPropagation
            class="p-4"
            >
            <slot />
        </div>
</dialog>
