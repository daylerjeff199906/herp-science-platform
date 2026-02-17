'use client'

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    actions?: ReactNode
    showBackButton?: boolean
    backUrl?: string
}

export function PageHeader({
    title,
    description,
    actions,
    showBackButton,
    backUrl,
    className,
    ...props
}: PageHeaderProps) {
    const router = useRouter()

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl)
        } else {
            router.back()
        }
    }

    return (
        <div className={cn("flex flex-col gap-4 pb-4 border-b mb-4", className)} {...props}>
            <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            className="h-8 w-8"
                            title={backUrl ? `Volver a ${backUrl}` : "Volver"}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Volver</span>
                        </Button>
                    )}
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
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
