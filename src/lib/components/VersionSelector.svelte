<script lang="ts">
    import { writable } from 'svelte/store';
    import VersionSubSelector from '$components/VersionSubSelector.svelte';
    import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';

    export let versions: ParsedVersions;
    const versionsStore = writable(Object.entries(versions));
    const showSnapshots = writable(false);
    const showMinors = writable(false);
</script>

<div class="grid grid-cols-2 grid-rows-2">
    <VersionSubSelector css="col-span-2" showSnapshots={$showSnapshots} showMinors={$showMinors} {versionsStore} />
    <div class="mx-2 flex items-center">
        <input type="checkbox" id="show-minors" bind:checked={$showMinors} />
        <label for="show-minors" class="ml-2"> Show Minor Versions </label>
    </div>
    <div class="mx-2 flex items-center">
        <input type="checkbox" id="show-snapshots" bind:checked={$showSnapshots} />
        <label for="show-snapshots" class="ml-2"> Show snapshots </label>
    </div>
</div>
