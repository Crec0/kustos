<script lang="ts">
    import { derived, writable } from 'svelte/store';
    import { FileDropzone, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { ViewIcon, XIcon } from 'lucide-svelte';

    type MaybeFileList = FileList | undefined;
    type ButtonClickEvent = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };

    export let accept: string;
    export let body: string;
    export let isImage: boolean = false;

    const inputFileList = writable<MaybeFileList>(undefined);
    let inputElement: HTMLInputElement | undefined = undefined;

    export const fileStore = derived<typeof inputFileList, Map<string, File>>(
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

    const handleViewButton = (e: ButtonClickEvent) => {
        const imgElement = e.currentTarget.parentElement?.previousElementSibling;
        if (imgElement && imgElement instanceof HTMLImageElement) {
            imageModal(imgElement);
        }
    };

    function handleDeleteButton(e: ButtonClickEvent) {
        const parent = e.currentTarget.parentElement?.parentElement;
        if (parent == null) return;

        const key = parent.dataset.fileKey;

        if (key && $fileStore.has(key)) {
            $fileStore.delete(key);
        }

        parent.remove();
    }

    const modalStore = getModalStore();
    const imageModal = (img: HTMLImageElement) => {
        const modal: ModalSettings = {
            type: 'alert',
            image: img.src,
            modalClasses: 'bg-surface-300-600-token',
        };

        modalStore.trigger(modal);
    };
</script>

<FileDropzone
    {accept}
    bind:files={$inputFileList}
    bind:fileInput={inputElement}
    class="w-full"
    multiple
    name="schematics"
>
    <svelte:fragment slot="message">{body}</svelte:fragment>
</FileDropzone>

<div class={`flex gap-2 ${isImage ? 'flex-row flex-wrap' : 'flex-col'}`}>
    {#each $fileStore.entries() as [key, file] (key)}
        <div
            class={`p-2 rounded variant-filled-primary flex gap-2 items-center ${
                isImage ? 'w-max' : 'w-full'
            }`}
            data-file-key={key}
        >
            {#if isImage}
                <img src={URL.createObjectURL(file)} alt={file.name} class="max-h-[160px]" />
            {:else}
                <span class="grow text-ellipsis whitespace-nowrap overflow-clip">
                    {file.name}
                </span>
            {/if}
            <div class="flex flex-col gap-4">
                <button
                    class="chip rounded variant-ghost-primary hover:variant-filled-error duration-100 p-2"
                    on:click={handleDeleteButton}
                >
                    <XIcon />
                </button>
                {#if isImage}
                    <button
                        class="chip rounded variant-ghost-primary hover:variant-filled-secondary duration-100 p-2"
                        on:click={handleViewButton}
                    >
                        <ViewIcon />
                    </button>
                {/if}
            </div>
        </div>
    {/each}
</div>
