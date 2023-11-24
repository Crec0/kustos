<script lang="ts">
    import { readable, writable } from 'svelte/store';
    import { onMount } from 'svelte';

    type NameIdObject = {
        name: string;
        id: string;
    };

    const channels = writable<NameIdObject[]>([]);
    const selectedGuild = writable<string | null>(null);
    const availableTags = writable<NameIdObject[]>([]);
    const selectedTagIds = writable<string[]>([]);

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

    function getSelectedItem(targetElem: EventTarget | null) {
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

    function onTagSelect(e: Event) {
        const elem = e.target;
        if (elem == null || !(elem instanceof HTMLInputElement)) {
            return null;
        }

        const idx = $selectedTagIds.indexOf(elem.value);
        if (idx > -1) {
            $selectedTagIds.splice(idx, 1);
            elem.nextElementSibling?.classList.remove('bg-secondary', 'text-content-secondary');
            elem.nextElementSibling?.classList.add('bg-accent', 'text-content');
        }

        if (elem.checked) {
            $selectedTagIds.push(elem.value);
            elem.nextElementSibling?.classList.remove('bg-accent', 'text-content');
            elem.nextElementSibling?.classList.add('bg-secondary', 'text-content-secondary');
        }
    }
</script>

<div>
    <div class="flex">
        <div class="flex items-center rounded-lg bg-primary px-3 py-2 text-2xl">
            <label class="mr-2 grow text-content" for="guild-select">Guild:</label>
            <select
                class="rounded bg-secondary px-3 py-2 text-lg font-semibold text-content-secondary"
                id="guild-select"
                on:change={onGuildSelection}
            >
                <option disabled hidden selected value="">Select Guild</option>
                {#each $guilds as guild, idx (idx)}
                    <option class="text-xl font-semibold" value={guild.id}>
                        {guild.name}
                    </option>
                {/each}
            </select>
        </div>
        <div
            class="ml-2 flex items-center rounded-lg bg-primary px-3 py-2 text-2xl text-content-secondary"
        >
            <label class="mr-2 grow text-content" for="guild-select">Channel:</label>
            <select
                class="rounded bg-secondary px-3 py-2 text-lg font-semibold text-content-secondary"
                id="guild-select"
                on:change={onChannelSelection}
            >
                <option disabled hidden selected value="">Select Channel</option>
                {#each $channels as channel, idx (idx)}
                    <option class="text-xl font-semibold" value={channel.id}>
                        {channel.name}
                    </option>
                {/each}
            </select>
        </div>
    </div>
    <div class="mt-2 flex w-max items-center rounded-lg bg-primary px-3 py-2 text-2xl">
        <label class="mr-2 grow text-content" for="guild-select">Tags:</label>

        {#each $availableTags as tag, idx (idx)}
            <input
                class="hidden"
                id="tag-{tag.id}"
                type="checkbox"
                value={tag.id}
                on:change={onTagSelect}
            />
            <label
                for="tag-{tag.id}"
                class="m-2 rounded bg-accent p-2 text-xl font-semibold text-content"
                >{tag.name}</label
            >
        {/each}
    </div>

    <div class="flex gap-2">
        <div class="mt-2 flex w-1/2 flex-col gap-2 rounded-lg bg-primary px-3 py-2 text-2xl">
            <div class="relative mt-9">
                <label for="archive-name" class="text-md absolute -translate-y-7 text-lg"
                    >Name</label
                >
                <input
                    id="archive-name"
                    type="text"
                    class="w-full rounded bg-accent px-3 py-2 text-2xl"
                />
            </div>

            <div class="relative mt-9">
                <label for="archive-credits" class="text-md absolute -translate-y-7 text-lg"
                    >Credits</label
                >
                <input
                    id="archive-name"
                    type="text"
                    class="w-full rounded bg-accent px-3 py-2 text-2xl"
                />
            </div>

            <div class="relative mt-9">
                <label for="archive-description" class="text-md absolute -translate-y-7 text-lg"
                    >Description</label
                >
                <textarea
                    id="archive-description"
                    class="w-full rounded bg-accent px-3 py-2 text-2xl"
                />
            </div>

            <div>
                <label for="archive-files">Files:</label>
                <input id="archive-files" type="file" />
            </div>
        </div>

        <div class="mt-2 flex w-1/2 flex-col gap-2 rounded-lg bg-primary px-3 py-2 text-2xl">
            <div class=""> </div>
        </div>
    </div>
</div>
