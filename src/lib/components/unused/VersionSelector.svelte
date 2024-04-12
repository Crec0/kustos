<script lang="ts">
    import { writable } from 'svelte/store';
    import VersionSubSelector from '$components/unused/VersionSubSelector.svelte';
    import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';
    import { Button } from '$components/ui/button';

    export let value: string;

    export let versions: ParsedVersions;
    const versionsStore = writable(Object.entries(versions));
    const showSnapshots = writable(false);
    const showMinors = writable(false);
</script>

<div class="flex gap-x-2">
    <div class="flex-grow space-y-1">
        <VersionSubSelector showSnapshots={$showSnapshots} showMinors={$showMinors} {versionsStore} bind:value />
    </div>
    <div>
        <div class="flex items-center text-sm">
            <input type="checkbox" id="show-minors" bind:checked={$showMinors} />
            <label for="show-minors" class="ml-2"> Show minor versions </label>
        </div>
        <div class="flex items-center text-sm">
            <input type="checkbox" id="show-snapshots" bind:checked={$showSnapshots} />
            <label for="show-snapshots" class="ml-2"> Show snapshots </label>
        </div>
    </div>
</div>
