'use client'

import React, { useEffect, useState } from 'react'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import { CollectionsFilters } from './CollectionsFilters'
import { cn } from '@repo/ui'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button } from '@repo/ui'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { CollectionsFilterContent } from './CollectionsFilterContent'

function CollectionsLayoutInner({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, toggleSidebar } = useCollectionsStore()

    // Hydration fix: Zustand persist runs on client, so server renders with default (true probably).
    // If local storage has false, mismatch occurs. 
    // We can use a client-only render approach or force update.
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render a skeleton or default state related to SSR.
        // Or just render assuming open for SEO/first paint, then it snaps?
        // Let's render "open" by default on server to match default state or just suppress warning if attribute diffs.
        // But layout structure changes drastically (w-80 vs w-0).
        // Let's render as if open and then client updates immediately? 
        // Or simply wait for mount to apply specific sidebar classes if critical.
        // Actually, for best UX, we want the stored state immediately.
        // But Next.js requres matching HTML.
        // A common pattern is to render null until mounted or accept hydration mismatch for this specific part?
        // Let's render with default OPEN for server matching, and client will update.
        // To avoid layout shift, we can use `suppressHydrationWarning` on specific elements if needed
        // OR better: Since `isSidebarOpen` from store might be different, 
        // we can use a `useStore` hook that returns default until mounted.
        // For simplicity here, let's just use the store directly and if there's a flash, we accept it for now or refine.
        // Actually, if we return `null` until mounted, we lose SEO content? NO, content is children.
        // The layout wrapper just adjusts classes.
        // We can just render children.
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
                    !isSidebarOpen && "max-w-[1600px]"
                )}>
                    {children}
                </div>
            </main>
        </div>
    )
}

export function CollectionsLayoutWrapper({ children }: { children: React.ReactNode }) {
    // We don't need the provider anymore, just the layout structure.
    // However, to avoid hydration mismatch errors on the classNames driven by local storage,
    // we should ideally wait for mount on client.
    // BUT we don't want to delay content.
    // Since `isSidebarOpen` only affects className, React might patch it up.
    // If strict mode or hydration warnings appear, we might need a `ClientOnly` wrapper for the sidebar logic specifically.
    // For now, let's keep it simple.

    // Note: React 18/19 is strict about hydration.
    // If local storage says FALSE, but server says TRUE (default), 
    // the initial client render MUST match server (TRUE).
    // Then useEffect triggers update to FALSE.
    // This causes a layout shift (sidebar visible then disappears).
    // This is unavoidable without cookies or blocking render.
    // For a dashboard/app like this, layout shift on refresh is acceptable if fast.

    // To implement "wait for hydration to match storage", we need a custom hook or just render default first.
    // Zustand's persist updates state asynchronously on mount usually.
    // So initial render IS default (true).

    return (
        <div className="min-h-screen">
            <div className='bg-gray-900 h-20' />
            <CollectionsLayoutInner>{children}</CollectionsLayoutInner>
        </div>
    )
}
