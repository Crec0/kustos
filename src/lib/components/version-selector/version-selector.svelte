<script lang="ts">
    import { derived, type Writable, writable } from 'svelte/store';
    import VersionsDropdown from '$components/version-selector/versions-dropdown.svelte';
    import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';
    import { Label } from '$components/ui/label';
    import { Switch } from '$components/ui/switch';
    import { Button } from '$components/ui/button';
    import { Plus } from 'lucide-svelte';
    import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card';
    import Minus from 'lucide-svelte/icons/minus';
    import { onMount } from 'svelte';

    export let parsedVersions: ParsedVersions;

    const versions = Object.keys(parsedVersions);
    const showSnapshots: Writable<boolean> = writable(false);

    const allSelectableVersions = derived([showSnapshots], ([$showSnapshots]) => {
        const selectableVersions: Record<string, number> = {};
        Object.entries(parsedVersions)
            .reverse()
            .forEach(([v, { isSnapshot, id }]) => {
                if ($showSnapshots || !isSnapshot) {
                    selectableVersions[v] = id;
                }
            });
        return selectableVersions;
    });

    type RangeComponent = {
        id: string;
        start: string;
        end: string;
    };

    const ranges: Writable<Map<string, RangeComponent>> = writable(new Map());

    export const selectedVersions = derived(ranges, ($ranges) => {
        const selectedVersions = Array.from($ranges.values())
            .map((range) => [range.start, range.end])
            .filter(([start, end]) => start && end)
            .reduce((acc, [start, end]) => {
                const sIdx = versions.indexOf(start);
                const eIdx = versions.indexOf(end);
                versions.slice(Math.min(sIdx, eIdx), Math.max(sIdx, eIdx) + 1).forEach((v) => acc.add(v));
                return acc;
            }, new Set<string>());
        return Array.from(selectedVersions).sort((a, b) => versions.indexOf(a) - versions.indexOf(b));
    });

    const addRange = () => {
        ranges.update((oldRanges) => {
            const newId = crypto.randomUUID();
            return new Map(oldRanges).set(newId, { id: newId, start: '', end: '' });
        });
    };

    const removeRange = (id: string) => {
        ranges.update((oldRanges) => {
            const newRanges = new Map(oldRanges);
            newRanges.delete(id);
            return newRanges;
        });
    };

    onMount(() => addRange());
</script>

<Card class="border-0">
    <CardHeader class="p-2">
        <div class="flex min-w-fit items-center gap-2">
            <Label for="show-snapshots">Show Snapshots</Label>
            <Switch bind:checked={$showSnapshots} class="" id="show-snapshots" />
        </div>
    </CardHeader>
    <CardContent class="flex flex-col gap-2 p-2 pt-0">
        {#each $ranges.entries() as [id, range], idx}
            <div class="flex gap-2">
                <VersionsDropdown
                    bind:value={range.start}
                    placeHolder="Starting Version"
                    versions={allSelectableVersions}
                />
                <VersionsDropdown bind:value={range.end} placeHolder="End Version" versions={allSelectableVersions} />
                {#if $ranges.size === 1}
                    <Button variant="outline" class="cursor-default hover:bg-background" on:click={() => {}}>
                        <span class="h-4 w-4"> &nbsp; </span>
                    </Button>
                {:else}
                    <Button
                        variant="outline"
                        class="hover:bg-destructive hover:text-destructive-foreground"
                        on:click={() => removeRange(id)}
                    >
                        <Minus class="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                {/if}
            </div>
        {/each}
        <Button on:click={addRange} variant="outline">
            <Plus class="h-4 w-4 shrink-0 opacity-50" />
        </Button>
    </CardContent>
</Card>
