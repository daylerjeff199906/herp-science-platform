'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CollectionsLayoutContextType {
    isSidebarOpen: boolean
    toggleSidebar: () => void
    setIsSidebarOpen: (isOpen: boolean) => void
}

const CollectionsLayoutContext = createContext<CollectionsLayoutContextType | undefined>(undefined)

export function CollectionsLayoutProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

    return (
        <CollectionsLayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, setIsSidebarOpen }}>
            {children}
        </CollectionsLayoutContext.Provider>
    )
}

export function useCollectionsLayout() {
    const context = useContext(CollectionsLayoutContext)
    if (context === undefined) {
        throw new Error('useCollectionsLayout must be used within a CollectionsLayoutProvider')
    }
    return context
}
