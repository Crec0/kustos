<script>
    import ToastPusher from '$components/ToastPusher.svelte';
    import '../app.css';
</script>

<ToastPusher />

<div class="flex min-h-screen flex-col bg-black text-black">
    <slot />
</div>
