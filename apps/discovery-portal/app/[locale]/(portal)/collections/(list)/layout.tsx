'use client'
import { useState } from 'react'
import { Filter } from 'lucide-react'

// Simple mobile drawer or collapsible could be added here
export default function Layout({ children }: { children: React.ReactNode }) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Filter Section (Top Bar) */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          {/* <HeaderFilterSection /> */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Aside / Sidebar */}
          <aside className={`
            hidden lg:block w-64 xl:w-72 flex-shrink-0 space-y-6
          `}>
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
              {/* <IndividualsFilters /> */}
            </div>
          </aside>

          {/* Mobile Filter Toggle (Visible only on mobile) */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border rounded-lg p-3 font-medium text-gray-700 shadow-sm"
            >
              <Filter size={20} />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>

            {showFilters && (
              <div className="mt-4 bg-white p-4 rounded-xl border shadow-lg animate-in fade-in slide-in-from-top-4">
                {/* <IndividualsFilters /> */}
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
