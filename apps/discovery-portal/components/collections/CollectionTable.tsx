'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ROUTES } from '@/config/routes'
import { Individual } from '@repo/shared-types'
import { Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CollectionImagePlaceholder } from './CollectionImagePlaceholder'

interface CollectionTableProps {
    data: Individual[]
}

export function CollectionTable({ data }: CollectionTableProps) {
    const tCollections = useTranslations('Collections')
    const tCommon = useTranslations('Common')

    if (data.length === 0) {
        return <div className="p-8 text-center text-gray-500">{tCommon('noRecords')}</div>
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-24">{tCollections('image')}</th>
                            <th className="px-6 py-4">{tCollections('scientificName')}</th>
                            <th className="px-6 py-4">{tCollections('commonName')}</th>
                            <th className="px-6 py-4">{tCollections('family')}</th>
                            <th className="px-6 py-4">{tCollections('location')}</th>
                            <th className="px-6 py-4">{tCollections('museum')}</th>
                            <th className="px-6 py-4">{tCollections('forestType')}</th>
                            <th className="px-6 py-4">{tCollections('date')}</th>
                            <th className="px-6 py-4 text-center">{tCollections('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.map((item) => {
                            const imageUrl = item.files.images?.[0]?.name
                            const scientificName = item.species?.scientificName || tCommon('noIdentification')
                            const commonName = item.species?.commonName || '-'
                            const familyName = item.species?.genus?.family?.name || '-'
                            const location = item.ocurrence?.event?.locality?.name || '-'
                            const date = item.ocurrence?.event?.date
                                ? new Date(item.ocurrence.event.date).toLocaleDateString()
                                : '-'
                            const museum = item.museum?.name || '-'
                            const forestType = item.forestType?.name || '-'

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs">
                                    <td className="px-6 py-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-transparent dark:border-gray-800">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={scientificName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <CollectionImagePlaceholder />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium italic">
                                        {scientificName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {commonName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {familyName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[150px] line-clamp-2" title={location}>
                                            {location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[150px] line-clamp-2" title={museum}>
                                            {museum}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[150px] line-clamp-2" title={forestType}>
                                            {forestType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {date}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            href={`${ROUTES.COLLECTIONS}/${item.id}`}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                                            title={tCommon('viewDetails')}
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
