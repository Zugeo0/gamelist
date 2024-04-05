
<script lang="ts">
    import logo from "/src/assets/logo.svg";
    import NavbarElement from "./NavbarElement.svelte";
    import NavbarSeparator from "./NavbarSeparator.svelte";

    interface NavElementData {
        icon: string,
        text: string,
        label?: string,
    };

    let selection = 0;

    export let elements: NavElementData[];

    function setSelection(sel: number) {
        selection = sel;
    }
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
            on:click={() => setSelection(id)}
            selected={selection === id}
            icon={element.icon}
            label={element.text}
        />
    {/each}
</div>
