<script lang="ts">
    import type { PageData } from './$types';
    import { filesProxy, superForm } from 'sveltekit-superforms/client';
    import FileInput from '$components/FileInput.svelte';
    import { type Writable, writable } from 'svelte/store';
    import { type Channel, type Tag } from '$lib/schemas/discord-schema';
    import { postForm } from '$lib/schemas/post-form-schema';
    import { Button } from '$components/ui/form';
    import { safeAwait } from '$lib/utils/safeAwait';
    import VersionSelector from '$components/version-selector/version-selector.svelte';
    import { zod } from 'sveltekit-superforms/adapters';
    import { Card } from '$components/ui/card';
    import { CardContent, CardHeader, CardTitle } from '$components/ui/card/index.js';

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
    class="mx-4 flex w-[75%] flex-col gap-2 rounded-lg p-2 md:p-6"
    enctype="multipart/form-data"
    method="POST"
    on:formdata={manuallyAddFiles}
    use:enhance
>
    <Card class="w-max p-2">
        <CardHeader class="px-0 py-2">
            <CardTitle class="pl-2">Version</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
            <VersionSelector bind:selectedVersions={$form.version} parsedVersions={data.versions} />
        </CardContent>
    </Card>

    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-na`me"> Name </label>
        <input
            bind:value={$form.name}
            class="variant-ringed-primary w-full rounded px-3 py-2"
            id="name"
            name="name"
            type="text"
        />
    </div>

    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-credits"> Credits </label>
        <textarea
            bind:value={$form.credits}
            class="variant-ringed-primary w-full rounded px-3 py-2"
            id="credits"
            name="credits"
        />
    </div>

    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-description"> Description </label>
        <textarea
            bind:value={$form.description}
            class="variant-ringed-primary w-full rounded px-3 py-2"
            id="description"
            name="description"
            rows="10"
        />
    </div>

    <FileInput accept=".litematic" body="Add litematic(s)" files={schemProxy} name="schematic" />
    <FileInput accept=".png,.jpg,.jpeg,.webp" body="Add image(s)" files={imgProxy} isImage name="image" />

    <Button type="submit">Submit</Button>
</form>
