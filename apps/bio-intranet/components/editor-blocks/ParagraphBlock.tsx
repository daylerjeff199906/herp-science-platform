import { ParagraphData } from "@/types/editor";

export function ParagraphBlock({ data }: { data: ParagraphData }) {
    return (
        <p
            className="text-muted-foreground leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: data.text }}
        />
    );
}
