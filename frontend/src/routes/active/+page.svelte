<script lang="ts">
    import type { Game } from '$lib/api/Games';
    import Icon from '@iconify/svelte';
    import Rating from '$lib/components/Rating.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import EditGameModal from '$lib/components/EditGameModal.svelte';
    import { formatDate } from '$lib/utils';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';

    export let data: PageData;

    let editGameModal: Modal;
    let gameToEdit: Game | null = null;
</script>

<div class="w-full h-full flex flex-col">
    {#each data.lists as list}
        <!-- Game List -->
        <div
            class="w-full p-3 flex flex-row gap-2 border-b border-base items-stretch h-fit"
        >
            <!-- Up Next Cover -->
            {#if list.front}
                <img
                    class="game h-0 min-h-full"
                    src={list.front.cover}
                    alt="Game Cover"
                />
            {:else}
                <div
                    class="game h-0 min-h-full border border-base flex justify-center items-center text-base font-bold text-3xl"
                >
                    EMPTY
                </div>
            {/if}

            <div class="min-w-px h-full bg-base"></div>

            <!-- List Details -->
            <div class="flex flex-col gap-2 flex-grow">
                <!-- Toolbar -->
                <div class="toolbar overflow-hidden group">
                    <!-- Go to game lists button -->
                    <a
                        href="/games"
                        class="toolbar-btn flex-grow justify-start py-1 font-lalezar text-2xl"
                        >{list.data.name}</a
                    >

                    {#if list.front}
                        <!-- Edit game button -->
                        <button
                            on:click={() => {
                                gameToEdit = list.front;
                                editGameModal.show();
                            }}
                            class="toolbar-btn opacity-0 group-hover:opacity-100"
                        >
                            <Icon icon="material-symbols:edit" />
                        </button>

                        <!-- Delete game button -->
                        <form method="POST" action="?/deleteGame" use:enhance>
                            <input
                                type="hidden"
                                name="id"
                                value={list.front.id}
                            />
                            <button
                                class="toolbar-btn opacity-0 group-hover:opacity-100"
                                type="submit"
                            >
                                <Icon icon="mdi:trash" />
                            </button>
                        </form>

                        <!-- Move game to backlog button -->
                        <form
                            method="POST"
                            action="?/moveToBacklog"
                            use:enhance
                        >
                            <input
                                type="hidden"
                                name="id"
                                value={list.front.id}
                            />
                            <button
                                class="toolbar-btn opacity-0 group-hover:opacity-100"
                                type="submit"
                            >
                                <Icon icon="fa6-solid:dumpster" />
                            </button>
                        </form>

                        <!-- Complete game button -->
                        <form method="POST" action="?/completeGame" use:enhance>
                            <input
                                type="hidden"
                                name="id"
                                value={list.front.id}
                            />
                            <button class="toolbar-btn" type="submit">
                                Complete
                                <Icon icon="fluent-mdl2:completed-solid" />
                            </button>
                        </form>
                    {/if}
                </div>

                <!-- Game Details -->
                <div class="flex flex-row gap-2 h-52 px-2">
                    {#if list.front}
                        <!-- Game info -->
                        <div class="flex flex-col flex-grow">
                            <h1
                                class="font-lalezar text-white text-3xl uppercase"
                            >
                                {list.front.name}
                            </h1>

                            <Rating rating={list.front.rating} max={5} />

                            <p class="text-surface2 line-clamp-5 mt-2">
                                {list.front.description}
                            </p>
                        </div>

                        <div class="min-w-px h-full bg-base"></div>

                        <!-- Playtime stats -->
                        <div
                            class="flex flex-col items-stretch gap-2 min-w-[300px]"
                        >
                            <!-- Last played -->
                            <div class="flex flex-row justify-between">
                                <p>Last Played</p>
                                {#if list.front.lastPlayed}
                                    <p class="font-bold text-mauve">
                                        {formatDate(list.front.lastPlayed)}
                                    </p>
                                {:else}
                                    <p class="font-bold text-mauve">Never</p>
                                {/if}
                            </div>

                            <!-- Playtime -->
                            <div class="flex flex-row justify-between">
                                <p>Play Time</p>
                                <p class="font-bold text-peach">
                                    {list.front.playtime / 60} hours
                                </p>
                            </div>
                        </div>
                    {:else}
                        <div
                            class="text-3xl text-cat-base font-bold font-lalezar size-full flex justify-center items-center uppercase"
                        >
                            No game in list
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/each}
</div>

<Modal bind:this={editGameModal}>
    {#if gameToEdit}
        <EditGameModal game={gameToEdit} />
    {/if}
</Modal>
