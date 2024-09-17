<script lang="ts">
    import type { PageData } from './$types';
    import { filesProxy, superForm } from 'sveltekit-superforms/client';
    import FileInput from '$components/FileInput.svelte';
    import { type Readable, type Writable, writable } from 'svelte/store';
    import { postForm } from '$lib/schemas/post-form-schema';
    import { Button } from '$components/ui/form';
    import VersionSelector from '$components/version-selector/version-selector.svelte';
    import { zod } from 'sveltekit-superforms/adapters';
    import { Card } from '$components/ui/card';
    import { CardContent, CardHeader, CardTitle } from '$components/ui/card/index.js';
    import MarkdownEditor from './(components)/MarkdownEditor.svelte';

    export let data: PageData;

    const { form, enhance } = superForm(data.form, {
        validators: zod(postForm),
        resetForm: false,
    });

    let processedRanges: Readable<number[][]>;
    const schemProxy = filesProxy(form, 'schematic');
    const imgProxy = filesProxy(form, 'image');

    let manuallyAddFiles = (e: FormDataEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
        e.formData.delete('image');
        for (const img of $imgProxy) {
            e.formData.append('image', img);
        }
        e.formData.delete('schematic');
        for (const file of $schemProxy) {
            e.formData.append('schematic', file);
        }
        e.formData.delete('versions');
        for (const version of $processedRanges) {
            e.formData.append('versions', version[0].toString());
            e.formData.append('versions', version[1].toString());
        }
    };
</script>

<form
    class="mx-4 flex w-full max-w-[60%] flex-col gap-2 rounded-lg p-2 md:p-6"
    enctype="multipart/form-data"
    method="POST"
    on:formdata={manuallyAddFiles}
    use:enhance
>
    <div class="relative mt-9">
        <label class="text-md absolute -translate-y-7" for="archive-description"> Description </label>
        <MarkdownEditor />
    </div>

    <Card class="w-max p-2">
        <CardHeader class="px-0 py-2">
            <CardTitle class="pl-2">Version</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
            <VersionSelector bind:processedRanges parsedVersions={data.versions} />
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

        <FileInput accept=".litematic" body="Add litematic(s)" files={schemProxy} name="schematic" />
        <FileInput accept=".png,.jpg,.jpeg,.webp" body="Add image(s)" files={imgProxy} isImage name="image" />

    <Button type="submit">Submit</Button>
</form>
