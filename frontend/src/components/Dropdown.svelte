
<script lang="ts">
    import type { GameList } from "../api";

    export let gamelists: GameList[];
</script>

<select class="h-full px-4 bg-crust font-bold border-r border-r-black">
    {#each gamelists as gamelist}
        <option>{gamelist.name}</option>
    {/each}
</select>