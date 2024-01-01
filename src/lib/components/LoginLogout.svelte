<script lang="ts">
    import DiscordLogo from '$lib/assets/discord.svg';
    import type { UserObject } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';

    export let user: UserObject;
</script>

{#if user.id}
    <div class="chip hover:cursor-default variant-outline-primary">
        <Avatar src={user.avatarUrl} class="w-8" />
        <span class="text-xl font-semibold pl-2"> {user.displayName} </span>
    </div>
    <form action="/auth/logout" method="post" class="inline variant-filled-primary">
        <button class="chip variant-filled-error py-2" id="logout-button">
            <span class="text-xl font-semibold"> Logout </span>
        </button>
    </form>
{:else}
    <form action="/auth/login" method="post" class="flex justify-center">
        <button class="btn variant-filled-secondary">
            <img alt="Login discord icon" src={DiscordLogo} class="w-8" />
            <span class="text-xl font-semibold"> Login </span>
        </button>
    </form>
{/if}
