<script lang="ts">
    import '$lib/css/app.pcss';
    import Img from '$lib/assets/kustos.svg';
    import type { LayoutServerData } from './$types';
    import LoginLogout from '$components/LoginLogout.svelte';
    import { page } from '$app/stores';
    import { Toaster } from '$components/ui/sonner';
    import NavElement from '$components/nav-element.svelte';
    import { cn } from '$lib/utils/svelte';
    import { ModeWatcher, toggleMode } from 'mode-watcher';
    import { Moon, Sun } from 'lucide-svelte';
    import { Button } from '$components/ui/button';

    export let data: LayoutServerData;
</script>

<Toaster />
<ModeWatcher />

<div class="relative">
    <div class="sticky top-0 z-10 flex w-full items-center gap-2 bg-background px-8 py-5">
        <div class="flex grow items-center gap-6 text-xl">
            <a
                class={cn(
                    'flex w-max items-center justify-between transition-colors hover:text-foreground/80',
                    $page.url.pathname === '/' ? 'text-foreground' : 'text-foreground/60',
                )}
                href="/"
            >
                <img alt="Icon" class="w-12" src={Img} />
                <div class="hidden font-semibold md:block">Kustos</div>
            </a>
            <nav class="flex items-baseline gap-6">
                <NavElement href="/archive" name="Archive" />
                {#if data.id}
                    <NavElement href="/editor" name="Editor" />
                {/if}
            </nav>
        </div>
        <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </Button>
        <LoginLogout user={data} />
    </div>

    <div class="mt-5 flex justify-center">
        <slot />
    </div>
</div>
