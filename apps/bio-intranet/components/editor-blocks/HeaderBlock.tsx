import { HeaderData } from "@/types/editor";
import { cn } from "@/lib/utils";

export function HeaderBlock({ data }: { data: HeaderData }) {
    const { text, level = 2 } = data;

    // Safe mapping for levels avoid type issues with JSX
    const styles = {
        1: "text-3xl font-bold mt-8 mb-4",
        2: "text-2xl font-bold mt-8 mb-4 border-b pb-2",
        3: "text-xl font-bold mt-6 mb-3",
        4: "text-lg font-bold mt-4 mb-2",
        5: "text-base font-bold mt-4 mb-2",
        6: "text-sm font-bold mt-4 mb-2",
    };

    const className = cn(styles[level as keyof typeof styles] || styles[2], "text-foreground");

    switch (level) {
        case 1: return <h1 className={className}>{text}</h1>;
        case 3: return <h3 className={className}>{text}</h3>;
        case 4: return <h4 className={className}>{text}</h4>;
        case 5: return <h5 className={className}>{text}</h5>;
        case 6: return <h6 className={className}>{text}</h6>;
        case 2:
        default: return <h2 className={className}>{text}</h2>;
    }
}
