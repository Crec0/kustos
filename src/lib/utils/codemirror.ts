import type { TransactionSpec } from '@codemirror/state';
import {
    EditorView,
    type KeyBinding,
} from '@codemirror/view';

export const kustosTheme = {
    '&': {
        color: 'var(--foreground)',
        backgroundColor: `var(--background)`,
        padding: '0.5rem',
        fontSize: '1rem',
        height: '35rem',
    },
    '.cm-scroller': {
        overflow: 'auto',
    },
    '.cm-content': {
        caretColor: 'hsl(var(--primary))',
    },
    '.cm-cursor': {
        borderLeftColor: 'hsl(var(--secondary))',
    },
    '.cm-gutters': {
        backgroundColor: `hsl(var(--background))`,
        color: 'hsl(var(--foreground) / 0.6)',
        border: 'none',
    },
    '&.cm-focused > .cm-scroller > .cm-cursorLayer': {
        animation: 'steps(1) cm-blink 1s infinite',
    },
    '.cm-activeLineGutter': {
        background: `hsl(var(--accent))`,
    },
    '.cm-lineNumbers > .cm-activeLineGutter': {
        borderRadius: '0.1rem 0 0 0.1rem',
    },
    '.cm-activeLine': {
        background: `hsl(var(--accent) / 0.5)`,
    },
    '.cm-focused > .cm-selectionLayer .cm-selectionBackground': {
        background: 'hsl(var(--primary) / 0.2)',
    },
    '.cm-selectionBackground, .cm-content ::selection': {
        background: 'hsl(var(--primary) / 0.2)',
    },
    '.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
        background: `hsl(var(--primary / 0.2))`,
    },
};


export const LUT = {
    BOLD: '**',
    ITALIC: '*',
    UNDERLINE: '__',
    STRIKETHROUGH: '~~',
    UNORDERED_LIST: '- ',
    ORDERED_LIST: '1. ',
    TASK_LIST: '- [ ] ',
    HR: '---',
    BLOCKQUOTE: '> ',
    HEADING_1: '# ',
    HEADING_2: '## ',
    HEADING_3: '### ',
    HEADING_4: '#### ',
    HEADING_5: '##### ',
    HEADING_6: '###### ',
    DETAIL_PREFIX: '\n<details>\n<summary>Spoiler</summary>\n',
    DETAIL_SUFFIX: '\n</details>',
} as const;

export const kustomKeybind: KeyBinding[] = [
    {
        key: 'Mod-b',
        run: (view) => toggleWrapper(view, LUT.BOLD, LUT.BOLD),
    },
    {
        key: 'Mod-i',
        run: (view) => toggleWrapper(view, LUT.ITALIC, LUT.ITALIC),
    },
    {
        key: 'Mod-u',
        run: (view) => toggleWrapper(view, LUT.UNDERLINE, LUT.UNDERLINE),
    },
    {
        key: 'Mod-s',
        run: (view) => toggleWrapper(view, LUT.STRIKETHROUGH, LUT.STRIKETHROUGH),
    },
    {
        key: 'Mod-d',
        run: (view) => toggleWrapper(view, LUT.DETAIL_PREFIX, LUT.DETAIL_SUFFIX),
    },
];

function replaceText(
    text: string,
    documentFrom: number,
    documentTo: number,
    selectionFrom: number,
    selectionTo: number,
): TransactionSpec {
    return {
        changes: { from: documentFrom, to: documentTo, insert: text },
        selection: { anchor: selectionFrom, head: selectionTo },
    };
}

export function toggleWrapper({ state: { doc, selection }, dispatch }: EditorView, prefix: string, suffix: string = prefix) {
    const { from, to } = selection.main;
    const [ prefixLen, suffixLen ] = [ prefix.length, suffix.length ];
    const selectedText = doc.sliceString(from, to);

    const expectedWrappedText = doc.sliceString(from - prefixLen, to + suffixLen);

    const transaction =
              expectedWrappedText.startsWith(prefix) && expectedWrappedText.endsWith(suffix)
                  ? replaceText(selectedText, from - prefixLen, to + suffixLen, from - prefixLen, to - prefixLen)
                  : replaceText(prefix + selectedText + suffix, from, to, from + prefixLen, to + prefixLen);

    dispatch(transaction);
    return true;
}

export function toggleLineBeginning({ state: { doc, selection }, dispatch }: EditorView, prefix: string) {
    const line = doc.lineAt(selection.main.from);
    const transaction = line.text.startsWith(prefix)
        ? replaceText(line.text.slice(prefix.length), line.from, line.to, line.from, line.to - prefix.length)
        : replaceText(prefix + line.text, line.from, line.to, line.from + prefix.length, line.to + prefix.length);

    dispatch(transaction);
    return true;
}
