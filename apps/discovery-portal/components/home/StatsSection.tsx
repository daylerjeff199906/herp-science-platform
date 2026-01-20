'use client'
import { useGeneralCount } from '@repo/networking'
import { useTranslations } from 'next-intl'
import { Loader2, Layers, Search, Database } from 'lucide-react'
import { GeneralCounter, OrderCount } from '@repo/shared-types'

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#d4fc79]/10 text-[#d4fc79]">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{label}</div>
            </div>
        </div>
    )
}

function TaxonColumn({ title, data, total }: { title: string; data: any; total: number }) {
    const orders = data.orders || []

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-gray-800 pb-4">
                <h3 className="text-2xl font-light text-white">{title}</h3>
                <span className="text-3xl font-bold text-[#d4fc79]">{total.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
                {orders.map((order: OrderCount, idx: number) => {
                    // Extract the dynamic key that is not 'families'
                    const orderName = Object.keys(order).find(k => k !== 'families') || 'Unknown';
                    const count = order[orderName as keyof typeof order] as number;

                    return (
                        <div key={idx} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-center group hover:bg-[#252525] transition-colors">
                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{orderName}</span>
                            <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded group-hover:bg-[#d4fc79] group-hover:text-black transition-colors font-bold">
                                {count.toLocaleString()}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function StatsSection() {
    const t = useTranslations('Home.stats')
    const { data: stats, isLoading, error } = useGeneralCount()

    if (isLoading) {
        return (
            <section className="py-24 bg-[#111111] border-t border-gray-900 flex justify-center">
                <Loader2 className="w-8 h-8 text-[#d4fc79] animate-spin" />
            </section>
        )
    }

    if (error || !stats) {
        return null
    }

    return (
        <section className="py-24 bg-[#111111] border-t border-gray-900 relative">
            <div className="container px-4 md:px-6 mx-auto">

                {/* Header */}
                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <span className="text-[#d4fc79] font-medium uppercase tracking-widest text-sm mb-3 block">
                        {t('tag')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-gray-400">
                        {t('description')}
                    </p>
                </div>

                {/* Global Counters */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                    <StatCard label={t('total_records')} value={stats.allIndividuals} icon={Database} />
                    <StatCard label={t('published')} value={stats.publishedIndividuals} icon={Layers} />
                    <StatCard label={t('species_count')} value={stats.publishedAmphibians.total + stats.publishedReptiles.total} icon={Search} />
                    {/* Note: 'total' inside amphibians/reptiles seems to be Individuals count based on the interface provided? 
                Actually TaxonStats has 'total'. Assuming this is count of individuals in that taxon. 
                If user wants Species count, the API might not strictly provide it in this shape, but let's sum totals for now or just generic label. */}
                </div>

                {/* Breakdown Columns */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    <TaxonColumn
                        title={t('amphibians')}
                        data={stats.publishedAmphibians}
                        total={stats.publishedAmphibians.total}
                    />
                    <TaxonColumn
                        title={t('reptiles')}
                        data={stats.publishedReptiles}
                        total={stats.publishedReptiles.total}
                    />
                </div>

            </div>
        </section>
    )
}
