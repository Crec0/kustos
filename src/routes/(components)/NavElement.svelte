<script lang="ts">
    import { cn } from '$lib/utils/svelte';
    import { page } from '$app/stores';

    export let href: string;
    export let name: string;

    export let style: string = '';
</script>

<a
    class={cn(
        'transition-colors hover:text-foreground/80',
        style,
        $page.url.pathname === href ? 'text-foreground' : 'text-foreground/60',
    )}
    {href}
>
    {name}
</a>
