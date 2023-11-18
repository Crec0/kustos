<script lang="ts">
    import type { PageData } from './$types';
    import Login from '$components/Login.svelte';
    import Logout from '$components/Logout.svelte';

    export let data: PageData;
</script>

{#if data.username == null}
    <Login />
{:else}
    <div class="mx-auto flex w-3/4 flex-col align-bottom">
        <div class=" bg-varden-400 my-8 flex items-center rounded-md text-3xl">
            <span class="grow"> Kustos [{data.username}] </span>
            <Logout />
        </div>
    </div>
{/if}
