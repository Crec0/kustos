<script lang='ts'>
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import FileInput from './(components)/file-input/FileInput.svelte';
    import { type Readable } from 'svelte/store';
    import { postForm } from '$lib/zod/post-form';
    import { Button } from '$components/ui/form';
    import VersionSelector from './(components)/version-selector/version-selector.svelte';
    import { zod } from 'sveltekit-superforms/adapters';
    import {
        Card,
        CardContent,
        CardFooter,
    } from '$components/ui/card';

    import {
        RadioGroup,
        RadioGroupItem,
    } from '$components/ui/radio-group';
    import { Label } from '$components/ui/label';
    import { page } from '$app/stores';
    import MarkdownEditor from './(components)/markdown-editor/MarkdownEditor.svelte';


    export let data: PageData;

    let processedRanges: Readable<number[][]>;

    const { form, enhance } = superForm(data.form, {
        validators: zod(postForm),
        resetForm: false,
    });

    let manuallyPatchFormUploadData = (e: FormDataEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
        e.formData.delete('versions');
        for ( const version of $processedRanges ) {
            e.formData.append('versions', version[0].toString());
            e.formData.append('versions', version[1].toString());
        }
    };
</script>

<form
    class='mx-4 mb-48 flex w-full flex-col gap-2 rounded-lg p-2 font-semibold max-w-[60%] md:p-6'
    enctype='multipart/form-data'
    method='POST'
    on:formdata={manuallyPatchFormUploadData}
    use:enhance
>
    <Card class='w-full p-2'>
        <CardContent class='p-2'>
            <div class='relative mt-6'>
                <label class='absolute -translate-y-7 text-md' for='name'> Name </label>
                <input
                    bind:value={$form.name}
                    class='w-full rounded px-3 py-2 bg-accent'
                    id='name'
                    maxlength='64'
                    name='name'
                    type='text'
                />
            </div>
        </CardContent>
        <CardFooter class='w-full p-2 pt-0 text-sm text-muted-foreground'>
            <span>Word length: {$form.name.length} / 64</span>
        </CardFooter>
    </Card>

    <Card class='w-full p-2'>
        <CardContent class='p-2 space-y-2'>
            <Label class='text-md' for='visibility-selector'> Visibility </Label>

            <RadioGroup bind:value={$form.status} class='font-normal' id='visibility-selector'>
                <div class='flex items-center'>
                    <RadioGroupItem id='private' value='private' />
                    <Label class='cursor-pointer pl-2 text-base font-normal' for='private'>Private</Label>
                </div>
                <div class='flex items-center'>
                    <RadioGroupItem id='unlisted' value='unlisted' />
                    <Label class='cursor-pointer pl-2 text-base font-normal' for='unlisted'>Unlisted</Label>
                </div>
                <div class='flex items-center'>
                    <RadioGroupItem id='public' value='public' />
                    <Label class='cursor-pointer pl-2 text-base font-normal' for='public'>Public</Label>
                </div>
            </RadioGroup>
        </CardContent>
    </Card>

    <Card class='w-full p-2'>
        <CardContent class='p-2'>
            <div class='relative mt-6'>
                <label class='absolute -translate-y-7 text-md' for='description'> Summary </label>
                <textarea
                    bind:value={$form.summary}
                    class='w-full rounded px-3 py-2 bg-accent'
                    id='summary'
                    maxlength='128'
                    name='summary'
                    rows='5'
                />
            </div>
        </CardContent>
        <CardFooter class='w-full p-2 pt-0 text-sm text-muted-foreground'>
            <span>Word length: {$form.summary.length} / 128</span>
        </CardFooter>
    </Card>

    <VersionSelector bind:processedRanges parsedVersions={data.versions} />

    <MarkdownEditor value={$form.description} />

    <FileInput accept='.litematic' fileType='schematic' postId={$page.params.id} />
    <FileInput accept='.png,.jpg,.jpeg,.webp' fileType='image' isImage postId={$page.params.id} />

    <Button class='h-12 text-xl' type='submit'>Submit</Button>
</form>
