'use client'

import { LayoutGrid, List, Map, Image as ImageIcon } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export type ViewType = 'grid' | 'list' | 'map' | 'gallery'

export function ViewToggler() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentView = (searchParams.get('view') as ViewType) || 'grid'

    const onViewChange = (view: ViewType) => {
        const params = new URLSearchParams(searchParams)
        params.set('view', view)
        router.push(`${pathname}?${params.toString()}`)
    }

    const buttons = [
        { id: 'grid', icon: LayoutGrid, label: 'Grid' },
        { id: 'list', icon: List, label: 'Lista' },
        { id: 'gallery', icon: ImageIcon, label: 'Galería' },
        { id: 'map', icon: Map, label: 'Mapa' },
    ] as const

    return (
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            {buttons.map((btn) => (
                <button
                    key={btn.id}
                    onClick={() => onViewChange(btn.id)}
                    className={cn(
                        'p-2 rounded-md transition-all duration-200 text-gray-500 hover:text-gray-900',
                        currentView === btn.id && 'bg-white text-primary shadow-sm'
                    )}
                    title={btn.label}
                >
                    <btn.icon size={18} />
                </button>
            ))}
        </div>
    )
}
