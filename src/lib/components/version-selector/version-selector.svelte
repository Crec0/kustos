<script lang="ts">
    import { derived, type Writable, writable } from 'svelte/store';
    import VersionsDropdown from '$components/version-selector/versions-dropdown.svelte';
    import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';
    import { Label } from '$components/ui/label';
    import { Switch } from '$components/ui/switch';
    import { Button } from '$components/ui/button';
    import { Plus } from 'lucide-svelte';
    import { Card } from '$components/ui/card';
    import Minus from 'lucide-svelte/icons/minus';
    import { onMount } from 'svelte';

    export let startValue: string;
    export let endValue: string;

    export let versions: ParsedVersions;

    const versionsStore = writable(Object.entries(versions));
    const showSnapshots: Writable<boolean> = writable(false);

    const allSelectableVersions = derived([versionsStore, showSnapshots], ([oldAllVersions, oldShowSnapshots]) => {
        return oldAllVersions
            .filter(([_, vType]) => oldShowSnapshots || vType !== 2)
            .map(([version, _]) => version)
            .toReversed();
    });

    type RangeComponent = {
        id: string;
        start: string;
        end: string;
    };

    export let ranges: Writable<Map<string, RangeComponent>> = writable(new Map());

    const addRange = () => {
        ranges.update((oldRanges) => {
            const newId = crypto.randomUUID();
            console.log(newId);
            return new Map(oldRanges).set(newId, { id: newId, start: startValue, end: endValue });
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

<div class="flex gap-x-2">
    <Card class="flex grow flex-col justify-between gap-2 border-0 p-2 outline-0 ring-0">
        {#each $ranges.entries() as [id, range]}
            <div class="flex gap-2">
                <VersionsDropdown
                    bind:value={range.start}
                    placeHolder="Starting Version"
                    versions={allSelectableVersions}
                />
                <VersionsDropdown bind:value={range.end} placeHolder="End Version" versions={allSelectableVersions} />
                <Button on:click={addRange} variant="outline">
                    <Plus class="h-4 w-4 shrink-0 opacity-50" />
                </Button>
                {#if $ranges.size > 1}
                    <Button variant="outline" on:click={() => removeRange(id)}>
                        <Minus class="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                {/if}
            </div>
        {/each}
    </Card>
    <div class="flex min-w-fit items-center gap-2">
        <Label for="show-snapshots">Show Snapshots</Label>
        <Switch bind:checked={$showSnapshots} class="" id="show-snapshots" />
    </div>
</div>
