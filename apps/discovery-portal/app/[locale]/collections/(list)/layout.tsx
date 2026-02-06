'use client'

import { CollectionsFilters } from "@/components/collections/CollectionsFilters"


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className='bg-gray-900 h-20' />
      <div>
        <aside
          className="w-72 fixed top-20 h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <CollectionsFilters />
        </aside>
        <main className="ml-72 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}
