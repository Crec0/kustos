<script lang="ts">
    import '../app.css';
    import {
        AppBar,
        AppRail,
        AppRailAnchor,
        AppShell,
        Avatar,
        initializeStores,
        Modal,
        TabAnchor,
        TabGroup,
        Toast,
    } from '@skeletonlabs/skeleton';
    import Img from '$lib/assets/kustos.svg';
    import Github from '$lib/assets/github.svg';
    import type { LayoutServerData } from './$types';
    import LoginLogout from '$components/LoginLogout.svelte';
    import { page } from '$app/stores';

    export let data: LayoutServerData;

    initializeStores();
</script>

<Toast />
<Modal />

<AppShell>
    <svelte:fragment slot="header">
        <AppBar gap="gap-0 md:gap-4 md">
            <svelte:fragment slot="lead">
                <img alt="Icon" class="w-12" src={Img} />
            </svelte:fragment>

            <div class="text-2xl hidden md:block font-semibold">Kustos</div>

            <svelte:fragment slot="trail">
                <LoginLogout user={data} />
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
        <AppRail class="hidden md:flex md:flex-col">
            <AppRailAnchor href="/" selected={$page.url.pathname === '/'}>
                <span class="text-lg">Home</span>
            </AppRailAnchor>

            <AppRailAnchor href="/archive" selected={$page.url.pathname === '/archive'}>
                <span class="text-lg">Archive</span>
            </AppRailAnchor>

            {#if data.id}
                <AppRailAnchor href="/user" selected={$page.url.pathname === '/user'}>
                    <span class="text-lg">User</span>
                </AppRailAnchor>

                <AppRailAnchor href="/editor" selected={$page.url.pathname === '/editor'}>
                    <span class="text-lg">Editor</span>
                </AppRailAnchor>
            {/if}

            <svelte:fragment slot="trail">
                <AppRailAnchor
                    href="https://github.com/Crec0/kustos"
                    target="_blank"
                    title="Account"
                >
                    <svelte:fragment slot="lead">
                        <Avatar src={Github} width="w-10" />
                    </svelte:fragment>
                </AppRailAnchor>
            </svelte:fragment>
        </AppRail>
    </svelte:fragment>

    <div class="flex justify-center mt-10">
        <slot />
    </div>

    <svelte:fragment slot="pageFooter">
        <TabGroup
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
    </svelte:fragment>
</AppShell>
