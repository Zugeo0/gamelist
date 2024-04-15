<script lang="ts">
    import { Route, Router } from "svelte-routing";
    import Navbar from "./components/navbar/Navbar.svelte";
    import NavbarLink from "./components/navbar/NavbarLink.svelte";
    import NavbarSeparator from "./components/navbar/NavbarSeparator.svelte";

    // Pages
    import ActiveGames from "./menus/ActiveGames.svelte";
    import GameLists from "./menus/GameLists.svelte";
    import Backlog from "./menus/Backlog.svelte";
    import Completions from "./menus/Completions.svelte";
    import Suggestions from "./menus/Suggestions.svelte";
    import Upcoming from "./menus/Upcoming.svelte";
</script>

<Router>
    <main class="flex flex-row absolute inset-0">
        <Navbar>
            <NavbarLink
                label="Active Games"
                icon="ion:game-controller"
                route="/"
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
        <Route path="/" component={ActiveGames} />
        <Route path="/games" component={GameLists} />
        <Route path="/backlog" component={Backlog} />
        <Route path="/completions" component={Completions} />
        <Route path="/suggestions" component={Suggestions} />
        <Route path="/upcoming" component={Upcoming} />
    </main>
</Router>
