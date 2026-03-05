import { ListData } from "@/types/editor";
import { cn } from "@/lib/utils";

export function ListBlock({ data }: { data: ListData }) {
    const { style, items } = data;
    const Tag = style === 'ordered' ? 'ol' : 'ul';

    return (
        <Tag className={cn(
            "mb-4 ml-6 space-y-2 text-muted-foreground",
            style === 'ordered' ? "list-decimal" : "list-disc"
        )}>
            {items.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
        </Tag>
    );
}
