<script lang="ts">
    import { type Readable, readable, writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { InfoIcon } from 'lucide-svelte';
    import FileInput from '$components/FileInput.svelte';

    type NameIdObject = {
        name: string;
        id: string;
    };

    const channels = writable<NameIdObject[]>([]);
    const selectedGuild = writable<string | null>(null);
    const availableTags = writable<NameIdObject[]>([]);
    const selectedTagIds = writable<string[]>([]);

    let images: Readable<Map<string, File>>;
    let schematics: Readable<Map<string, File>>;

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

    const getSelectedItem = (targetElem: EventTarget | null) => {
        if (targetElem == null || !(targetElem instanceof HTMLSelectElement)) {
            return null;
        }

        return targetElem.selectedOptions.item(0)?.value;
    };

    const onGuildSelection = (e: Event) => {
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
    };

    const onChannelSelection = (e: Event) => {
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
    };

    const onTagSelect = (e: Event) => {
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

        if (elem.checked && $selectedTagIds.length < 5) {
            $selectedTagIds.push(elem.value);
            elem.nextElementSibling?.classList.add('variant-filled-secondary');
            elem.nextElementSibling?.classList.remove('variant-filled-primary');
        } else {
            elem.checked = false;
        }
    };

    const getOrThrow = (id: string, message: string) => {
        const elem = document.getElementById(id);
        if (elem && 'value' in elem && typeof elem.value == 'string' && elem.value.length > 0) {
            return elem.value;
        }
        throw Error(message);
    };

    const sendErrorToast = (msg: string) => {
        getToastStore().trigger({
            message: msg,
            classes: 'variant-filled-error font-bold',
            timeout: 10000,
        });
    };

    const onSendClick = async (_: MouseEvent) => {
        try {
            const formData = new FormData();
            formData.append('guild', getOrThrow('guild-select', 'A guild must be selected'));
            formData.append('channel', getOrThrow('channel-select', 'A channel must be selected'));

            if ($selectedTagIds.length === 0) {
                sendErrorToast('At least 1 tag must be selected.');
                return;
            }

            for (const tag of $selectedTagIds.values()) {
                formData.append('tag', tag);
            }

            formData.append('name', getOrThrow('archive-name', 'Name field is required'));
            formData.append('credits', getOrThrow('archive-credits', 'Credits field is required'));
            formData.append('version', getOrThrow('archive-version', 'Version field is required'));
            formData.append(
                'description',
                getOrThrow('archive-description', 'Description is required'),
            );

            if ($images.size === 0) {
                sendErrorToast('Please upload an image.');
                return;
            }
            for (const img of $images.values()) {
                formData.append('image', img, img.name);
            }

            if ($schematics.size === 0) {
                sendErrorToast('Please upload schematics.');
                return;
            }
            for (const schem of $schematics.values()) {
                formData.append('schematic', schem, schem.name);
            }

            await fetch('/api/post/upload', { method: 'POST', body: formData });
        } catch (e) {
            if (!(e instanceof Error)) return;
            sendErrorToast(e.message);
        }
    };

    const modalStore = getModalStore();
    const modal: ModalSettings = {
        type: 'alert',
        title: 'Dont see your guild listed?',
        body: 'Make sure your guild has the bot as well as is whitelisted.',
    };
</script>

<div>
    <div class="mx-4 w-[48rem] rounded-lg bg-primary-900 p-2 md:p-6">
        <div class="flex flex-col md:flex-row">
            <div class="flex items-center rounded-lg px-3 py-2">
                <label class="mr-2 grow font-semibold" for="guild-select">Guild:</label>
                <select
                    class="variant-filled-primary cursor-pointer rounded px-3 py-2"
                    id="guild-select"
                    on:change={onGuildSelection}
                    required
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
            <div class="flex items-center rounded-lg px-3 py-2 md:ml-2">
                <label class="mr-2 grow font-semibold" for="channel-select">Channel:</label>
                <select
                    class="variant-filled-primary rounded px-3 py-2"
                    id="channel-select"
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

        <div class="bg-primary mt-2 flex w-full items-center rounded-lg px-3 py-2">
            <span class="mr-2 font-semibold">Tags:</span>

            {#if $availableTags.length === 0}
                <div class="placeholder variant-filled-primary w-full animate-pulse p-6" />
            {/if}

            <div class="flex w-full flex-wrap">
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
                        class="variant-filled-primary m-1 select-none rounded p-2"
                    >
                        {tag.name}
                    </label>
                {/each}
            </div>
        </div>
    </div>

    <div
        class="mx-4 mt-2 w-[48rem] rounded-lg bg-primary-900 p-2 selection:bg-primary-50-900-token md:p-6"
    >
        <div class="bg-primary flex flex-col gap-2 rounded-lg px-3 py-2">
            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-na`me"> Name </label>
                <input
                    class="variant-filled-primary w-full rounded px-3 py-2"
                    id="archive-name"
                    type="text"
                />
            </div>

            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-credits">
                    Credits
                </label>
                <textarea
                    class="variant-filled-primary w-full rounded px-3 py-2"
                    id="archive-credits"
                />
            </div>

            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-version">
                    Version
                </label>
                <input
                    class="variant-filled-primary w-full rounded px-3 py-2"
                    id="archive-version"
                    type="text"
                />
            </div>

            <div class="relative mt-9">
                <label class="text-md absolute -translate-y-7" for="archive-description">
                    Description
                </label>
                <textarea
                    class="variant-filled-primary w-full rounded px-3 py-2"
                    id="archive-description"
                    rows="10"
                />
            </div>

            <FileInput
                accept=".png,.jpg,.jpeg,.webp"
                bind:fileStore={images}
                body="Add image(s)"
                isImage={true}
            />
            <FileInput accept=".litematic" bind:fileStore={schematics} body="Add litematic(s)" />
            <button
                class="variant-filled-secondary mt-10 rounded py-4 font-bold transition duration-100 hover:variant-soft-secondary"
                on:click={onSendClick}
            >
                Upload
            </button>
        </div>
    </div>
</div>
