'use client'

import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'

export function PortalServices() {
    const t = useTranslations('Home.services')

    const cards = [
        {
            id: 'search',
            title: t('cards.search.title'),
            description: t('cards.search.description'),
        },
        {
            id: 'collections',
            title: t('cards.collections.title'),
            description: t('cards.collections.description'),
        },
        {
            id: 'actions',
            title: t('cards.data.title'),
            description: t('cards.data.description'),
            isRoundedCorner: true, // Special styling for top-right card
        },
        {
            id: 'maps',
            title: t('cards.maps.title'),
            description: t('cards.maps.description'),
        },
        {
            id: 'publications',
            title: t('cards.publications.title'),
            description: t('cards.publications.description'),
        },
    ]

    return (
        <section className="py-20 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="mb-12">
                    <span className="text-gray-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
                        {t('tag')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light text-slate-700 leading-tight">
                        {t('title')} <br />
                        <span className="font-normal">{t('title2')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            className={`
                relative p-8 border-gray-200 min-h-[320px] flex flex-col justify-between group transition-colors hover:border-emerald-500/50
                border-t border-l 
                ${(index + 1) % 3 === 0 ? 'lg:border-r' : ''} /* Right border for items 3, 6 (on desktop) */
                ${index === 1 ? 'md:border-r lg:border-r-0' : ''} /* Mobile/Tablet borders */
                ${index === 4 ? 'border-b md:border-b-0 lg:border-b' : ''}
                ${index >= 3 ? 'border-b' : ''} /* Bottom border for bottom row */
                
                /* Specific rounded corner for 3rd item */
                ${card.isRoundedCorner ? 'lg:rounded-tr-[5rem]' : ''}
              `}
                        >
                            <div>
                                <h3 className="text-2xl font-light text-slate-700 mb-4">{card.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
                            </div>

                            <div className="mt-8">
                                <div className="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Last Card (Solid Color Block) */}
                    <div className="bg-[#8CBF3F] p-8 min-h-[320px] flex flex-col justify-between rounded-bl-[0] lg:rounded-bl-[5rem] lg:col-start-3 lg:row-start-2 border-t border-b border-l lg:border-r-0 border-[#8CBF3F]">
                    </div>
                </div>
            </div>
        </section>
    )
}
