<script lang='ts'>
    import {
        type EditorView as EditorViewType,
        EditorView,
        highlightActiveLine,
        highlightActiveLineGutter,
        highlightSpecialChars,
        highlightWhitespace,
        keymap,
        lineNumbers,
    } from '@codemirror/view';
    import {
        defaultKeymap,
        history,
        historyKeymap,
        indentWithTab,
    } from '@codemirror/commands';
    import {
        autocompletion,
        closeBrackets,
        closeBracketsKeymap,
        completionKeymap,
    } from '@codemirror/autocomplete';
    import {
        onMount,
        tick,
    } from 'svelte';
    import { EditorState } from '@codemirror/state';
    import { indentUnit } from '@codemirror/language';
    import {
        markdown,
        markdownKeymap,
        markdownLanguage,
    } from '@codemirror/lang-markdown';
    import {
        alwaysKeepMinimum25Lines,
        kustomKeybind,
        kustosTheme,
        LUT,
        toggleLineBeginning,
        toggleWrapper,
    } from '$lib/utils/codemirror';
    import { Card } from '$components/ui/card';
    import {
        CardContent,
        CardHeader,
    } from '$components/ui/card/index.js';
    import {
        BoldIcon,
        EyeOffIcon,
        Heading1Icon,
        Heading2Icon,
        Heading3Icon,
        ItalicIcon,
        ListIcon,
        ListOrderedIcon,
        ListTodoIcon,
        StrikethroughIcon,
        TextQuoteIcon,
        UnderlineIcon,
    } from 'lucide-svelte';
    import { Separator } from '$components/ui/separator';
    import MKButton from './MKButton.svelte';
    import { Switch } from '$components/ui/switch';
    import { writable } from 'svelte/store';

    // TODO: Add better theme and support better markdown.
    import '../../../../github.css';
    import { unified } from 'unified';
    import remarkParse from 'remark-parse';
    import remarkGfm from 'remark-gfm';
    import remarkRehype from 'remark-rehype';
    import rehypeStringify from 'rehype-stringify';


    let value = '';

    let element: HTMLDivElement;
    let view: EditorViewType;
    let previewElem: HTMLDivElement;
    let preview = writable(false);

    $: console.log($preview);

    const remark = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify);

    const parsePreview = async () => {
        await tick();
        const result = await remark.process(view.state.doc.toString());
        previewElem.innerHTML = String(result);
    };

    onMount(() => {
        view = new EditorView({
            parent: element,
            state: EditorState.create({
                doc: value,
                extensions: [
                    alwaysKeepMinimum25Lines,
                    EditorView.theme(kustosTheme),
                    lineNumbers(),
                    highlightActiveLineGutter(),
                    highlightWhitespace(),
                    highlightSpecialChars(),
                    highlightActiveLine(),
                    history(),
                    closeBrackets(),
                    indentUnit.of('    '),
                    autocompletion(),
                    markdown({
                        base: markdownLanguage,
                        extensions: [],
                    }),
                    keymap.of([
                        ...kustomKeybind,
                        indentWithTab,
                        ...defaultKeymap,
                        ...closeBracketsKeymap,
                        ...historyKeymap,
                        ...completionKeymap,
                        ...markdownKeymap,
                    ]),
                    EditorView.lineWrapping,
                ],
            }),
        });
    });
</script>

<Card>
    <CardHeader class='p-2'>
        <div class='flex gap-2'>
            <MKButton name='Bold' onClick={() => toggleWrapper(view, LUT.BOLD)}>
                <BoldIcon />
            </MKButton>

            <MKButton name='Italic' onClick={() => toggleWrapper(view, LUT.ITALIC)}>
                <ItalicIcon />
            </MKButton>

            <MKButton name='Underline' onClick={() => toggleWrapper(view, LUT.UNDERLINE)}>
                <UnderlineIcon />
            </MKButton>

            <MKButton name='Strikethrough' onClick={() => toggleWrapper(view, LUT.STRIKETHROUGH)}>
                <StrikethroughIcon />
            </MKButton>

            <MKButton name='Spoiler' onClick={() => toggleWrapper(view, LUT.DETAIL_PREFIX, LUT.DETAIL_SUFFIX)}>
                <EyeOffIcon />
            </MKButton>

            <Separator orientation='vertical' />

            <MKButton name='Heading 1' onClick={() => toggleLineBeginning(view, LUT.HEADING_1)}>
                <Heading1Icon />
            </MKButton>

            <MKButton name='Heading 2' onClick={() => toggleLineBeginning(view, LUT.HEADING_2)}>
                <Heading2Icon />
            </MKButton>

            <MKButton name='Heading 3' onClick={() => toggleLineBeginning(view, LUT.HEADING_3)}>
                <Heading3Icon />
            </MKButton>

            <Separator orientation='vertical' />

            <MKButton name='Ordered List' onClick={() => toggleLineBeginning(view, LUT.ORDERED_LIST)}>
                <ListOrderedIcon />
            </MKButton>

            <MKButton name='Unordered List' onClick={() => toggleLineBeginning(view, LUT.UNORDERED_LIST)}>
                <ListIcon />
            </MKButton>

            <MKButton name='Task List' onClick={() => toggleLineBeginning(view, LUT.TASK_LIST)}>
                <ListTodoIcon />
            </MKButton>

            <MKButton name='Blockquote' onClick={() => toggleLineBeginning(view, LUT.BLOCKQUOTE)}>
                <TextQuoteIcon />
            </MKButton>

            <div class='flex space-x-2 items-center pr-2 ml-auto'>
                <Switch bind:checked={$preview} id='preview-switch' on:click={parsePreview} />
                <label for='preview-switch'>Preview</label>
            </div>
        </div>
    </CardHeader>
    <CardContent class='p-0'>
        <Separator />
        <div bind:this={element} class={`codemirror-wrapper ${$preview ? "hidden" : ""}`} />
        <div bind:this={previewElem} class={`markdown-body p-2 ${$preview ? "" : "hidden"}`}></div>
    </CardContent>
</Card>
