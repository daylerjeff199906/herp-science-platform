import { ListData } from "@/types/editor";
import { cn } from "@/lib/utils";

export function ListBlock({ data }: { data: ListData }) {
    const { style, items } = data;

    const className = cn(
        "mb-4 ml-6 space-y-2 text-muted-foreground",
        style === 'ordered' ? "list-decimal" : "list-disc"
    );

    if (style === 'ordered') {
        return (
            <ol className={className}>
                {items.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ol>
        );
    }

    return (
        <ul className={className}>
            {items.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
        </ul>
    );
}
