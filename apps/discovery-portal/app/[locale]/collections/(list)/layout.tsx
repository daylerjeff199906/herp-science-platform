'use client'

import { CollectionsFilters } from "@/components/collections/CollectionsFilters"


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className='bg-gray-900 h-20' />
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-72 lg:fixed lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto p-4 lg:p-6">
          <CollectionsFilters />
        </aside>
        <main className="flex-1 lg:ml-72 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
