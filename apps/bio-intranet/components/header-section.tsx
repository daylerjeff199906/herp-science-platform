import { cn } from "@/lib/utils"

interface HeaderSectionProps {
    title: string
    description?: string
    className?: string
}

export function HeaderSection({ title, description, className }: HeaderSectionProps) {
    return (
        <div className={cn("space-y-1 mb-6", className)}>
            <h1 className="text-xl font-medium tracking-tight text-foreground">
                {title}
            </h1>
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}
