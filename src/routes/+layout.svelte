<script lang="ts">
    import '../app.css';
    import { AppBar, AppShell, initializeStores, Toast } from '@skeletonlabs/skeleton';
    import Img from '$lib/assets/icon.svg';
    import type { LayoutServerData } from './$types';
    import LoginLogout from '$components/LoginLogout.svelte';

    export let data: LayoutServerData;

    initializeStores();
</script>

<Toast />

<AppShell>
    <svelte:fragment slot="header">
        <AppBar class="hidden md:block">
            <svelte:fragment slot="lead">
                <img alt="Icon" class="w-12" src={Img} />
            </svelte:fragment>
            <span class="text-2xl hidden md:block font-semibold"> Kustos </span>
            <svelte:fragment slot="trail">
                <LoginLogout user={data} />
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <div class="flex min-h-full justify-center">
        <slot />
    </div>
    <svelte:fragment slot="footer">
        <AppBar class="block md:hidden">
            <svelte:fragment slot="lead">(icon)</svelte:fragment>
            (title)
            <svelte:fragment slot="trail">(actions)</svelte:fragment>
        </AppBar>
    </svelte:fragment>
</AppShell>
