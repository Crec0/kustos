<script lang="ts">
    import { type Writable, writable } from 'svelte/store';
    import { Card, CardContent, CardHeader } from '$components/ui/card';
    import { cn } from '$lib/utils/svelte';

    import '$lib/css/animation.pcss';
    import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '$components/ui/dialog';
    import { Button } from '$components/ui/button';
    import {
        ChevronRight,
        Trash2,
        UploadCloudIcon,
    } from 'lucide-svelte';
    import { DrawerDescription, DrawerTitle } from '$components/ui/drawer';
    import { ScrollArea } from '$components/ui/scroll-area';
    import CachedImagePreview from './CachedImagePreview.svelte';
    import { page } from '$app/stores';
    import type { BlobType } from '$lib/zod/post-form';

    export let accept: string;
    export let fileType: string;
    export let postId: string;
    export let isImage: boolean = false;

    const dialogOpen: Writable<boolean> = writable(false);
    const localBlobMap: Writable<Map<string, File>> = writable(new Map());
    const remoteBlobs: Writable<BlobType[]> = writable([]);

    type EventWithTarget = Event & {
        currentTarget: EventTarget & HTMLInputElement;
    };
    type DragEventWithTarget = DragEvent & {
        currentTarget: EventTarget & HTMLLabelElement;
        dataTransfer: DataTransfer | null;
    };

    function removeLocalBlob(blobToRemove: string) {
        $localBlobMap.delete(blobToRemove);
        $localBlobMap = $localBlobMap;
    }

    function addLocalBlobs(files: FileList) {
        for (const file of files) {
            $localBlobMap.set(file.name, file);
        }
        $localBlobMap = $localBlobMap;
    }

    function updateFiles(event: EventWithTarget) {
        if (!event.currentTarget.files) return;
        addLocalBlobs(event.currentTarget.files);
        event.currentTarget.value = '';
    }

    function dropHandler(ev: DragEventWithTarget) {
        ev.preventDefault();
        if (ev.dataTransfer == null) return;
        addLocalBlobs(ev.dataTransfer.files);
    }

    async function uploadFiles() {
        const formData = new FormData();
        $localBlobMap.forEach((blob) => {
            formData.append(fileType.slice(0, fileType.length - 1), blob);
        });

        const response = await fetch(`/api/blobs/${postId}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            $remoteBlobs.length = 0;
            $remoteBlobs.push(...(await response.json()));
            $remoteBlobs = $remoteBlobs;
            $dialogOpen = false;
        }
    }

    async function removeRemoteBlob(blobName: string) {
        const remoteBlob = $remoteBlobs.find((blob) => blob.name === blobName);
        if (!remoteBlob) return;

        const blobId = remoteBlob.id;
        const response = await fetch(
            `/api/blobs/${$page.params.id}/${blobId}`,
            {
                method: 'DELETE',
            },
        );
        if (response.ok) {
            const blobIdx = $remoteBlobs.findIndex((blob) => blob.name === blobName);
            if (blobIdx !== -1) $remoteBlobs.splice(blobIdx, 1);
            $remoteBlobs = $remoteBlobs;
            removeLocalBlob(blobName);
        }
    }
</script>

<Dialog bind:open={$dialogOpen}>
    <DialogTrigger class="w-full">
        <Button
            class="w-full text-base font-normal justify-start"
            variant="outline"
        >
            <span class='grow text-left'>Manage {fileType}</span>
            <ChevronRight class="h-6 w-6" />
        </Button>
    </DialogTrigger>
    <DialogContent class="max-w-[60rem]">
        <DialogHeader>
            <DrawerTitle>Upload {fileType}</DrawerTitle>
            <DrawerDescription>Upload {fileType} you wish to add to the project</DrawerDescription>
        </DialogHeader>

        <Card class={cn('w-full p-2')}>
            <CardHeader class="p-2">
                <label
                    class="flex h-16 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed text-xl transition-colors border-accent hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
                    for={fileType}
                    on:drop={dropHandler}
                >
                    <UploadCloudIcon class="h-8 w-8 text-muted-foreground" />
                    <span class="pl-2 text-base text-muted-foreground">Click or Drag and drop to add files</span>
                </label>

                <input
                    {accept}
                    class="hidden"
                    id={fileType}
                    multiple
                    name={fileType}
                    on:change={updateFiles}
                    type="file"
                />
            </CardHeader>
            <CardContent
                class={cn(
                    'flex space-y-0 p-2 transition-all',
                    $localBlobMap.size === 0 ? 'hidden' : '',
                    'flex-col space-y-1.5',
                )}
            >
                <ScrollArea class="w-full rounded h-[50vh]">
                    {#each $localBlobMap as [_, blob] (blob.name)}
                        <div
                            class="flex w-full items-center gap-2 rounded px-2 py-1 ring-inset transition-all hover:ring-primary hover:bg-primary/40 hover:ring-2 has-[.SELECTION:hover]:ring-destructive has-[.SELECTION:hover]:bg-destructive/40 has-[.SELECTION:hover]:text-destructive-foreground"
                        >
                            <span class="grow truncate rounded">
                                {blob.name}
                            </span>

                            {#if isImage}
                                <CachedImagePreview {blob} />
                            {/if}
                            <Button
                                class="SELECTION bg-destructive"
                                variant="destructive"
                                on:click={() => removeLocalBlob(blob.name)}
                            >
                                <Trash2 class="h-6 w-6" />
                            </Button>
                        </div>
                    {/each}
                </ScrollArea>
            </CardContent>
        </Card>

        <div class="flex w-full flex-col gap-2 max-w-[60rem] md:mx-auto md:flex-col">
            <Button class="w-full text-base" on:click={uploadFiles}>Upload {fileType}</Button>
            <Button
                class="w-full"
                on:click={() => $dialogOpen = false}
                variant="secondary"
            >
                Cancel</Button>
        </div>
    </DialogContent>
</Dialog>
