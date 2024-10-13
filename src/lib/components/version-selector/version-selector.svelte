<script lang='ts'>
    import {
        derived,
        type Writable,
        writable,
    } from 'svelte/store';
    import VersionsDropdown from '$components/version-selector/versions-dropdown.svelte';
    import type { ParsedVersions } from '$lib/zod/mc-versions';
    import { Label } from '$components/ui/label';
    import { Switch } from '$components/ui/switch';
    import { Button } from '$components/ui/button';
    import { Plus } from 'lucide-svelte';
    import {
        Card,
        CardContent,
        CardHeader,
    } from '$components/ui/card';
    import Minus from 'lucide-svelte/icons/minus';
    import {
        onMount,
        tick,
    } from 'svelte';


    export let parsedVersions: ParsedVersions;

    const showSnapshots: Writable<boolean> = writable(false);

    const allSelectableVersions = derived([ showSnapshots ], ([ $showSnapshots ]) => {
        const selectableVersions: Record<string, number> = {};
        Object.entries(parsedVersions)
            .reverse()
            .forEach(([ v, { isSnapshot, id } ]) => {
                if ( $showSnapshots || !isSnapshot ) {
                    selectableVersions[v] = id;
                }
            });
        return selectableVersions;
    });

    type RangeComponent = {
        id: string;
        start: number;
        end: number;
    };

    const ranges: Writable<Map<string, RangeComponent>> = writable(new Map());

    export const processedRanges = derived(ranges, ($ranges) => {
        if ( $ranges.size === 0 ) return [];

        const infinityBar = [ ...$ranges.values() ]
            .map(({ start, end }) => [ Math.min(start, end), Math.max(start, end) ])
            .sort((a, b) => a[0] - b[0]);

        if ( infinityBar.length === 0 ) return [];

        const mergedRanges: number[][] = [ infinityBar[0] ];
        for ( const segment of infinityBar ) {
            const prev = mergedRanges[mergedRanges.length - 1];
            if ( prev[1] < segment[0] ) {
                mergedRanges.push(segment);
            } else {
                prev[1] = Math.max(prev[1], segment[1]);
            }
        }

        return mergedRanges;
    });

    const addRange = async () => {
        await tick();
        ranges.update((oldRanges) => {
            const newId = crypto.randomUUID();
            return new Map(oldRanges).set(newId, { id: newId, start: 696969, end: 696969 });
        });
    };

    const removeRange = async (id: string) => {
        await tick();
        ranges.update((oldRanges) => {
            const newRanges = new Map(oldRanges);
            newRanges.delete(id);
            return newRanges;
        });
    };

    onMount(() => addRange());
</script>

<Card class='w-max p-2'>
    <CardHeader class='p-0'>
        Version
    </CardHeader>
    <CardContent class='p-0'>
        <Card class='border-0'>
            <CardHeader class='px-0 py-2'>
                <div class='flex min-w-fit items-center gap-2'>
                    <Label class='font-normal' for='show-snapshots'>Show Snapshots</Label>
                    <Switch bind:checked={$showSnapshots} class='' id='show-snapshots' />
                </div>
            </CardHeader>
            <CardContent class='flex flex-col gap-2 p-0'>
                {#each $ranges.entries() as [ id, range ] (id)}
                    <div class='flex gap-2'>
                        <VersionsDropdown bind:selectedVersionId={range.start} versions={allSelectableVersions} />
                        <VersionsDropdown bind:selectedVersionId={range.end} versions={allSelectableVersions} />
                        {#if $ranges.size === 1}
                            <Button variant='outline' class='cursor-default hover:bg-background' on:click={() => {}}>
                                <span class='h-4 w-4'> &nbsp; </span>
                            </Button>
                        {:else}
                            <Button
                                variant='outline'
                                class='hover:bg-destructive hover:text-destructive-foreground'
                                on:click={() => removeRange(id)}
                            >
                                <Minus class='h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                        {/if}
                    </div>
                {/each}
                <Button on:click={addRange} variant='outline'>
                    <Plus class='h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </CardContent>
        </Card>
    </CardContent>
</Card>
