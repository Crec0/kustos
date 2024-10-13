<script lang='ts'>
    import type { PageData } from './$types';
    import {
        filesProxy,
        superForm,
    } from 'sveltekit-superforms/client';
    import FileInput from '$components/FileInput.svelte';
    import {
        type Readable,
        type Writable,
        writable,
    } from 'svelte/store';
    import { postForm } from '$lib/zod/post-form';
    import { Button } from '$components/ui/form';
    import VersionSelector from '$components/version-selector/version-selector.svelte';
    import { zod } from 'sveltekit-superforms/adapters';
    import {
        Card,
        CardContent,
        CardFooter,
    } from '$components/ui/card';
    import MarkdownEditor from './(components)/MarkdownEditor.svelte';

    import {
        RadioGroup,
        RadioGroupItem,
    } from '$components/ui/radio-group';
    import { Label } from '$components/ui/label';

    export let data: PageData;

    let processedRanges: Readable<number[][]>;

    const { form, enhance } = superForm(data.form, {
        validators: zod(postForm),
        resetForm: false,
    });

    const schemProxy = filesProxy(form, 'schematic');
    const imgProxy = filesProxy(form, 'image');

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
        <CardContent class='p-2'>
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
        <CardFooter class='p-2 pt-0 text-muted-foreground text-sm w-full'>
            <span>Word length: {$form.name.length} / 64</span>
        </CardFooter>
    </Card>

    <Card class='w-full p-2'>
        <CardContent class='p-2 space-y-2'>
            <Label class='text-md' for='visibility-selector'> Visibility </Label>

            <RadioGroup bind:value={$form.status} class='font-normal' id='visibility-selector'>
                <div class='flex items-center'>
                    <RadioGroupItem id='private' value='private' />
                    <Label for='private' class='cursor-pointer pl-2  font-normal text-base'>Private</Label>
                </div>
                <div class='flex items-center'>
                    <RadioGroupItem id='unlisted' value='unlisted' />
                    <Label for='unlisted' class='cursor-pointer pl-2 font-normal text-base'>Unlisted</Label>
                </div>
                <div class='flex items-center'>
                    <RadioGroupItem id='public' value='public' />
                    <Label for='public' class='cursor-pointer pl-2  font-normal text-base'>Public</Label>
                </div>
            </RadioGroup>
        </CardContent>
    </Card>

    <Card class='w-full p-2'>
        <CardContent class='p-2'>
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
        <CardFooter class='p-2 pt-0 text-muted-foreground text-sm w-full'>
            <span>Word length: {$form.summary.length} / 128</span>
        </CardFooter>
    </Card>

    <VersionSelector bind:processedRanges parsedVersions={data.versions} />

    <MarkdownEditor value={$form.description} />

    <FileInput accept='.litematic' body='Add litematic(s)' files={schemProxy} name='schematic' />

    <FileInput accept='.png,.jpg,.jpeg,.webp' body='Add image(s)' files={imgProxy} isImage name='image' />

    <Button class='text-xl h-12' type='submit'>Submit</Button>
</form>
