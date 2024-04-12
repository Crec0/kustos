<script lang="ts">
    import type { PageData } from './$types';
    import { filesProxy, superForm } from 'sveltekit-superforms/client';
    import { InfoIcon } from 'lucide-svelte';
    import FileInput from '$components/FileInput.svelte';
    import { type Writable, writable } from 'svelte/store';
    import { type Channel, type Tag } from '$lib/schemas/discord-schema';
    import { postForm } from '$lib/schemas/post-form-schema';
    import { Tooltip, TooltipContent, TooltipTrigger } from '$components/ui/tooltip';
    import InfoDropdown from '$components/InfoDropdown.svelte';
    import { Button } from '$components/ui/form';
    import { safeAwait } from '$lib/utils/safeAwait';
    import SelectionDrawer from '$components/unused/VersionSelector.svelte';
    import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
    import { zod } from 'sveltekit-superforms/adapters';

    export let data: PageData;

    const channels = writable<Channel[]>([]);
    const selectedGuild = writable<string | null>(null);
    const availableTags = writable<Tag[]>([]);
    const selectedTagIds = writable<string[]>([]);

    const { form, enhance } = superForm(data.form, {
        validators: zod(postForm),
        resetForm: false,
    });

    const schemProxy = filesProxy(form, 'schematic');
    const imgProxy = filesProxy(form, 'image');

    selectedTagIds.subscribe((val) => {
        $form.tag = val;
    });

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
        $form.guild = selectedGuildID;
        await hydrateStoreFromApi(channels, `/api/discord/${selectedGuildID}/forums`);
    };

    const onChannelSelection = async (e: Event) => {
        const selectedChannelID = getSelectedItem(e.target);
        if (selectedChannelID == null) return;

        $form.channel = selectedChannelID;
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
            cl?.remove('ring-1', 'ring-primary-500', 'text-primary-500');
        }

        if (elem.checked && $selectedTagIds.length < 5) {
            $selectedTagIds.push(elem.value);
            const cl = elem.nextElementSibling?.classList;
            cl?.add('ring-1', 'ring-primary-500', 'text-primary-500');
        } else {
            elem.checked = false;
        }

        $selectedTagIds = $selectedTagIds;
    };

    let manuallyAddFiles = (e: FormDataEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
        e.formData.delete('image');
        for (const img of $imgProxy) {
            e.formData.append('image', img);
        }
        e.formData.delete('schematic');
        for (const file of $schemProxy) {
            e.formData.append('schematic', file);
        }
    };
</script>

<form
    class="bg-surface-100-800-token mx-4 flex w-[60%] flex-col gap-2 rounded-lg p-2 md:p-6"
    method="POST"
    enctype="multipart/form-data"
    use:enhance
    on:formdata={manuallyAddFiles}
>
    <SuperDebug data={form} />
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
            <TooltipContent class="bg-surface-100-800-token border-primary-500">
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
            <TooltipContent class="bg-surface-100-800-token border-primary-500">
                <div class="font-bold">Not seeing your desired channel listed here?</div>
                Make sure the channel is a forum channel<br />
                Other channel types are not supported.
            </TooltipContent>
        </Tooltip>
    </InfoDropdown>

    <div class="grid w-full grid-cols-[100px_minmax(0,_1fr)] items-center gap-2 rounded-lg">
        <span>Tags</span>

        {#if $availableTags.length === 0}
            <div class="placeholder variant-ghost-primary w-full animate-pulse px-2 py-5" />
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
                    <label for="tag-{tag.id}" class="bg-surface-300-600-token select-none rounded p-2">
                        {tag.name}
                    </label>
                {/each}
            </div>
        {/if}
    </div>

    <div class="grid w-full grid-cols-[100px_minmax(0,_1fr)] items-center gap-2 rounded-lg">
        <span>Version</span>
        <SelectionDrawer versions={data.versions} bind:value={$form.version} />
    </div>

    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-na`me"> Name </label>
        <input
            class="variant-ringed-primary w-full rounded px-3 py-2"
            id="name"
            name="name"
            type="text"
            bind:value={$form.name}
        />
    </div>

    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-credits"> Credits </label>
        <textarea
            class="variant-ringed-primary w-full rounded px-3 py-2"
            id="credits"
            name="credits"
            bind:value={$form.credits}
        />
    </div>

    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-description"> Description </label>
        <textarea
            class="variant-ringed-primary w-full rounded px-3 py-2"
            id="description"
            name="description"
            rows="10"
            bind:value={$form.description}
        />
    </div>

    <FileInput accept=".litematic" body="Add litematic(s)" files={schemProxy} name="schematic" />
    <FileInput accept=".png,.jpg,.jpeg,.webp" body="Add image(s)" files={imgProxy} isImage name="image" />

    <Button type="submit">Submit</Button>
</form>
