<script lang="ts">
    import { derived, type Writable, writable } from 'svelte/store';

    export let versionsStore: Writable<[string, 0 | 2 | 1][]>;
    export let showSnapshots: boolean;
    export let showMinors: boolean;
    export let css: string;

    const startVersion = writable('');
    const endVersion = writable('');

    const endingVersions = derived([versionsStore, startVersion], ([_versionsStore, _startVersion]) => {
        if (_startVersion == undefined || _startVersion === '') {
            return $versionsStore;
        }
        const startIndex = $versionsStore.findIndex(([v, _]) => _startVersion === v);
        return $versionsStore.slice(Math.max(0, startIndex));
    });

    startVersion.subscribe(() => {
        $endVersion = '';
    });
</script>

<div class="flex items-baseline {css}">
    <span class="text-xl font-medium">(</span>
    <div>
        <select id="start-version" class="ml-1 w-32 rounded py-1" bind:value={$startVersion}>
            <option value="">-</option>
            {#each $versionsStore as [version, versionType]}
                {#if (showSnapshots || versionType !== 2) && (showMinors || versionType === 0)}
                    <option value={version}>{version}</option>
                {/if}
            {/each}
        </select>
    </div>
    <span>,</span>
    <div>
        <select id="end-version" class="ml-1 w-32 rounded py-1" bind:value={$endVersion}>
            <option value="">-</option>
            {#each $endingVersions as [version, versionType]}
                {#if (showSnapshots || versionType !== 2) && (showMinors || versionType === 0)}
                    <option value={version}>{version}</option>
                {/if}
            {/each}
        </select>
    </div>
    <span class="text-xl font-medium">)</span>
</div>
