<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import Icon from '@iconify/svelte';
    import Link from '../Link.svelte';

    export let label: string;
    export let icon: string;
    export let route: string;
    let active: boolean;
</script>

<!-- TODO: Fix link active -->
<Link draggable={false} bind:active to={route} class="w-full min-h-14">
    <div
        class={twMerge(
            'rounded-lg w-full h-full flex flex-row gap-4 pl-6 items-center group hover:bg-surface0 transition-all duration-75',
            active && 'bg-surface0 border-l-8 border-l-green',
        )}
    >
        <Icon
            class={twMerge('group-hover:text-white', false && 'text-white')}
            width={32}
            height={32}
            {icon}
        />
        <p
            class={twMerge(
                'text-xl group-hover:text-white',
                false && 'text-white',
            )}
        >
            {label}
        </p>
    </div>
</Link>
