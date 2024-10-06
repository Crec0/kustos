<script lang='ts'>
    import type { PageData } from './$types';
    import {
        filesProxy,
        superForm,
    } from 'sveltekit-superforms/client';
    import FileInput from '$components/FileInput.svelte';
    import { type Readable } from 'svelte/store';
    import { postForm } from '$lib/schemas/post-form-schema';
    import { Button } from '$components/ui/form';
    import VersionSelector from '$components/version-selector/version-selector.svelte';
    import { zod } from 'sveltekit-superforms/adapters';
    import { Card } from '$components/ui/card';
    import {
        CardContent,
        CardFooter,
    } from '$components/ui/card/index.js';
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
        for ( const img of $imgProxy ) {
            e.formData.append('image', img);
        }
        e.formData.delete('schematic');
        for ( const file of $schemProxy ) {
            e.formData.append('schematic', file);
        }
        e.formData.delete('versions');
        for ( const version of $processedRanges ) {
            e.formData.append('versions', version[0].toString());
            e.formData.append('versions', version[1].toString());
        }
    };
</script>

<form
    class='mx-4 flex w-full max-w-[60%] flex-col gap-2 rounded-lg p-2 md:p-6 mb-48 font-semibold'
    enctype='multipart/form-data'
    method='POST'
    on:formdata={manuallyAddFiles}
    use:enhance
>
    <Card class='w-full p-2'>
        <CardContent class='p-0'>
            <div class='relative mt-6'>
                <label class='text-md absolute -translate-y-7' for='name'> Name </label>
                <input
                    bind:value={$form.name}
                    class='w-full bg-accent rounded px-3 py-2'
                    id='name'
                    maxlength='128'
                    name='name'
                    type='text'
                />
            </div>
        </CardContent>
        <CardFooter class='p-0 pt-2 text-muted-foreground text-sm w-full'>
            <span>Word length: {$form.name.length} / 128</span>
        </CardFooter>
    </Card>

    <Card class='w-full p-2'>
        <CardContent class='p-0'>
            <div class='relative mt-6'>
                <label class='text-md absolute -translate-y-7' for='description'> Summary </label>
                <textarea
                    bind:value={$form.summary}
                    class='w-full bg-accent rounded px-3 py-2'
                    id='summary'
                    maxlength='128'
                    name='summary'
                    rows='5'
                />
            </div>
        </CardContent>
        <CardFooter class='p-0 text-muted-foreground text-sm w-full'>
            <span>Word length: {$form.summary.length} / 128</span>
        </CardFooter>
    </Card>

    <VersionSelector bind:processedRanges parsedVersions={data.versions} />

    <MarkdownEditor value={$form.description} />

    <FileInput accept='.litematic' body='Add litematic(s)' files={schemProxy} name='schematic' />

    <FileInput accept='.png,.jpg,.jpeg,.webp' body='Add image(s)' files={imgProxy} isImage name='image' />

    <Button class='text-xl h-12' type='submit'>Submit</Button>
</form>
