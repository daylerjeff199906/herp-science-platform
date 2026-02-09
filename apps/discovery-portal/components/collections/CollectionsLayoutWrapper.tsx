'use client'

import React, { useEffect, useState } from 'react'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import { CollectionsFilters } from './CollectionsFilters'
import { cn } from '@repo/ui'

function CollectionsLayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, toggleSidebar } = useCollectionsStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen relative">
            {/* Sidebar Desktop - Conditional Rendering */}
            <aside
                className={cn(
                    "hidden lg:block transition-all duration-300 ease-in-out border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950",
                    isSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden border-none"
                )}
            >
                <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto w-80">
                    <CollectionsFilters />
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1  transition-all duration-300 ease-in-out py-4",
                "w-full"
            )}>


                <div className={cn(
                    "flex flex-col gap-6 w-full container mx-auto px-4 lg:px-6",
                    !isSidebarOpen && "max-w-[1600px]"
                )}>
                    {children}
                </div>
            </main>
        </div>
    )
}

export function CollectionsLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <div className='bg-gray-900 h-20' />
            <CollectionsLayoutInner>{children}</CollectionsLayoutInner>
        </div>
    )
}
