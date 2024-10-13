<script lang="ts">
    import { readable } from 'svelte/store';
    import { onMount } from 'svelte';
    import type { UserObject } from '$lib/zod/discord';
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from '$components/ui/avatar';

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
    <div class="card flex h-max w-56 flex-col items-center justify-center md:w-[36rem] md:flex-row">
        <div class="p-3 pb-0 md:p-6 md:pb-6 md:pr-3">
            <div class="placeholder h-20 w-20 animate-pulse" />
        </div>
        <div class="flex w-full animate-pulse flex-col justify-center space-y-4 p-3 md:p-6 md:pl-3">
            <div class="placeholder p-8"></div>
            <div class=""></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div>
        </div>
    </div>
{:else}
    <div class="card flex h-max flex-col items-center justify-center md:flex-row">
        <div class="p-3 pb-0 md:p-6 md:pb-6 md:pr-3">
            <Avatar class="w-32 rounded-xl">
                <AvatarImage src={$userStore.avatarUrl} alt="User Avatar" class="rounded-xl" />
                <AvatarFallback>{$userStore.username.slice(2).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
        <div class="flex flex-col justify-center p-3 md:p-6 md:pl-3">
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
