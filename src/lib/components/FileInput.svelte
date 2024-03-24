<script lang="ts">
    import { XIcon } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { expoOut } from 'svelte/easing';

    export let accept: string;
    export let body: string;
    export let name: string;
    export let isImage: boolean = false;
    export let files: File[];

    let fileList: FileList;

    function removeFile(fileToRemove: File) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name === fileToRemove.name) {
                files.splice(i, 1);
            }
        }
        files = files;
    }

    let updateFiles = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        if (!event.currentTarget.files) return;
        const uploadedFiles = [];
        for (let i = 0; i < event.currentTarget.files.length; i++) {
            const file = event.currentTarget.files[i];
            if (files.some((f) => f.name === file.name)) {
                continue;
            }
            uploadedFiles.push(file);
        }
        files = [...files, ...uploadedFiles];
        event.currentTarget.value = '';
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

        <input
            {accept}
            bind:files={fileList}
            class="hidden"
            id={name}
            multiple
            {name}
            on:change={updateFiles}
            type="file"
        />
    </div>

    {#if files && files.length > 0}
        <div class={`flex gap-1  ${isImage ? 'flex-row flex-wrap' : 'flex-col'}`}>
            {#each files as file (file.name)}
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
    {/if}
</div>
