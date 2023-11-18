<script lang="ts">
    import { readable, writable } from 'svelte/store';
    import { onMount } from 'svelte';

    type NameIdObject = {
        name: string;
        id: string;
    };

    const channels = writable<NameIdObject[]>([]);
    const selectedGuild = writable<string>(null);
    const availableTags = writable<NameIdObject[]>([]);

    const guilds = readable<NameIdObject[]>([], (set) =>
        onMount(() => {
            fetch('/api/discord/guilds')
                .then((response) => {
                    if (response.ok) {
                        response.json().then((res) => set(res));
                    } else {
                        console.error('fuk');
                    }
                })
                .catch((err) =>
                    console.error('Failed to fetch guilds from the server. Please try again.', err),
                );
        }),
    );

    function getSelectedItem(targetElem: HTMLElement | null) {
        if (targetElem == null || !(targetElem instanceof HTMLSelectElement)) {
            return null;
        }

        return targetElem.selectedOptions.item(0)?.value;
    }

    function onGuildSelection(e: Event) {
        const selectedGuildID = getSelectedItem(e.target);
        if (selectedGuildID == null) {
            return;
        }

        $selectedGuild = selectedGuildID;

        fetch(`/api/discord/${selectedGuildID}/forums`)
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => channels.set(res));
                } else {
                    console.error('fuk');
                }
            })
            .catch((err) =>
                console.error('Failed to fetch channels from the server. Please try again.', err),
            );
    }

    function onChannelSelection(e: Event) {
        const selectedChannelID = getSelectedItem(e.target);
        if (selectedChannelID == null) {
            return;
        }

        fetch(`/api/discord/${$selectedGuild}/${selectedChannelID}/tags`)
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => availableTags.set(res));
                } else {
                    console.error('fuk');
                }
            })
            .catch((err) =>
                console.error('Failed to fetch tags from the server. Please try again.', err),
            );
    }
</script>

<form></form>
<div class="flex">
    <div class="flex items-center rounded-lg bg-gray-700 px-3 py-2 text-2xl">
        <label class="text-content mr-2 grow" for="guild-select">Guild:</label>
        <select
            class="text-content rounded bg-accent px-3 py-2 text-lg font-semibold"
            id="guild-select"
            on:change={(e) => onGuildSelection(e)}
        >
            <option disabled hidden selected value="">Select Guild</option>
            {#each $guilds as guild, idx (idx)}
                <option class="text-xl" value={guild.id}>
                    {guild.name}
                </option>
            {/each}
        </select>
    </div>
    <div class="ml-2 flex items-center rounded-lg bg-gray-700 px-3 py-2 text-2xl">
        <label class="text-content mr-2 grow" for="guild-select">Channel:</label>
        <select
            class="text-content rounded bg-accent px-3 py-2 text-lg font-semibold"
            id="guild-select"
            on:change={(e) => onChannelSelection(e)}
        >
            <option disabled hidden selected value="">Select Channel</option>
            {#each $channels as channel, idx (idx)}
                <option class="text-xl" value={channel.id}>
                    {channel.name}
                </option>
            {/each}
        </select>
    </div>
</div>
<div class="mt-2 flex w-max items-center rounded-lg bg-gray-700 px-3 py-2 text-2xl">
    <label class="text-content mr-2 grow" for="guild-select">Tags:</label>

    {#each $availableTags as tag, idx (idx)}
        <input class="hidden" id="tag-{tag.id}" type="checkbox" />
        <label for="tag-{tag.id}" class="m-2 rounded bg-accent p-2 text-xl">{tag.name}</label>
    {/each}
</div>
