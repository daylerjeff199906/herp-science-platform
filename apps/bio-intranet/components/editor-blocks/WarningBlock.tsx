import { WarningData } from "@/types/editor";
import { AlertCircle } from "lucide-react";

export function WarningBlock({ data }: { data: WarningData }) {
    return (
        <div className="flex gap-4 p-4 my-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
                {data.title && <h4 className="font-bold text-amber-900 dark:text-amber-400">{data.title}</h4>}
                <p className="text-sm text-amber-800 dark:text-amber-500/90 leading-relaxed">{data.message}</p>
            </div>
        </div>
    );
}
