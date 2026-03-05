import { HeaderData } from "@/types/editor";
import { cn } from "@/lib/utils";

export function HeaderBlock({ data }: { data: HeaderData }) {
    const { text, level = 2 } = data;
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    const styles = {
        h1: "text-3xl font-bold mt-8 mb-4",
        h2: "text-2xl font-bold mt-8 mb-4 border-b pb-2",
        h3: "text-xl font-bold mt-6 mb-3",
        h4: "text-lg font-bold mt-4 mb-2",
        h5: "text-base font-bold mt-4 mb-2",
        h6: "text-sm font-bold mt-4 mb-2",
    };

    return <Tag className={cn(styles[Tag as keyof typeof styles], "text-foreground")}>{text}</Tag>;
}
