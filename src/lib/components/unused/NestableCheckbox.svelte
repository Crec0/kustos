<script lang="ts">
    import { derived, readable, writable } from 'svelte/store';
    import { Checkbox } from '$components/ui/checkbox';
    import { Label } from '$components/ui/label';

    export let label = 'Accept terms and conditions';

    export let parentState = readable(false);
    export let selfState = writable(false);

    parentState.subscribe((value) => selfState.set(value));

    const derivedState = derived([parentState, selfState], ([parent, state]) => {
        const isChecked = parent || state;
        selfState.set(isChecked);
        return isChecked;
    });
</script>

<div class="space-y-2">
    <div class="flex items-center space-x-2">
        <Checkbox id={label} bind:checked={$selfState} aria-labelledby="{label}-label" />
        <Label
            id="{label}-label"
            for={label}
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {label}
        </Label>
    </div>
    <div class="ml-4">
        <slot state={derivedState} />
    </div>
</div>
