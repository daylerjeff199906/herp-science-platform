'use client'
import { useGeneralCount } from '@repo/networking'
import { useTranslations } from 'next-intl'
import { Loader2, ArrowRight } from 'lucide-react'
import { OrderCount } from '@repo/shared-types'
import { Skeleton } from '@repo/ui/components/ui/skeleton'

function StatCard({ value, label, subLabel }: { value: number; label: string; subLabel?: string }) {
    return (
        <div className="bg-[#1a1a1a] p-8 rounded-[1rem] border border-white/5 relative group hover:border-[#ADDE60]/30 transition-all duration-500 h-full min-h-[200px] flex flex-col justify-between">
            <div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-4 tracking-tight flex items-start">
                    {value.toLocaleString()}
                    <span className="text-[#ADDE60] text-4xl mt-1 ml-1">+</span>
                </div>
                <div className="text-gray-400 font-medium leading-tight max-w-[80%] text-sm md:text-base">
                    {label}
                </div>
                {subLabel && (
                    <div className="text-xs text-gray-600 mt-2 uppercase tracking-widest">{subLabel}</div>
                )}
            </div>

            <div className="absolute bottom-6 right-6 text-gray-700 group-hover:text-[#ADDE60] transition-colors duration-300">
                <ArrowRight className="w-6 h-6" />
            </div>
        </div>
    )
}

function TaxonColumn({ title, data, total }: { title: string; data: any; total: number }) {
    const orders = data.orders || []

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-gray-800 pb-6 relative">
                <h3 className="text-3xl font-light text-white">{title}</h3>
                <span className="text-4xl font-bold text-[#ADDE60]">{total.toLocaleString()}</span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-800"></div>
                <div className="absolute bottom-0 left-0 w-20 h-[1px] bg-[#ADDE60]"></div>
            </div>

            <div className="space-y-3">
                {orders.map((order: OrderCount, idx: number) => {
                    const orderName = Object.keys(order).find(k => k !== 'families') || 'Unknown';
                    const count = order[orderName as keyof typeof order] as number;

                    return (
                        <div key={idx} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-center group hover:bg-[#252525] transition-colors border border-white/5 hover:border-gray-700">
                            <span className="text-gray-300 text-lg font-light group-hover:text-white transition-colors">{orderName}</span>
                            <span className="text-sm bg-[#ADDE60]/10 text-[#ADDE60] px-3 py-1 rounded-full border border-[#ADDE60]/20 font-mono font-medium">
                                {count.toLocaleString()}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function StatsSkeleton() {
    return (
        <>
            {/* Global Counters Skeleton */}
            <div className="grid md:grid-cols-3 gap-6 mb-24">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#1a1a1a] p-8 rounded-[1rem] border border-white/5 min-h-[200px] flex flex-col justify-between">
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-3/4 bg-gray-800" />
                            <Skeleton className="h-4 w-1/2 bg-gray-800" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full self-end bg-gray-800" />
                    </div>
                ))}
            </div>

            {/* Breakdown Columns Skeleton */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-8">
                        <div className="flex items-end justify-between border-b border-gray-800 pb-6 relative">
                            <Skeleton className="h-10 w-40 bg-gray-800" />
                            <Skeleton className="h-10 w-20 bg-gray-800" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((j) => (
                                <Skeleton key={j} className="h-16 w-full rounded-lg bg-gray-800" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export function StatsSection() {
    const t = useTranslations('Home.stats')
    const { data: stats, isLoading, error } = useGeneralCount()

    return (
        <section className="py-24 bg-[#111111] border-t border-white/5 relative">
            <div className="container px-4 md:px-6 mx-auto">

                {/* Header - Layout matched to reference image */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24 items-start">

                    {/* Left Side: Tag + Title */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[#ADDE60] text-lg font-bold">+</span>
                            <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">
                                {t('tag')}
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.9] tracking-tight">
                            {t('title')}
                        </h2>
                    </div>

                    {/* Right Side: Description with Decorative Element */}
                    <div className="flex gap-6 lg:pt-4">
                        {/* Decorative Green Cross/Plus */}
                        <div className="relative mt-2 shrink-0">
                            <div className="w-[1px] h-12 bg-[#ADDE60] absolute top-0 left-1/2 -translate-x-1/2"></div>
                            <div className="h-[1px] w-12 bg-[#ADDE60] absolute top-6 left-1/2 -translate-x-1/2"></div>
                        </div>

                        {/* Description Text */}
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
                            {t('description')}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <StatsSkeleton />
                ) : error || !stats ? (
                    <div className="py-12 text-center text-gray-500">
                        No se pudieron cargar las estadísticas.
                    </div>
                ) : (
                    <>
                        {/* Global Counters */}
                        <div className="grid md:grid-cols-3 gap-6 mb-24">
                            <StatCard label={t('total_records')} value={stats.allIndividuals} subLabel="IIAP COLLECTION" />
                            <StatCard label={t('published')} value={stats.publishedIndividuals} subLabel="SCIENTIFIC DATA" />
                            <StatCard label={t('species_count')} value={stats.publishedAmphibians.total + stats.publishedReptiles.total} subLabel="ACTIVE SPECIMENS" />
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
                    </>
                )}

            </div>
        </section>
    )
}
