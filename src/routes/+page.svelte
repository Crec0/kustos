<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

{#if data.username != null}
    <div class="m-2 rounded-sm bg-gray-700 p-2 text-2xl font-semibold text-gray-50">
        Welcome back, {data.username}!
    </div>
    <form action="/?/logout" method="post">
        <button
            class="m-2 rounded bg-red-300 p-2 text-2xl font-semibold text-red-50 ring-2 ring-inset ring-red-400"
        >
            LOGOUT
        </button>
    </form>
{:else}
    <form action="/?/login" method="post">
        <button
            class="m-2 rounded bg-blue-300 p-2 text-2xl font-semibold text-blue-50 ring-2 ring-inset ring-blue-400"
        >
            CLICK ME TO AUTHORIZE
        </button>
    </form>
{/if}
