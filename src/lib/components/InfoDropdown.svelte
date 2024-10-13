<script lang="ts">
    import type { NameIdObject } from '$lib/zod/discord';

    export let title: string;
    export let id: string;
    export let name: string = id;
    export let required: boolean;
    export let message: string;
    export let disabled: boolean = false;
    export let items: NameIdObject[];
</script>

<span class="grid grid-cols-[100px_minmax(0,_1fr)_32px] items-center gap-2 rounded-lg">
    <label class="font-semibold" for="guild-select">{title}</label>
    <select class="grow cursor-pointer rounded px-3 py-2" {id} {name} on:change {required} {disabled}>
        <option disabled hidden selected value="">{message}</option>
        {#each items as entity, idx (idx)}
            <option value={entity.id}>
                {entity.name}
            </option>
        {/each}
    </select>
    <slot />
</span>
