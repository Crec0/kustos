<script lang="ts">
    import { derived, readable, writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { FileDropzone, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { XIcon, InfoIcon } from 'lucide-svelte';
    import FileInput from '$components/FileInput.svelte';

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
            elem.nextElementSibling?.classList.remove('variant-filled-secondary');
            elem.nextElementSibling?.classList.add('variant-filled-primary');
        }

        if (elem.checked) {
            $selectedTagIds.push(elem.value);
            elem.nextElementSibling?.classList.add('variant-filled-secondary');
            elem.nextElementSibling?.classList.remove('variant-filled-primary');
        }
    }

    const modalStore = getModalStore();

    const modal: ModalSettings = {
        type: 'alert',
        title: 'Dont see your guild listed?',
        body: 'Make sure your guild has the bot as well as is whitelisted.',
    };
</script>

<div class="my-20">
    <div class="bg-primary-900 p-2 md:p-6 rounded-lg w-[48rem] mx-4">
        <div class="flex flex-col md:flex-row">
            <div class="flex items-center rounded-lg px-3 py-2">
                <label class="mr-2 grow font-semibold" for="guild-select">Guild:</label>
                <select
                    class="rounded variant-filled-primary px-3 py-2"
                    id="guild-select"
                    on:change={onGuildSelection}
                >
                    <option disabled hidden selected value="">Select Guild</option>
                    {#each $guilds as guild, idx (idx)}
                        <option value={guild.id}>
                            {guild.name}
                        </option>
                    {/each}
                </select>
                <!--Info Popup -->
                <button
                    class="ml-2"
                    on:click={(e) => {
                        modalStore.trigger(modal);
                    }}
                    tabindex="0"
                >
                    <InfoIcon size={24} strokeWidth={2} />
                </button>
            </div>
            <div class="md:ml-2 flex items-center rounded-lg px-3 py-2">
                <label class="mr-2 grow font-semibold" for="guild-select">Channel:</label>
                <select
                    class="rounded variant-filled-primary px-3 py-2"
                    id="guild-select"
                    on:change={onChannelSelection}
                >
                    <option disabled hidden selected value="">Select Channel</option>
                    {#each $channels as channel, idx (idx)}
                        <option value={channel.id}>
                            {channel.name}
                        </option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="mt-2 flex w-full items-center rounded-lg bg-primary px-3 py-2">
            <label class="mr-2 font-semibold" for="guild-select">Tags:</label>

            {#if $availableTags.length === 0}
                <div class="placeholder w-full animate-pulse variant-filled-primary p-6" />
            {/if}

            <div class="flex flex-wrap w-full">
                {#each $availableTags as tag, idx (idx)}
                    <input
                        class="hidden"
                        id="tag-{tag.id}"
                        type="checkbox"
                        value={tag.id}
                        on:change={onTagSelect}
                    />
                    <label for="tag-{tag.id}" class="m-1 rounded variant-filled-primary p-2">
                        {tag.name}
                    </label>
                {/each}
            </div>
        </div>
    </div>

    <div class="mt-2 bg-primary-900 p-2 md:p-6 rounded-lg w-[48rem] mx-4">
        <div class="flex flex-col gap-2 rounded-lg bg-primary px-3 py-2">
            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-name"> Name </label>
                <input
                    class="w-full rounded variant-filled-primary px-3 py-2"
                    id="archive-name"
                    type="text"
                />
            </div>

            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-credits">
                    Credits
                </label>
                <input
                    class="w-full rounded variant-filled-primary px-3 py-2"
                    id="archive-name"
                    type="text"
                />
            </div>

            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-name"> Version </label>
                <input
                    class="w-full rounded variant-filled-primary px-3 py-2"
                    id="archive-name"
                    type="text"
                />
            </div>

            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-description">
                    Description
                </label>
                <textarea
                    class="w-full rounded variant-filled-primary px-3 py-2"
                    id="archive-description"
                    rows="10"
                />
            </div>

            <FileInput accept=".png,.jpg,.jpeg,.webp" />
            <FileInput accept=".litematic" />
        </div>
    </div>
</div>
