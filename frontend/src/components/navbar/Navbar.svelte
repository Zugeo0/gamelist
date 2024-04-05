
<script lang="ts">
    import logo from "/src/assets/logo.svg";
    import NavbarElement from "./NavbarElement.svelte";
    import NavbarSeparator from "./NavbarSeparator.svelte";

    let selection = 0;

    function onSelect(e: CustomEvent<number>) {
        selection = e.detail;
    }
</script>

<div class="h-full gap-2 max-w-80 w-1/3 bg-base overflow-hidden overflow-y-scroll border-r-overlay0 border-r flex flex-col justify-start items-center p-8">
    <img src={logo} class="w-[80%] my-4" alt="Svelte Logo" />

    <NavbarElement id={0} {selection} on:selected={onSelect}
        icon="ion:game-controller"
        label="Active Games"
    />

    <NavbarSeparator label="Games" />
    <NavbarElement id={1} {selection} on:selected={onSelect}
        icon="lucide:list-start"
        label="Game Lists"
    />
    <NavbarElement id={2} {selection} on:selected={onSelect}
        icon="bxs:calendar"
        label="Upcoming Games"
    />
    <NavbarElement id={3} {selection} on:selected={onSelect}
        icon="fa6-solid:dumpster"
        label="Backlog"
    />
    <NavbarElement id={4} {selection} on:selected={onSelect}
        icon="icons8:idea"
        label="Suggestions"
    />

    <NavbarSeparator label="Archives" />
    <NavbarElement id={5} {selection} on:selected={onSelect}
        icon="fluent-mdl2:completed-solid"
        label="Completions"
    />
</div>
