<script lang="ts">
    import { Router } from "svelte-routing";
    import Navbar from "./components/navbar/Navbar.svelte";

    // TODO: Debug clear, Remove in production
    console.clear()

    const navbarElements = [
        {
            icon: "ion:game-controller",
            text: "Active Games",
            route: "/",
        },
        {
            label: "Games",
            icon: "lucide:list-start",
            text: "Game Lists",
            route: "/games",
        },
        {
            icon: "bxs:calendar",
            text: "Upcoming Games",
            route: "/upcoming",
        },
        {
            icon: "fa6-solid:dumpster",
            text: "Backlog",
            route: "/backlog",
        },
        {
            icon: "icons8:idea",
            text: "Suggestions",
            route: "/suggestions",
        },
        {
            label: "Archives",
            icon: "fluent-mdl2:completed-solid",
            text: "Completions",
            route: "/completions",
        },
    ];
</script>

<Router>
    <main class="flex flex-row absolute inset-0">
        <Navbar elements={navbarElements} />
    </main>
</Router>
