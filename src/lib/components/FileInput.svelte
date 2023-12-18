<script lang="ts">
    import { derived, writable } from 'svelte/store';
    import { FileDropzone } from '@skeletonlabs/skeleton';
    import { XIcon } from 'lucide-svelte';

    export let accept: string | undefined;
    export let isImage: boolean = false;

    type MaybeFileList = FileList | undefined;

    let inputFileList = writable<MaybeFileList>(undefined);
    let inputElement: HTMLInputElement | undefined = undefined;

    const fileStore = derived<typeof inputFileList, Map<string, File>>(
        inputFileList,
        (fileList, _, update) => {
            if (fileList == undefined) return;

            update((curr) => {
                const updatedMap = new Map([...curr]);
                Array.from(fileList).forEach((file) => {
                    updatedMap.set(crypto.randomUUID(), file);
                });
                return updatedMap;
            });

            if (inputElement != undefined) {
                inputElement.value = '';
            }
        },
        new Map(),
    );

    function handleDelete(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
        const parent = e.currentTarget.parentElement;
        if (parent == null) return;

        const key = parent.dataset.fileKey;

        if (key && $fileStore.has(key)) {
            $fileStore.delete(key);
        }

        parent.remove();
    }
</script>

<FileDropzone
    {accept}
    bind:files={$inputFileList}
    bind:fileInput={inputElement}
    class="w-full"
    multiple
    name="schematics"
>
    <svelte:fragment slot="message">Litematic(s)</svelte:fragment>
</FileDropzone>

{#each $fileStore.entries() as [key, file]}
    <div
        class="px-3 py-1 rounded variant-filled-primary flex items-center w-full"
        data-file-key={key}
    >
        {#if isImage}
            <img src={URL.createObjectURL(file)} alt={file.name} />
        {:else}
            <span class="grow text-ellipsis whitespace-nowrap overflow-clip">
                {file.name}
            </span>
        {/if}

        <button
            class="chip rounded variant-ghost-primary hover:variant-filled-error duration-100 py-2"
            on:click={handleDelete}
        >
            <XIcon />
        </button>
    </div>
{/each}
