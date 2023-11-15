<script lang="ts">
    import { flip } from 'svelte/animate';
    import Toast from '$components/Toast.svelte';
    import { toastElements, toasts, toastPortal } from '$lib/client/utils/Toaster';
</script>

<div
    class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
    use:toastPortal
>
    {#each $toasts as toast (toast.id)}
        <div animate:flip={{ duration: 500 }}>
            <Toast elements={toastElements} {toast} />
        </div>
    {/each}
</div>
