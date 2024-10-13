<script lang='ts'>
    import { Trash2 } from 'lucide-svelte';
    import {
        type Unsubscriber,
        type Updater,
        writable,
        type Writable,
    } from 'svelte/store';
    import {
        Card,
        CardContent,
        CardHeader,
    } from '$components/ui/card';
    import { Button } from '$components/ui/button';
    import { cn } from '$lib/utils/svelte';
    import { tick } from 'svelte';

    import '$lib/css/animation.pcss';


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
        for ( let i = 0; i < $filesArray.length; i++ ) {
            const file = $filesArray[i];
            if ( file.name === fileToRemove.name ) {
                $filesArray.splice(i, 1);
            }
        }
        $filesArray = $filesArray;
        update();
    }

    let updateFiles = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        if ( !event.currentTarget.files ) return;
        const uploadedFiles = [];
        for ( let i = 0; i < event.currentTarget.files.length; i++ ) {
            const file = event.currentTarget.files[i];
            if ( $filesArray.some((f) => f.name === file.name) ) {
                continue;
            }
            uploadedFiles.push(file);
        }
        $filesArray = [ ...$filesArray, ...uploadedFiles ];
        event.currentTarget.value = '';
        update();
    };

    function removeAnimationCleanly(target: HTMLLabelElement) {
        const func = (pp: AnimationEvent) => {
            if ( pp && pp.target && pp.target instanceof HTMLLabelElement ) {
                pp.target.classList.remove('dragover', 'curvy-arrows');
            }
            target.removeEventListener('animationiteration', func);
        };
        target.addEventListener('animationiteration', func);
    }

    function dropHandler(
        ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement; dataTransfer: DataTransfer | null },
    ) {
        ev.preventDefault();

        // TODO do something fancy with the dragover effect
        // removeAnimationCleanly(ev.currentTarget);

        if ( ev.dataTransfer == null ) return;

        const uploadedFiles = [];
        for ( let i = 0; i < ev.dataTransfer.files.length; i++ ) {
            const file = ev.dataTransfer.files[i];
            if ( $filesArray.some((f) => f.name === file.name) ) {
                continue;
            }
            uploadedFiles.push(file);
        }

        $filesArray = [ ...$filesArray, ...uploadedFiles ];
        update();
    }

    async function handleDragOver(ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }) {
        ev.preventDefault();
        await tick();

        // TODO do something fancy with the dragover effect
        // if ( !ev.currentTarget.classList.contains('dragover') ) {
        //     ev.currentTarget.classList.add('dragover', 'curvy-arrows');
        // }
        //
        // console.log(ev.currentTarget.classList);
    }

    async function handleDragEnd(ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }) {
        ev.preventDefault();
        await tick();

        console.log(ev.currentTarget.classList);

        removeAnimationCleanly(ev.currentTarget);
    }
</script>

<Card class={cn('w-full p-2')}>
    <CardHeader class='p-2'>
        <label
            class='text-xl flex h-32 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-accent transition-colors hover:bg-accent hover:text-accent-foreground hover:border-primary/50'
            for={name}
            on:dragend={handleDragEnd}
            on:dragleave={handleDragEnd}
            on:dragover={handleDragOver}
            on:drop={dropHandler}
        >
            {body}
        </label>

        <input {accept} class='hidden' id={name} multiple {name} on:change={updateFiles} type='file' />
    </CardHeader>
    <CardContent
        class={cn(
            'flex space-y-0 p-2 transition-all',
            $filesArray.length === 0 ? 'hidden' : '',
            isImage ? 'flex-row flex-wrap gap-2' : 'flex-col space-y-1.5',
        )}
    >
        <!-- TODO: Improve image quality coz its hella bad rn -->
        {#each $filesArray as file (file.name)}
            <div
                class={cn(
                    "flex items-center rounded has-[.SELECTION:hover]:ring-destructive ring-inset has-[.SELECTION:hover]:bg-destructive/40 has-[.SELECTION:hover]:text-destructive-foreground hover:ring-2 hover:ring-primary hover:bg-primary/40 transition-all",
                    isImage ? 'flex-col' : 'w-full'
                )}
            >
                {#if !isImage}
                    <span class='grow truncate p-2 rounded'> {file.name} </span>
                {/if}

                <Button
                    class={cn('SELECTION bg-destructive/20', isImage ? 'w-full' : '')}
                    variant='destructive'
                    on:click={() => removeFile(file)}
                >
                    <Trash2 class='h-6 w-6' />
                </Button>

                {#if isImage}
                    <img src={URL.createObjectURL(file)} alt={file.name} class='h-[12rem] object-contain p-2 rounded' />
                {/if}
            </div>
        {/each}
    </CardContent>
</Card>

<style>
    .blinking {
        border-color: var(--primary) / 50%;
    }
</style>
