import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import { Individual } from '@repo/shared-types'

import { ArrowRight, Calendar, MapPin, Ruler, Activity } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CollectionImagePlaceholder } from './CollectionImagePlaceholder'

interface CollectionCardProps {
    item: Individual
    view: 'grid' | 'list' | 'gallery'
}

export function CollectionCard({ item, view }: CollectionCardProps) {
    const tCommon = useTranslations('Common')
    // Logic to determine image URL
    const imageUrl = item.files.images?.[0]?.name || '/images/placeholder.jpg'

    // Accessing names and details
    const scientificName = item.species?.scientificName || tCommon('noIdentification')
    const commonName = item.species?.commonName || tCommon('noCommonName')
    const familyName = item.species?.genus?.family?.name || ''
    const location = item.ocurrence?.event?.locality?.name || tCommon('unknownLocation')
    const date = item.ocurrence?.event?.date || item.createdAt
    const sex = item.sex?.name || tCommon('unknown')
    const activity = item.activity?.name || tCommon('notRegistered')
    const description = item.species?.description || tCommon('noDescription')

    if (view === 'list') {
        return (
            <div className="group flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 transition-all duration-300">
                {/* Image Section */}
                <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.files.images?.[0]?.name ? (
                        <Image
                            src={item.files.images[0].name}
                            alt={scientificName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <CollectionImagePlaceholder />
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 gap-3 py-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider mb-1 block">
                                {familyName}
                            </span>
                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">
                                {scientificName}
                            </h3>
                            <p className="text-gray-500 font-medium italic">
                                {commonName}
                            </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-primary whitespace-nowrap">
                            {sex}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="truncate" title={location}>{location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>{new Date(date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>{activity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>SVL: {item.svl}mm</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50 md:border-none">
                        <div className="text-xs text-gray-400">
                            {tCommon('registered')}: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <button className="text-sm font-medium text-primary flex items-center gap-1 group/btn hover:underline">
                            {tCommon('viewDetails')}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Grid View - Redesigned to match requested style
    if (view === 'grid') {
        const individual = item; // Alias to match user's snippet variable name
        return (
            <div className="h-full flex flex-col group cursor-pointer">
                {/* Image Card */}
                <div className="relative h-64 w-full overflow-hidden rounded-xl mb-6 bg-slate-100">
                    <Link href={`${ROUTES.COLLECTIONS}/${individual.id}`}>
                        {individual.files.images &&
                            individual.files.images.length > 0 ? (
                            <Image
                                src={
                                    individual.files.images[0]?.name ||
                                    '/placeholder.png'
                                }
                                alt={individual.species.scientificName}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <CollectionImagePlaceholder />
                        )}
                    </Link>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                    <Link href={`${ROUTES.COLLECTIONS}/${individual.id}`}>
                        <h3 className="text-xl font-medium text-slate-900 mb-3 leading-snug group-hover:text-slate-600 transition-colors">
                            {individual.species.scientificName}
                            <span className="block text-slate-500 text-lg font-normal mt-1">
                                {individual.species.commonName}
                            </span>
                        </h3>
                    </Link>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {individual.species.description ||
                            tCommon('noDescription')}
                    </p>

                    <div className="mt-auto">
                        <Link
                            href={`${ROUTES.COLLECTIONS}/${individual.id}`}
                            className="flex items-center gap-3 group/link"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 transition-colors duration-300 group-hover:bg-slate-900 group-hover:border-slate-900">
                                <ArrowRight className="h-4 w-4 text-stone-600 transition-colors duration-300 group-hover:text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-900 transition-all duration-300 group-hover:font-bold">
                                {tCommon('readMore')}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Gallery View (Keep similar to old grid but cleaner, or simpler)
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl bg-white border hover:shadow-xl transition-all duration-300",
            "aspect-square"
        )}>
            {item.files.images?.[0]?.name ? (
                <Image
                    src={item.files.images[0].name}
                    alt={scientificName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            ) : (
                <CollectionImagePlaceholder />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">
                    {scientificName}
                </h3>
                <p className="text-gray-200 text-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {commonName}
                </p>
            </div>
        </div>
    )
}

