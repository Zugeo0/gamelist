<script lang="ts">
    import axios from 'axios';

    const apiUrl = import.meta.env.VITE_API_URL;

    axios(`${apiUrl}/`)
</script>

<main>
    <p class="text-red-500">{apiUrl}</p>
</main>
