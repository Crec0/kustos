<script lang="ts">
    import { XIcon } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { expoOut } from 'svelte/easing';
    import { type Unsubscriber, type Updater, writable, type Writable } from 'svelte/store';

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

<div class="w-full space-y-2">
    <div class="flex items-center justify-center">
        <label
            class="bg-surface-300-600-token flex h-16 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-surface-400 hover:border-primary-500 hover:text-primary-400"
            for={name}
        >
            {body}
        </label>

        <input {accept} class="hidden" id={name} multiple {name} on:change={updateFiles} type="file" />
    </div>

    <div
        class={`flex gap-1 ${$filesArray.length === 0 ? 'hidden' : ''} ${isImage ? 'flex-row flex-wrap' : 'flex-col'}`}
    >
        {#each $filesArray as file (file.name)}
            <div
                transition:fade={{ duration: 400, easing: expoOut }}
                animate:flip={{ duration: 400, easing: expoOut }}
                class={`bg-surface-300-600-token flex items-center space-x-2 rounded p-2 ${isImage ? 'relative w-max' : 'w-full'}`}
            >
                {#if isImage}
                    <img src={URL.createObjectURL(file)} alt={file.name} class="max-h-[160px]" />
                    <button class="absolute right-2.5 top-2.5" on:click|preventDefault={() => removeFile(file)}>
                        <XIcon
                            class="variant-filled-surface rounded stroke-red-500 hover:variant-filled-error hover:stroke-red-100"
                        />
                    </button>
                {:else}
                    <span class="grow overflow-clip text-ellipsis whitespace-nowrap">
                        {file.name}
                    </span>
                    <div class="flex flex-col gap-4">
                        <button on:click|preventDefault={() => removeFile(file)}>
                            <XIcon
                                class="variant-soft-error rounded stroke-red-500 hover:variant-filled-error hover:stroke-red-100"
                            />
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
