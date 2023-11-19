<script>
    import ToastPusher from '$components/ToastPusher.svelte';
    import '../app.css';
</script>

<ToastPusher />

<div class="font-body bg-background flex min-h-screen flex-col text-content">
    <slot />
</div>
