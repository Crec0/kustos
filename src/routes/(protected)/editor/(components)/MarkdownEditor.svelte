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
    import { onMount } from 'svelte';
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


    let value = `


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique tellus dui, nec sodales massa aliquam ac. Maecenas ac tempor mauris. Quisque odio sapien, accumsan nec orci vitae, placerat tincidunt mi. Nam non finibus augue. Nam nec condimentum velit, consequat venenatis massa. In hac habitasse platea dictumst. Aenean a aliquam lacus, at fermentum massa. Morbi venenatis neque id ante egestas varius. Nullam lectus nisl, hendrerit venenatis efficitur sed, commodo eu erat. Vestibulum id dictum massa, non gravida risus. Phasellus tincidunt fringilla urna, nec feugiat neque feugiat sed.

Vestibulum quis sagittis neque. Donec dui nunc, scelerisque quis augue in, lacinia aliquam libero. Integer commodo purus fringilla ante sagittis egestas. Vestibulum eu leo eros. Ut hendrerit, dui eget pharetra tempus, ipsum nisl fringilla velit, quis bibendum turpis est sit amet nibh. Donec vulputate orci et risus ullamcorper, non placerat turpis fringilla. Ut molestie imperdiet elit eu auctor. Fusce suscipit ex id nulla scelerisque, in pellentesque dolor efficitur.

Duis congue justo sed mi pharetra feugiat. Maecenas dictum aliquet metus sed aliquam. Nulla facilisi. Sed condimentum at tortor sed tristique. Ut ultrices ac mi eu elementum. Pellentesque cursus lacus sit amet sem ultrices blandit. Donec feugiat ex ante, eget iaculis lectus faucibus in. In non eros magna. Maecenas ac leo sed tellus sodales maximus.

Cras feugiat odio a lectus cursus, sit amet varius mi molestie. Cras lacinia ipsum eget elit sagittis, pulvinar gravida ante efficitur. Maecenas feugiat ut erat nec interdum. In ut scelerisque leo. Nulla rhoncus, orci at condimentum aliquet, nulla lectus ultricies metus, id aliquam justo lacus sit amet nisl. In vel ultrices eros. Proin id urna tincidunt, aliquet risus accumsan, varius nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc ipsum urna, luctus at orci ac, dignissim rutrum metus. Vivamus quis ultrices tortor. Donec in sem sit amet augue placerat pulvinar non sed nunc. Nulla vel justo enim. Proin malesuada felis sit amet mi volutpat, at commodo turpis sollicitudin. Suspendisse tellus elit, imperdiet eu dictum id, tempus nec lectus.

Vestibulum quis aliquam purus. Nullam mattis enim a nisi fringilla vehicula. Cras neque orci, congue in molestie nec, tristique sit amet ante. Donec laoreet accumsan turpis, vel blandit diam faucibus a. Curabitur euismod dictum massa sed dignissim. Integer congue eros vel erat blandit, sed iaculis enim iaculis. Nunc tempor tortor varius mauris maximus placerat. Nunc vitae condimentum tortor. Pellentesque luctus interdum eros id sollicitudin. Phasellus sapien sem, elementum sit amet est efficitur, scelerisque elementum leo.








w`;

    let element: HTMLDivElement;
    let view: EditorViewType;

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
            <MKButton onClick={() => toggleWrapper(view, LUT.BOLD)} name='Bold'>
                <BoldIcon />
            </MKButton>

            <MKButton onClick={() => toggleWrapper(view, LUT.ITALIC)} name='Italic'>
                <ItalicIcon />
            </MKButton>

            <MKButton onClick={() => toggleWrapper(view, LUT.UNDERLINE)} name='Underline'>
                <UnderlineIcon />
            </MKButton>

            <MKButton onClick={() => toggleWrapper(view, LUT.STRIKETHROUGH)} name='Strikethrough'>
                <StrikethroughIcon />
            </MKButton>

            <MKButton onClick={() => toggleWrapper(view, LUT.DETAIL_PREFIX, LUT.DETAIL_SUFFIX)} name='Spoiler'>
                <EyeOffIcon />
            </MKButton>

            <Separator orientation='vertical' />

            <MKButton onClick={() => toggleLineBeginning(view, LUT.HEADING_1)} name='Heading 1'>
                <Heading1Icon />
            </MKButton>

            <MKButton onClick={() => toggleLineBeginning(view, LUT.HEADING_2)} name='Heading 2'>
                <Heading2Icon />
            </MKButton>

            <MKButton onClick={() => toggleLineBeginning(view, LUT.HEADING_3)} name='Heading 3'>
                <Heading3Icon />
            </MKButton>

            <Separator orientation='vertical' />

            <MKButton onClick={() => toggleLineBeginning(view, LUT.ORDERED_LIST)} name='Ordered List'>
                <ListOrderedIcon />
            </MKButton>

            <MKButton onClick={() => toggleLineBeginning(view, LUT.UNORDERED_LIST)} name='Unordered List'>
                <ListIcon />
            </MKButton>

            <MKButton onClick={() => toggleLineBeginning(view, LUT.TASK_LIST)} name='Task List'>
                <ListTodoIcon />
            </MKButton>

            <MKButton onClick={() => toggleLineBeginning(view, LUT.BLOCKQUOTE)} name='Blockquote'>
                <TextQuoteIcon />
            </MKButton>
        </div>
    </CardHeader>
    <CardContent class='p-0'>
        <Separator />
        <div bind:this={element} class='codemirror-wrapper' />
    </CardContent>
</Card>
