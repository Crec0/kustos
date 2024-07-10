<script lang="ts">
    import { XIcon } from 'lucide-svelte';
    import { type Unsubscriber, type Updater, writable, type Writable } from 'svelte/store';
    import { Card, CardContent, CardHeader } from '$components/ui/card';
    import { Button } from '$components/ui/button';

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
</script>

<Card class="w-full max-w-lg p-2">
    <CardHeader
        class={`flex ${$filesArray.length === 0 ? 'hidden' : ''} ${isImage ? 'flex-row flex-wrap' : 'flex-col'}`}
    >
        {#each $filesArray as file (file.name)}
            <div class={`flex items-center space-x-2 rounded ${isImage ? 'relative w-max' : 'w-full'}`}>
                {#if isImage}
                    <img src={URL.createObjectURL(file)} alt={file.name} class="max-h-[160px]" />
                    <button class="absolute right-2.5 top-2.5" on:click|preventDefault={() => removeFile(file)}>
                        <XIcon
                            class="variant-filled-surface hover:variant-filled-error rounded stroke-red-500 hover:stroke-red-100"
                        />
                    </button>
                {:else}
                    <div
                        class="flex w-fit items-center gap-x-2 rounded transition-colors has-[#thing:hover]:bg-destructive/60 has-[#thing:hover]:text-destructive-foreground"
                    >
                        <span class="w-80 max-w-80 truncate px-2">
                            {file.name}
                        </span>
                        <Button
                            class="space-x-2 bg-secondary text-secondary-foreground"
                            variant="destructive"
                            id="thing"
                            on:click={() => removeFile(file)}
                        >
                            <span> Remove </span>
                            <XIcon />
                        </Button>
                    </div>
                {/if}
            </div>
        {/each}
    </CardHeader>
    <CardContent class="p-2">
        <label
            class="hover:light:bg-accent/20 flex h-16 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed transition-colors hover:border-accent hover:bg-accent/40 hover:text-foreground"
            for={name}
        >
            {body}
        </label>

        <input {accept} class="hidden" id={name} multiple {name} on:change={updateFiles} type="file" />
    </CardContent>
</Card>
