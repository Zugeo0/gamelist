<script lang="ts">
    import axios from "axios";
    import { apiUrl } from "./util";
</script>

<main>
    {#await axios(apiUrl("/"))}
    <p>Fetching...</p>
    {:then res} 
        <p class="m-4 font-bold text-xl">
            {res.data}
        </p>
    {/await}
</main>
