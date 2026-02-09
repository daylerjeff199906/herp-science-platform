'use client'

import React from 'react'
import { CollectionsLayoutProvider, useCollectionsLayout } from './CollectionsLayoutContext'
import { CollectionsFilters } from './CollectionsFilters'
import { cn } from '@repo/ui'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button } from '@repo/ui'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { CollectionsFilterContent } from './CollectionsFilterContent'

function CollectionsLayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, toggleSidebar } = useCollectionsLayout()

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
                // If sidebar is open, no margin needed if we use flex layout above. 
                // But layout.tsx had ml-80 logic. 
                // Here we use flexbox so main takes remaining space.
                "w-full"
            )}>
                {/* Trigger for Collapsed Sidebar (Sticky) */}
                {!isSidebarOpen && (
                    <div className="hidden lg:block sticky top-24 z-20 ml-4 mb-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2 rounded-full shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
                                    <SlidersHorizontal size={16} />
                                    <span>Filtros</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[400px] overflow-y-auto">
                                <SheetHeader>
                                    <div className="flex items-center justify-between">
                                        <SheetTitle className="flex items-center gap-2">
                                            <Filter size={20} className='text-primary' />
                                            Filtros
                                        </SheetTitle>
                                        <Button variant="ghost" size="sm" onClick={() => toggleSidebar()}>
                                            Restaurar Panel
                                        </Button>
                                    </div>
                                </SheetHeader>
                                <div className="py-6">
                                    <CollectionsFilterContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}

                <div className={cn(
                    "flex flex-col gap-6 w-full container mx-auto px-4 lg:px-6",
                    !isSidebarOpen && "max-w-[1600px]" // Allow wider content when sidebar closed
                )}>
                    {children}
                </div>
            </main>
        </div>
    )
}

export function CollectionsLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CollectionsLayoutProvider>
            <div className="min-h-screen">
                <div className='bg-gray-900 h-20' />
                <CollectionsLayoutInner>{children}</CollectionsLayoutInner>
            </div>
        </CollectionsLayoutProvider>
    )
}
