<script lang="ts">
    import { derived, writable } from 'svelte/store';
    import { ViewIcon, XIcon } from 'lucide-svelte';
    import { Dialog, DialogContent, DialogTrigger } from '$components/ui/dialog';

    type MaybeFileList = FileList | undefined;
    type ButtonClickEvent = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };

    export let accept: string;
    export let body: string;
    export let name: string;
    export let isImage: boolean = false;
    export let files: File[];

    const inputFileList = writable<MaybeFileList>(undefined);
    let inputElement: HTMLInputElement | undefined = undefined;

    export const fileStore = derived<typeof inputFileList, Set<File>>(
        inputFileList,
        (fileList, _, update) => {
            if (fileList == undefined) return;

            update((curr) => {
                const fileSet = new Set([...curr, ...Array.from(fileList)]);
                files = [...fileSet];
                return fileSet;
            });

            if (inputElement != undefined) {
                inputElement.value = '';
            }
        },
        new Set(),
    );

    function handleDeleteButton(e: ButtonClickEvent) {
        const parent = e.currentTarget.parentElement?.parentElement;
        if (parent == null) return;

        const key = parent.dataset.fileKey;

        if (key && $fileStore.has(key)) {
            $fileStore.delete(key);
        }

        parent.remove();
    }
</script>

<div class="w-full">
    <div class="flex items-center justify-center">
        <label
            for={name}
            class="bg-primary-100-800-token flex h-16 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed hover:bg-primary-200-700-token"
        >
            {body}
        </label>

        <input
            id={name}
            type="file"
            multiple
            {name}
            {accept}
            bind:this={inputElement}
            bind:files={$inputFileList}
            class="hidden"
        />
    </div>

    <div class={`flex gap-2 ${isImage ? 'flex-row flex-wrap' : 'flex-col'}`}>
        {#each $fileStore.entries() as [key, file] (key)}
            <div
                class={`flex items-center gap-2 rounded bg-secondary p-2 ${isImage ? 'w-max' : 'w-full'}`}
                data-file-key={key}
            >
                {#if isImage}
                    {@const imageUrl = URL.createObjectURL(file)}
                    <img src={imageUrl} alt={file.name} class="max-h-[160px]" />
                    <div class="flex flex-col gap-4">
                        <button
                            class="rounded p-2 duration-100 hover:bg-primary-200-700-token"
                            on:click={handleDeleteButton}
                        >
                            <XIcon />
                        </button>
                        <Dialog>
                            <DialogTrigger class="rounded p-2 duration-100 hover:bg-primary">
                                <ViewIcon />
                            </DialogTrigger>
                            <DialogContent>
                                <img src={imageUrl} alt={file.name} />
                            </DialogContent>
                        </Dialog>
                    </div>
                {:else}
                    <span class="grow overflow-clip text-ellipsis whitespace-nowrap">
                        {file.name}
                    </span>
                    <div class="flex flex-col gap-4">
                        <button class="rounded p-2 duration-100 hover:bg-destructive" on:click={handleDeleteButton}>
                            <XIcon />
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
