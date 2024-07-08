<script lang="ts">
    import DiscordLogo from '$lib/assets/discord.svg';
    import type { UserObject } from '$lib/schemas/discord-schema';
    import { Button } from '$components/ui/button';
    import { Avatar, AvatarImage, AvatarFallback } from '$components/ui/avatar';

    export let user: UserObject;
</script>

{#if user.id}
    <div class="flex items-center px-5 hover:cursor-default">
        <Avatar>
            <AvatarImage src={user.avatarUrl} alt="user avatar" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span class="pl-2 text-xl font-semibold"> {user.displayName} </span>
    </div>
    <form action="/auth/logout" method="post" class="inline">
        <Button variant="outline" id="logout-button" class="hover:bg-destructive">
            <span class="text-xl font-semibold"> Logout </span>
        </Button>
    </form>
{:else}
    <form action="/auth/login" method="post" class="flex justify-center">
        <Button class="flex items-center">
            <img alt="Login discord icon" src={DiscordLogo} class="w-8" />
            <span class="text-xl font-semibold"> Login </span>
        </Button>
    </form>
{/if}
