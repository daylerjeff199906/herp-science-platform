import { RichTextContent, EditorBlock } from "@/types/editor";
import { HeaderBlock } from "./editor-blocks/HeaderBlock";
import { ParagraphBlock } from "./editor-blocks/ParagraphBlock";
import { ListBlock } from "./editor-blocks/ListBlock";
import { WarningBlock } from "./editor-blocks/WarningBlock";

const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
    header: HeaderBlock,
    paragraph: ParagraphBlock,
    list: ListBlock,
    warning: WarningBlock,
};

interface RichTextRendererProps {
    content: RichTextContent | null | undefined;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
        return null;
    }

    return (
        <div className="rich-text-renderer space-y-4">
            {content.blocks.map((block: EditorBlock) => {
                const type = block.type?.toLowerCase();
                const Component = BLOCK_COMPONENTS[type];

                if (!Component) {
                    console.warn(`[RichTextRenderer] Unknown block type: ${block.type}`, block);
                    return null;
                }

                return <Component key={block.id || Math.random().toString()} data={block.data} />;
            })}
        </div>
    );
}
