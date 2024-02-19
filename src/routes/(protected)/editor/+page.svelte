<script lang="ts">
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import { InfoIcon } from 'lucide-svelte';
    import FileInput from '$components/FileInput.svelte';
    import { type Writable, writable } from 'svelte/store';
    import { type Channel, type Tag } from '$lib/schemas/discord-schema';
    import { postForm } from '$lib/schemas/post-form-schema';
    import { Tooltip, TooltipContent, TooltipTrigger } from '$components/ui/tooltip';
    import InfoDropdown from '$components/InfoDropdown.svelte';
    import { Form } from '$components/ui/form';
    import { safeAwait } from '$lib/utils/safeAwait';
    import SelectionDrawer from '$components/VersionSelector.svelte';

    export let data: PageData;

    const { form } = superForm(data.form);

    const channels = writable<Channel[]>([]);
    const selectedGuild = writable<string | null>(null);
    const availableTags = writable<Tag[]>([]);
    const selectedTagIds = writable<string[]>([]);

    const getSelectedItem = (targetElem: EventTarget | null) => {
        if (targetElem == null || !(targetElem instanceof HTMLSelectElement)) {
            return null;
        }
        return targetElem.selectedOptions.item(0)?.value;
    };

    const hydrateStoreFromApi = async (store: Writable<any>, url: string) => {
        const forumsRes = await safeAwait(fetch(url));
        if (!forumsRes.success) {
            console.error(`Failed to fetch ${url} from api`, forumsRes.error);
            return;
        }

        const forumJsonRes = await safeAwait(forumsRes.value.json());
        if (forumJsonRes.success) {
            store.set(forumJsonRes.value);
        } else {
            console.error(`Failed to parse response json for ${url}`, forumJsonRes.error);
        }
    };

    const onGuildSelection = async (e: Event) => {
        const selectedGuildID = getSelectedItem(e.target);
        if (selectedGuildID == null) return;

        $selectedGuild = selectedGuildID;
        await hydrateStoreFromApi(channels, `/api/discord/${selectedGuildID}/forums`);
    };

    const onChannelSelection = async (e: Event) => {
        const selectedChannelID = getSelectedItem(e.target);
        if (selectedChannelID == null) return;

        await hydrateStoreFromApi(availableTags, `/api/discord/${$selectedGuild}/${selectedChannelID}/tags`);
    };

    const onTagSelect = (e: Event) => {
        const elem = e.target;
        if (elem == null || !(elem instanceof HTMLInputElement)) {
            return null;
        }

        const idx = $selectedTagIds.indexOf(elem.value);
        if (idx > -1) {
            $selectedTagIds.splice(idx, 1);
            const cl = elem.nextElementSibling?.classList;
            cl?.replace('bg-primary-800-100-token', 'bg-primary-100-800-token');
            cl?.replace('text-primary-200-700-token', 'text-primary-700-200-token');
        }

        if (elem.checked && $selectedTagIds.length < 5) {
            $selectedTagIds.push(elem.value);
            const cl = elem.nextElementSibling?.classList;
            cl?.replace('bg-primary-100-800-token', 'bg-primary-800-100-token');
            cl?.replace('text-primary-700-200-token', 'text-primary-200-700-token');
        } else {
            elem.checked = false;
        }
    };
</script>

<Form
    class="mx-4 flex w-[48rem] flex-col gap-2 rounded-lg bg-primary-900 p-2 md:p-6"
    form={data.form}
    let:config
    method="POST"
    schema={postForm}
>
    <InfoDropdown
        id="guild"
        items={data.guilds}
        message="Select guild"
        on:change={onGuildSelection}
        required
        title="Guild"
    >
        <Tooltip>
            <TooltipTrigger>
                <InfoIcon size={24} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>
                <div class="font-bold">Not seeing your guild listed here?</div>
                Make sure your guild has the bot as well as is whitelisted.<br />
                You can invite the bot using "THIS_LINK"
            </TooltipContent>
        </Tooltip>
    </InfoDropdown>
    <InfoDropdown
        disabled={$channels.length === 0}
        id="channel"
        items={$channels}
        message="Select channel"
        on:change={onChannelSelection}
        required
        title="Channel"
    >
        <Tooltip>
            <TooltipTrigger>
                <InfoIcon size={24} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>
                <div class="font-bold">Not seeing your desired channel listed here?</div>
                Make sure the channel is a forum channel<br />
                Other channel types are not supported.
            </TooltipContent>
        </Tooltip>
    </InfoDropdown>

    <div class="grid w-full grid-cols-[100px_minmax(0,_1fr)] items-center gap-2 rounded-lg font-semibold">
        <span>Tags</span>

        {#if $availableTags.length === 0}
            <div class="placeholder variant-filled-primary w-full animate-pulse px-2 py-5" />
        {:else}
            <div class="flex w-full flex-wrap gap-1">
                {#each $availableTags as tag, idx (idx)}
                    <input
                        class="hidden"
                        id="tag-{tag.id}"
                        name="tag"
                        type="checkbox"
                        value={tag.id}
                        on:change={onTagSelect}
                    />
                    <label
                        for="tag-{tag.id}"
                        class="bg-primary-100-800-token text-primary-700-200-token select-none rounded p-2"
                    >
                        {tag.name}
                    </label>
                {/each}
            </div>
        {/if}
    </div>

    <div class="grid w-full grid-cols-[100px_minmax(0,_1fr)] items-center gap-2 rounded-lg font-semibold">
        <span>Version Compatibility</span>
        <SelectionDrawer versions={data.versions} />
    </div>

    <FileInput accept=".litematic" body="Add litematic(s)" files={$form.schematic} name="schematic" />
    <FileInput accept=".png,.jpg,.jpeg,.webp" body="Add image(s)" files={$form.image} isImage name="image" />
</Form>
