import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PageHeaderProps {
    title: string
    description?: string
    action?: {
        label: string
        href?: string
        onClick?: () => void
        icon?: React.ReactNode
    }
    children?: React.ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </div>
            {(action || children) && (
                <div className="flex items-center gap-2">
                    {children}
                    {action && action.href ? (
                        <Button
                            size="sm"
                            className="h-8 text-xs rounded-full"
                            render={
                                <Link
                                    href={action.href}
                                    className="flex items-center gap-1"
                                />
                            }
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </Button>
                    ) : action && action.onClick ? (
                        <Button
                            size="sm"
                            className="h-8 text-xs flex items-center gap-1 rounded-full"
                            onClick={action.onClick}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </Button>
                    ) : null}
                </div>
            )}
        </div>
    )
}

