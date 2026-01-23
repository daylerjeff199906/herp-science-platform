import Image from 'next/image'
import { cn } from '@/lib/utils'
// Placeholder type since we couldn't access strict types
interface CollectionItem {
    id: string | number
    scientificName?: string
    commonName?: string
    imageUrl?: string
    // Add other fields as they become apparent from the data
    [key: string]: any
}

interface CollectionCardProps {
    item: CollectionItem
    view: 'grid' | 'list' | 'gallery'
}

export function CollectionCard({ item, view }: CollectionCardProps) {
    // Logic to determine image URL - trying common patterns
    const imageUrl = item.imageUrl || item.image || item.thumbnail || '/images/placeholder.jpg'

    if (view === 'list') {
        return (
            <div className="flex gap-4 p-4 bg-white rounded-xl border hover:shadow-lg transition-all duration-300 group">
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                        src={imageUrl}
                        alt={item.scientificName || 'Collection Item'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {item.scientificName || 'Nombre Científico'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">
                        {item.commonName || 'Nombre Común'}
                    </p>
                    <div className="flex gap-2 mt-auto">
                        {/* Example tags/badges */}
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">ID: {item.id}</span>
                    </div>
                </div>
            </div>
        )
    }

    // Grid and Gallery view
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl bg-white border hover:shadow-xl transition-all duration-300",
            view === 'gallery' ? 'aspect-square' : 'aspect-[4/5]'
        )}>
            <Image
                src={imageUrl}
                alt={item.scientificName || 'Collection Item'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">
                    {item.scientificName || 'Nombre Científico'}
                </h3>
                <p className="text-gray-200 text-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {item.commonName || 'Nombre Común'}
                </p>
            </div>
        </div>
    )
}
