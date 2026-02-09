import React from 'react'
import { cn } from '@repo/ui'

interface DetailRowProps {
    label: string
    value: React.ReactNode
    className?: string
}

export function DetailRow({ label, value, className }: DetailRowProps) {
    if (value === null || value === undefined || value === '') return null
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 -mx-4 dark:border-gray-800 dark:hover:bg-gray-800/50", className)}>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 md:col-span-1">{label}</dt>
            <dd className="text-sm md:col-span-2 font-medium break-words text-gray-900 dark:text-gray-200">
                {value}
            </dd>
        </div>
    )
}
