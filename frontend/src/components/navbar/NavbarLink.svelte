
<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import Icon from '@iconify/svelte';
    import { Link } from 'svelte-routing'

    export let label: string;
    export let icon: string;
    export let route: string;
</script>

<Link draggable={false} to={route} let:active replace class="w-full min-h-14 select-none">
    <div class={twMerge("rounded-lg w-full h-full flex flex-row gap-4 pl-6 items-center group hover:bg-surface0 transition-all duration-75", active && "bg-surface0 border-l-8 border-l-green")}>
        <Icon class={twMerge("text-text group-hover:text-white", active && "text-white")} width={32} height={32} {icon} />
        <p class={twMerge("text-xl text-text group-hover:text-white", active && "text-white")}>
            {label}
        </p>
    </div>
</Link>
