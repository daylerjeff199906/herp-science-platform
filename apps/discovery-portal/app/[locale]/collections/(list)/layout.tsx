'use client'

import { CollectionsFilters } from "@/components/collections/CollectionsFilters"


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen">
      <div className='bg-gray-900 h-20' />
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 lg:fixed lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto">
          <CollectionsFilters />
        </aside>
        <main className="flex-1 lg:ml-80 py-4">
          <div className="flex flex-col gap-6 w-full container mx-auto px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
