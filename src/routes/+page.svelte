<script lang="ts">
    import type { PageData } from './$types';
    import Login from '$components/Login.svelte';
    import Logout from '$components/Logout.svelte';

    export let data: PageData;
</script>

{#if data.username == null}
    <Login />
{:else}
    <div class="mx-auto mt-2 flex w-3/4 flex-col align-bottom">
        <div class="flex items-center rounded-md bg-varden-400 px-6 py-2 text-3xl">
            <span class="grow">
                Welcome back, {data.username}!
            </span>
            <Logout />
        </div>
    </div>
{/if}
