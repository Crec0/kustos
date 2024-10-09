<script lang='ts'>
    import type { PageData } from './$types';
    import {
        stringProxy,
        filesProxy,
        superForm,
    } from 'sveltekit-superforms/client';
    import FileInput from '$components/FileInput.svelte';
    import {
        type Readable,
        type Writable,
        writable,
    } from 'svelte/store';
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
    import {
        onlyAlphaNumeric,
        publicUrl,
    } from '$utils';

    export let data: PageData;

    let processedRanges: Readable<number[][]>;
    const slugInputElementHolder: Writable<HTMLInputElement> = writable();

    const { form, enhance } = superForm(data.form, {
        validators: zod(postForm),
        resetForm: false,
        onUpdate: ({ form: {data}}) => {
            if ($slugInputElementHolder == null) return;

            const namedSlug = onlyAlphaNumeric(data.name);
            if (data.slug === namedSlug) {
                data.slug = '';
                $slugInputElementHolder.placeholder = namedSlug;
            }
        },
    });

    const schemProxy = filesProxy(form, 'schematic');
    const imgProxy = filesProxy(form, 'image');
    const nameProxy = stringProxy(form, 'name', {empty: 'null'});

    const updateSlugBasedOnName = () => {
        if ($slugInputElementHolder == null) return;

        const content = $form.slug.length > 0 ? $form.slug : $form.name;
        const cleanContent = onlyAlphaNumeric(content);

        if ($form.slug.length === 0) {
            $slugInputElementHolder.placeholder = cleanContent;
        } else {
            $slugInputElementHolder.placeholder = '';
            $form.slug = cleanContent;
        }
    }

    nameProxy.subscribe(updateSlugBasedOnName);

    let manuallyPatchFormUploadData = (e: FormDataEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
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

        if ($form.slug.length === 0) {
            e.formData.delete('slug');
            e.formData.append('slug', onlyAlphaNumeric($form.name));
        }
    };

</script>

<form
    class='mx-4 flex w-full max-w-[60%] flex-col gap-2 rounded-lg p-2 md:p-6 mb-48 font-semibold'
    enctype='multipart/form-data'
    method='POST'
    on:formdata={manuallyPatchFormUploadData}
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
                    maxlength='64'
                    name='name'
                    type='text'
                />
            </div>
        </CardContent>
        <CardFooter class='p-0 pt-2 text-muted-foreground text-sm w-full'>
            <span>Word length: {$form.name.length} / 64</span>
        </CardFooter>
    </Card>

    <Card class='w-full p-2'>
        <CardContent class='p-0'>
            <div class='relative mt-6'>
                <label class='text-md absolute -translate-y-7' for='slug'> URL </label>
                <div class='flex gap-0 align-center bg-accent rounded py-2 px-3'>
                    <span class='text-muted-foreground'>
                        {publicUrl()}/
                    </span>
                    <input
                        bind:value={$form.slug}
                        bind:this={$slugInputElementHolder}
                        on:input={updateSlugBasedOnName}
                        class='w-full pl-0 bg-accent placeholder:italic focus-visible:outline-none'
                        id='slug'
                        maxlength='64'
                        name='slug'
                        type='text'
                    />
                </div>
            </div>
        </CardContent>
        <CardFooter class='p-0 pt-2 text-muted-foreground text-sm w-full'>
            <span>Word length: {$form.slug.length} / 64</span>
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
