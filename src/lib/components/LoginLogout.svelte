<script lang="ts">
    import DiscordLogo from '$lib/assets/discord.svg';
    import type { UserObject } from '$lib/schemas/discord-schema';
    import * as Avatar from '$lib/components/ui/avatar';

    export let user: UserObject;
</script>

{#if user.id}
    <div class="variant-outline-primary chip hover:cursor-default">
        <Avatar.Root>
            <Avatar.Image src={user.avatarUrl} alt="user avatar" />
            <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
        <span class="pl-2 text-xl font-semibold"> {user.displayName} </span>
    </div>
    <form action="/auth/logout" method="post" class="variant-filled-primary inline">
        <button class="variant-filled-error chip py-2" id="logout-button">
            <span class="text-xl font-semibold"> Logout </span>
        </button>
    </form>
{:else}
    <form action="/auth/login" method="post" class="flex justify-center">
        <button class="variant-filled-secondary btn">
            <img alt="Login discord icon" src={DiscordLogo} class="w-8" />
            <span class="text-xl font-semibold"> Login </span>
        </button>
    </form>
{/if}
