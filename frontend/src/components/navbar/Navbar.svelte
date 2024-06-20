
<script lang="ts">
    import logo from "/src/assets/logo.svg";
</script>

<div class="h-full gap-2 max-w-80 w-1/3 bg-base overflow-hidden overflow-y-scroll border-r-surface0 border-r flex flex-col justify-start items-center p-8">
    <!-- Header -->
    <img src={logo} class="w-[80%] my-4" alt="Header" />

    <slot />
</div>
