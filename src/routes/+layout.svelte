<script>
    import ToastPusher from '$components/ToastPusher.svelte';
    import '../app.css';
</script>

<ToastPusher />

<div class="font-body text-content bg-base flex min-h-screen flex-col">
    <slot />
</div>
