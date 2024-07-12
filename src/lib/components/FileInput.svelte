<script lang="ts">
    import { Trash, Trash2, XIcon } from 'lucide-svelte';
    import { type Unsubscriber, type Updater, writable, type Writable } from 'svelte/store';
    import { Card, CardContent, CardHeader } from '$components/ui/card';
    import { Button } from '$components/ui/button';
    import { cn } from '$utils';

    export let accept: string;
    export let body: string;
    export let name: string;
    export let isImage: boolean = false;
    export let files: {
        subscribe(run: (value: FileList) => void): Unsubscriber;
        set(files: File[] | FileList): void;
        update(updater: Updater<File[]>): void;
    };

    let filesArray: Writable<File[]> = writable([]);

    function update() {
        const dt = new DataTransfer();
        $filesArray.forEach((file) => dt.items.add(file));
        files.set(dt.files);
    }

    function removeFile(fileToRemove: File) {
        for (let i = 0; i < $filesArray.length; i++) {
            const file = $filesArray[i];
            if (file.name === fileToRemove.name) {
                $filesArray.splice(i, 1);
            }
        }
        $filesArray = $filesArray;
        update();
    }

    let updateFiles = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        if (!event.currentTarget.files) return;
        const uploadedFiles = [];
        for (let i = 0; i < event.currentTarget.files.length; i++) {
            const file = event.currentTarget.files[i];
            if ($filesArray.some((f) => f.name === file.name)) {
                continue;
            }
            uploadedFiles.push(file);
        }
        $filesArray = [...$filesArray, ...uploadedFiles];
        event.currentTarget.value = '';
        update();
    };

    function removeAnimationCleanly(target: HTMLLabelElement) {
        const func = (pp: AnimationEvent) => {
            if (pp && pp.target && pp.target instanceof HTMLLabelElement) {
                pp.target.classList.remove('blinking');
            }
            target.removeEventListener('animationiteration', func);
        };
        target.addEventListener('animationiteration', func);
    }

    function dropHandler(
        ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement; dataTransfer: DataTransfer | null },
    ) {
        ev.preventDefault();
        removeAnimationCleanly(ev.currentTarget);

        if (ev.dataTransfer == null) return;

        const uploadedFiles = [];
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            const file = ev.dataTransfer.files[i];
            if ($filesArray.some((f) => f.name === file.name)) {
                continue;
            }
            uploadedFiles.push(file);
        }

        $filesArray = [...$filesArray, ...uploadedFiles];
        update();
    }

    function handleDragOver(ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }) {
        ev.preventDefault();

        if (!ev.currentTarget.classList.contains('blinking')) {
            ev.currentTarget.classList.add('blinking');
        }
    }

    function handleDragEnd(ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }) {
        ev.preventDefault();

        removeAnimationCleanly(ev.currentTarget);
    }
</script>

<Card class={cn('w-full p-2', isImage ? '' : 'max-w-lg')}>
    <CardHeader
        class={cn(
            'flex space-y-0 p-2',
            $filesArray.length === 0 ? 'hidden' : '',
            isImage ? 'flex-row flex-wrap gap-2' : 'flex-col space-y-1.5',
        )}
    >
        {#each $filesArray as file (file.name)}
            {#if isImage}
                <div class="flex flex-col rounded bg-accent">
                    <Button
                        class="bg-secondary text-secondary-foreground"
                        variant="destructive"
                        id="thing"
                        on:click={() => removeFile(file)}
                    >
                        <Trash2 class="h-6 w-6" />
                    </Button>
                    <img src={URL.createObjectURL(file)} alt={file.name} class="h-[12rem] object-contain p-2" />
                </div>
            {:else}
                <div
                    class="flex w-full items-center gap-x-2 rounded transition-colors has-[.SELECTION:hover]:bg-destructive/20 has-[.SELECTION:hover]:text-destructive-foreground"
                >
                    <span class="grow truncate p-2">
                        {file.name}
                    </span>
                    <Button
                        class="SELECTION mr-2 bg-secondary text-secondary-foreground"
                        variant="destructive"
                        on:click={() => removeFile(file)}
                    >
                        <Trash2 class="h-6 w-6" />
                    </Button>
                </div>
            {/if}
        {/each}
    </CardHeader>
    <CardContent class="p-2">
        <label
            class="hover:light:bg-accent/20 flex h-16 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed transition-colors hover:border-accent hover:bg-accent/40 hover:text-foreground"
            for={name}
            on:drop={dropHandler}
            on:dragover={handleDragOver}
            on:dragend={handleDragEnd}
            on:dragleave={handleDragEnd}
        >
            {body}
        </label>

        <input {accept} class="hidden" id={name} multiple {name} on:change={updateFiles} type="file" />
    </CardContent>
</Card>

<style>
    .blinking {
        animation: blinking 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes blinking {
        0%,
        100% {
            border-color: hsl(var(--accent));
            scale: 1;
            translate: 0 0;
        }

        25% {
            border-color: hsl(var(--primary));
            scale: 1.05;
            translate: -10px 0;
        }

        50% {
            border-color: hsl(var(--primary));
            scale: 1.1;
            translate: 0 0;
        }

        75% {
            border-color: hsl(var(--primary));
            scale: 1.05;
            translate: 10px 0;
        }
    }
</style>
