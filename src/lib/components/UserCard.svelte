<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { readable } from 'svelte/store';
    import { onMount } from 'svelte';
    import type { UserObject } from '$lib/types';

    export let userID: string;

    const userStore = readable<UserObject | null>(null, (set) => {
        onMount(() => {
            fetch(`/api/discord/user/${userID}`)
                .then((res) => res.json().then(set).catch(console.error))
                .catch(console.error);
        });
    });
</script>

{#if $userStore == null}
    <div
        class="flex-col variant-filled-primary card h-max flex justify-center items-center md:flex-row w-56 md:w-[36rem]"
    >
        <div class="p-3 md:p-6 md:pr-3 pb-0 md:pb-6">
            <div class="placeholder w-20 h-20 animate-pulse" />
        </div>
        <div class="p-3 md:p-6 md:pl-3 flex flex-col justify-center space-y-4 animate-pulse w-full">
            <div class="placeholder p-8"></div>
            <div class=""></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div>
        </div>
    </div>
{:else}
    <div
        class="flex-col variant-filled-primary card h-max flex justify-center items-center md:flex-row"
    >
        <div class="p-3 md:p-6 md:pr-3 pb-0 md:pb-6">
            <Avatar class="w-32 rounded-xl" src={$userStore.avatarUrl} />
        </div>
        <div class="p-3 md:p-6 md:pl-3 flex flex-col justify-center">
            <div class="text-4xl font-bold">
                {$userStore.displayName}
            </div>
            <div class="text-xl">
                @{$userStore.username}
            </div>
            <div class="pt-6">
                <span class="font-bold"> ID </span>
                {$userStore.id}
            </div>
            <div class="w-max">
                <span class="font-bold"> Since </span>
                {$userStore.accountSince}
            </div>
            <div class="w-max">
                <span class="font-bold"> Age </span>
                {$userStore.relativeAge}
            </div>
        </div>
    </div>
{/if}
