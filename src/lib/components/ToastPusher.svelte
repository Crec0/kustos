<script lang="ts">
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import Toast from '$components/Toast.svelte';
    import { toastElements, toasts, toastPortal } from '$lib/client/utils/Toaster';
</script>

<div
    class="fixed bottom-0 right-0 z-50 m-4 mt-auto flex flex-col items-end gap-2 md:bottom-0"
    use:toastPortal
>
    {#each $toasts as toast (toast.id)}
        <div
            in:fly={{ x: 200, duration: 100 }}
            out:fly={{ x: 200, duration: 100 }}
            animate:flip={{ duration: 100 }}
        >
            <Toast elements={toastElements} {toast} />
        </div>
    {/each}
</div>
