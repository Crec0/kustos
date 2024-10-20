<script lang='ts'>
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { postForm } from '$lib/zod/post-form';

    import { type Readable } from 'svelte/store';
    import {
        FilesIcon,
        ImagesIcon,
    } from 'lucide-svelte';
    import { superForm } from 'sveltekit-superforms/client';
    import { zod } from 'sveltekit-superforms/adapters';
    import {
        Button,
        Control,
        Description,
        Field,
        FieldErrors,
        Label,
    } from '$components/ui/form';
    import {
        RadioGroup,
        RadioGroupItem,
    } from '$components/ui/radio-group';
    import { Input } from '$components/ui/input';

    import FileInput from './(components)/file-input/FileInput.svelte';
    import MarkdownEditor from './(components)/markdown-editor/MarkdownEditor.svelte';
    import VersionSelector from './(components)/version-selector/version-selector.svelte';


    export let data: PageData;

    let processedRanges: Readable<number[][]>;

    const form = superForm(data.form, {
        validators: zod(postForm),
        resetForm: false,
    });

    const { form: formData, enhance } = form;

    let manuallyPatchFormUploadData = (
        e: FormDataEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) => {
        e.formData.delete('versions');
        for ( const version of $processedRanges ) {
            e.formData.append('versions', version[0].toString());
            e.formData.append('versions', version[1].toString());
        }
    };
</script>

<form
    class='mx-4 mb-48 flex w-full flex-col gap-4 rounded-lg p-2 max-w-[60%] md:p-6'
    enctype='multipart/form-data'
    method='POST'
    on:formdata={manuallyPatchFormUploadData}
    use:enhance
>
    <Field {form} name='name'>
        <Control let:attrs>
            <Label>Name</Label>
            <Input
                {...attrs}
                bind:value={$formData.name}
                maxlength={64}
                minlength={3}
                placeholder='an amazing name'
            />
        </Control>
        <Description>
            Word length: {$formData.name.length} / 64
        </Description>
        <FieldErrors />
    </Field>

    <Field {form} name='summary'>
        <Control let:attrs>
            <Label>Summary</Label>
            <Input
                {...attrs}
                bind:value={$formData.summary}
                maxlength={256}
                minlength={3}
                placeholder='an amazing summary'
            />
        </Control>
        <Description>
            Word length: {$formData.summary.length} / 256
        </Description>
        <FieldErrors />
    </Field>

    <Field {form} name='status'>
        <Control let:attrs>
            <Label> Visibility </Label>
            <RadioGroup
                {...attrs}
                bind:value={$formData.status}
                class='grid grid-cols-1 lg:grid-cols-3'
            >
                <Label
                    class='flex cursor-pointer flex-col gap-2 rounded border p-2 font-normal bg-background hover:bg-secondary/40'
                    for='public'
                >
                    <div class='flex items-center gap-2 p-2 pb-0'>
                        <RadioGroupItem
                            class='bg-background'
                            id='public'
                            value='public'
                        />
                        <span>Public</span>
                    </div>
                    <span class='p-2 pt-0 text-sm font-normal text-muted-foreground'>
                        Post will be publicly listed and available to everyone.
                    </span>
                </Label>
                <Label
                    class='flex cursor-pointer flex-col gap-2 rounded border p-2 font-normal bg-background hover:bg-secondary/40'
                    for='unlisted'
                >
                    <div class='flex items-center gap-2 p-2 pb-0'>
                        <RadioGroupItem
                            class='bg-background'
                            id='unlisted'
                            value='unlisted'
                        />
                        <span>Unlisted</span>
                    </div>
                    <span class='p-2 pt-0 text-sm font-normal text-muted-foreground'>
                        Post will be removed from public listing, however will be available via direct link.
                    </span>
                </Label>
                <Label
                    class='flex cursor-pointer flex-col gap-2 rounded border p-2 font-normal bg-background hover:bg-secondary/40'
                    for='private'
                >
                    <div class='flex items-center gap-2 p-2 pb-0'>
                        <RadioGroupItem
                            class='bg-background'
                            id='private'
                            value='private'
                        />
                        <span>Private</span>
                    </div>
                    <span class='p-2 pt-0 text-sm font-normal text-muted-foreground'>
                        Post will be inaccessible for general public. Only visible to you and moderators.
                    </span>
                </Label>
            </RadioGroup>
        </Control>
    </Field>

    <Field {form} name='versions'>
        <Control let:attrs>
            <Label> Versions </Label>
            <VersionSelector {...attrs} bind:processedRanges parsedVersions={data.versions} />
        </Control>
    </Field>

    <Field {form} name='description'>
        <Control let:attrs>
            <Label> Description </Label>
            <MarkdownEditor {...attrs} value={$formData.description} />
        </Control>
    </Field>

    <Field {form} name='schematic'>
        <Control let:attrs>
            <Label> Schematics </Label>
            <FileInput
                {...attrs}
                accept='.litematic'
                fileType='schematics'
                postId={$page.params.id}
            >
            </FileInput>
        </Control>
    </Field>

    <Field {form} name='image'>
        <Control let:attrs>
            <Label> Images </Label>
            <FileInput
                {...attrs}
                accept='.png,.jpg,.jpeg,.webp'
                fileType='images'
                isImage
                postId={$page.params.id}
            >
            </FileInput>
        </Control>
    </Field>

    <Button class='mt-12 h-12 text-xl' type='submit'>Submit</Button>
</form>
