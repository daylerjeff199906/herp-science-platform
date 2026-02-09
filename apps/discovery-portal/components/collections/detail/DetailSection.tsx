import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@repo/ui'

interface DetailSectionProps {
    id: string
    title: string
    children: React.ReactNode
    className?: string
}

export function DetailSection({ id, title, children, className }: DetailSectionProps) {
    if (!children) return null

    // Check if children is an array and all items are null/undefined
    if (Array.isArray(children) && children.every(child => !child)) return null

    return (
        <div id={id} className={cn("scroll-mt-24 rounded-xl border border-border bg-card text-card-foreground shadow-sm mb-6", className)}>
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            <div className="p-6">
                <dl className="space-y-1">
                    {children}
                </dl>
            </div>
        </div>
    )
}
