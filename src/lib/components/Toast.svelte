<script lang="ts">
    import { createProgress, melt, type Toast, type ToastsElements } from '@melt-ui/svelte';
    import { fly } from 'svelte/transition';
    import { X } from 'lucide-svelte';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import type { ToastData } from '$lib/client/utils/Toaster';

    export let elements: ToastsElements;

    $: closeToast = elements.close;
    $: toastTitle = elements.title;
    $: toastContent = elements.content;
    $: toastDescription = elements.description;

    export let toast: Toast<ToastData>;
    $: ({ title, description, color } = toast.data);

    const percentage = writable(0);
    const {
        elements: { root: progress },
        options: { max },
    } = createProgress({ value: percentage });

    onMount(() => {
        let frame: number;
        const updatePercentage = () => {
            $percentage = toast.getPercentage();
            frame = requestAnimationFrame(updatePercentage);
        };
        frame = requestAnimationFrame(updatePercentage);

        return () => cancelAnimationFrame(frame);
    });
</script>

<div
    class="relative rounded-lg bg-gradient-to-r to-0% text-black shadow-md"
    in:fly={{ duration: 150, x: '100%' }}
    out:fly={{ duration: 150, x: '100%' }}
    style="--gradiant-position: {(100 * ($percentage ?? 0)) / ($max ?? 1)}%;
           --tw-gradient-from: var(--color-{color}) var(--gradiant-position);
           --tw-gradient-to: var(--color-{color}-60) var(--gradiant-position);
           --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);"
    use:melt={$toastContent(toast.id)}
    use:melt={$progress}
>
    <div
        class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5 pt-6"
    >
        <div>
            <h3 class="flex items-center gap-2 font-semibold" use:melt={$toastTitle(toast.id)}>
                {title}
                <span class="sq-1.5 rounded-full fg-{color}" />
            </h3>
            <div use:melt={$toastDescription(toast.id)}>
                {description}
            </div>
        </div>
        <button
            class="
                bg-{color} sq-6 hover:bg-{color}/50
                absolute right-4 top-4 grid place-items-center rounded-full"
            use:melt={$closeToast(toast.id)}
        >
            <X class="sq-4" />
        </button>
    </div>
</div>
