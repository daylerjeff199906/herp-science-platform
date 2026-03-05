export type BlockType = 'header' | 'paragraph' | 'list' | 'warning';

export interface HeaderData {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphData {
    text: string;
}

export interface ListData {
    style: 'ordered' | 'unordered';
    items: string[];
}

export interface WarningData {
    title: string;
    message: string;
}

export interface EditorBlock {
    id: string;
    type: BlockType | string;
    data: HeaderData | ParagraphData | ListData | WarningData | any;
}

export interface RichTextContent {
    time?: number;
    blocks: EditorBlock[];
    version?: string;
}

export interface LocalizedRichTextContent {
    [locale: string]: RichTextContent;
}
