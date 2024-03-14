<script lang="ts">
    import '../app.css';
    import Img from '$lib/assets/kustos.svg';
    import Github from '$lib/assets/github.svg';
    import type { LayoutServerData } from './$types';
    import LoginLogout from '$components/LoginLogout.svelte';
    import { page } from '$app/stores';
    import { Toaster } from '$components/ui/sonner';
    import { AppBar, AppRail, AppRailAnchor, AppShell, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
    import { Avatar } from '@skeletonlabs/skeleton';

    export let data: LayoutServerData;
</script>

<Toaster />

<AppShell>
    <AppBar slot="header" gap="gap-0 md:gap-4 md">
        <img slot="lead" alt="Icon" class="w-12" src={Img} />
        <div class="hidden text-2xl font-semibold md:block">Kustos</div>
        <LoginLogout slot="trail" user={data} />
    </AppBar>

    <AppRail slot="sidebarLeft" class="hidden md:grid">
        <AppRailAnchor slot="lead" href="/" selected={$page.url.pathname === '/'}>
            <span class="text-lg">Home</span>
        </AppRailAnchor>

        <AppRailAnchor href="/archive" selected={$page.url.pathname === '/archive'}>
            <span class="text-lg">Archive</span>
        </AppRailAnchor>

        <AppRailAnchor href="/user" selected={$page.url.pathname === '/user'}>
            <span class="text-lg">User</span>
        </AppRailAnchor>

        {#if data.id}
            <AppRailAnchor href="/editor" selected={$page.url.pathname === '/editor'}>
                <span class="text-lg">Editor</span>
            </AppRailAnchor>
        {/if}

        <AppRailAnchor slot="trail" href="https://github.com/Crec0/kustos" target="_blank" title="Account">
            <Avatar slot="lead" src={Github} width="w-10" />
        </AppRailAnchor>
    </AppRail>

    <div class="mt-10 flex justify-center">
        <slot />
    </div>

    <TabGroup
        slot="pageFooter"
        active="variant-filled-surface"
        border=""
        class="bg-surface-100-800-token md:hidden"
        flex="flex-1 lg:flex-none"
        hover="hover:variant-soft-primary"
        justify="justify-center"
        rounded=""
    >
        <TabAnchor href="/" selected={$page.url.pathname === '/'}>
            <span>Home</span>
        </TabAnchor>
        <TabAnchor href="/user" selected={$page.url.pathname === '/user'}>
            <span>User</span>
        </TabAnchor>
        <TabAnchor href="/archive" selected={$page.url.pathname === '/archive'}>
            <span>Archive</span>
        </TabAnchor>
        {#if data.id}
            <TabAnchor href="/editor" selected={$page.url.pathname === '/editor'}>
                <span>Editor</span>
            </TabAnchor>
        {/if}
    </TabGroup>
</AppShell>
