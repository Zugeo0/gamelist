<script lang="ts">
    import Navbar from "./components/navbar/Navbar.svelte";
    // TODO: Remove
    console.clear()

    let navbarElements = [
        {
            icon: "ion:game-controller",
            text: "Active Games",
        },
        {
            label: "Games",
            icon: "lucide:list-start",
            text: "Game Lists",
        },
        {
            icon: "bxs:calendar",
            text: "Upcoming Games",
        },
        {
            icon: "fa6-solid:dumpster",
            text: "Backlog",
        },
        {
            icon: "icons8:idea",
            text: "Suggestions",
        },
        {
            label: "Archives",
            icon: "fluent-mdl2:completed-solid",
            text: "Completions",
        },
    ];
</script>

<main class="flex flex-row absolute inset-0">
    <Navbar elements={navbarElements} />
</main>
