<script lang="ts">
    import { page } from '$app/stores';

    export let to: string;
    export let active: boolean = false;

    $: active = to == $page.url.pathname;
</script>

<a href={to} class={$$props.class} draggable={$$props.draggable}>
    <slot />
</a>
