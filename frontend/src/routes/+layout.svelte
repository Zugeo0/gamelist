<script lang="ts">
    import Navbar from '$lib/components/navbar/Navbar.svelte';
    import NavbarLink from '$lib/components/navbar/NavbarLink.svelte';
    import NavbarSeparator from '$lib/components/navbar/NavbarSeparator.svelte';

    import '../app.css';
</script>

<main class="flex flex-row absolute inset-0 select-none">
    <Navbar>
        <NavbarLink
            label="Active Games"
            icon="ion:game-controller"
            route="/active"
        />
        <NavbarSeparator label="Games" />
        <NavbarLink
            label="Game Lists"
            icon="lucide:list-start"
            route="/games"
        />
        <NavbarLink
            label="Upcoming Games"
            icon="bxs:calendar"
            route="/upcoming"
        />
        <NavbarLink
            label="Backlog"
            icon="fa6-solid:dumpster"
            route="/backlog"
        />
        <NavbarLink
            label="Suggestions"
            icon="icons8:idea"
            route="/suggestions"
        />
        <NavbarSeparator label="Archives" />
        <NavbarLink
            label="Completions"
            icon="fluent-mdl2:completed-solid"
            route="/completions"
        />
    </Navbar>
    <slot />
</main>
