import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    actions?: ReactNode
}

export function PageHeader({
    title,
    description,
    actions,
    className,
    ...props
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 pb-4 border-b mb-4", className)} {...props}>
            <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
