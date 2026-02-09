import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CollectionsState {
    isSidebarOpen: boolean
    toggleSidebar: () => void
    setSidebarOpen: (isOpen: boolean) => void
}

export const useCollectionsStore = create<CollectionsState>()(
    persist(
        (set) => ({
            isSidebarOpen: true,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
        }),
        {
            name: 'collections-sidebar-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
