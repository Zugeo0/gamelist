
<script lang="ts">
    import logo from "/src/assets/logo.svg";
    import NavbarElement from "./NavbarElement.svelte";
    import NavbarSeparator from "./NavbarSeparator.svelte";

    interface NavElementData {
        icon: string,
        text: string,
        route: string,
        label?: string,
    };

    export let elements: NavElementData[];
</script>

<div class="h-full gap-2 max-w-80 w-1/3 bg-base overflow-hidden overflow-y-scroll border-r-overlay0 border-r flex flex-col justify-start items-center p-8">
    <!-- Header -->
    <img src={logo} class="w-[80%] my-4" alt="Svelte Logo" />

    <!-- Elements -->
    {#each elements as element, id}

        <!-- Create a label above the list element if it's specified -->
        {#if element.label !== undefined}
            <NavbarSeparator label={element.label} />
        {/if}

        <NavbarElement
            icon={element.icon}
            label={element.text}
            route={element.route}
        />
    {/each}
</div>
