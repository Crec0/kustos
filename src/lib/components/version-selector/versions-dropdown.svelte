<script lang="ts">
    import { derived, type Readable, writable } from 'svelte/store';
    import { ChevronsUpDown } from 'lucide-svelte';
    import { Popover, PopoverContent, PopoverTrigger } from '$components/ui/popover';
    import { Button } from '$components/ui/form';
    import VirtualList from 'svelte-tiny-virtual-list';
    import Check from 'lucide-svelte/icons/check';

    export let versions: Readable<Record<string, number>>;
    export let selectedVersionId = 696969;

    let selectedVersion: string = 'Latest';

    let searchValue = writable('');

    const filteredVersions = derived([versions, searchValue], ([$versions, $searchValue]) => {
        return Object.entries($versions).filter(([v]) => v.includes($searchValue));
    });

    let open = false;

    function selectVersion(idx: number) {
        const selection = $filteredVersions[idx];
        selectedVersion = selection[0];
        selectedVersionId = selection[1];
        open = false;
    }
</script>

<div class="flex items-center justify-between gap-2">
    <Popover bind:open>
        <PopoverTrigger asChild let:builder>
            <Button
                builders={[builder]}
                class="flex w-[180px] min-w-fit items-center p-2 text-base"
                role="combobox"
                type="button"
                variant="outline"
            >
                <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
                <span class="grow">{selectedVersion}</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[180px] p-0">
            <input
                placeholder="Search version"
                class="flex h-10 w-full rounded-md px-2 py-3 outline-none"
                bind:value={$searchValue}
            />
            <VirtualList height={300} itemCount={$filteredVersions.length} itemSize={36} width="100%">
                <div slot="item" let:index let:style {style}>
                    <button
                        class="grid h-full w-full grid-cols-[2rem_1fr] items-center justify-items-start gap-2 px-2 hover:bg-accent"
                        on:click|preventDefault={() => selectVersion(index)}
                    >
                        {#if selectedVersionId === $filteredVersions[index][1]}
                            <Check class="ml-1" />
                        {/if}
                        <span class="col-start-2">{$filteredVersions[index][0]}</span>
                    </button>
                </div>
            </VirtualList>
        </PopoverContent>
    </Popover>
</div>
