'use client'

import React, { useState, useEffect } from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { ExternalLink, Database, Globe, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@repo/ui'

interface ExternalDataHarvesterProps {
    individual: IndividualDetails
}

interface ExternalSource {
    id: string
    name: string
    icon: React.ElementType
    url: string
    apiUrl: string
    recordCount: number | null
    loading: boolean
    error: string | null
    color: string
}

export function ExternalDataHarvester({ individual }: ExternalDataHarvesterProps) {
    const t = useTranslations('Collections.Detail')
    const [sources, setSources] = useState<ExternalSource[]>([
        {
            id: 'gbif',
            name: 'GBIF',
            icon: Globe,
            url: `https://www.gbif.org/occurrence/search?scientific_name=${encodeURIComponent(individual.species.scientificName)}`,
            apiUrl: `https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(individual.species.scientificName)}&limit=0`,
            recordCount: null,
            loading: true,
            error: null,
            color: 'bg-green-50 text-green-700 border-green-200'
        },
        {
            id: 'inaturalist',
            name: 'iNaturalist',
            icon: Globe,
            url: `https://www.inaturalist.org/observations?taxon_name=${encodeURIComponent(individual.species.scientificName)}`,
            apiUrl: `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(individual.species.scientificName)}&per_page=0`,
            recordCount: null,
            loading: true,
            error: null,
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
    ])

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            // Helper to fetch and update a single source
            const fetchSource = async (index: number) => {
                const source = sources[index]
                if (!source) return

                try {
                    const res = await fetch(source.apiUrl)
                    if (!res.ok) throw new Error('Network response was not ok')
                    const data = await res.json()

                    if (isMounted) {
                        setSources(prev => prev.map((s, i) => {
                            if (i !== index) return s

                            let count = 0
                            if (s.id === 'gbif') {
                                count = data.count || 0
                            } else if (s.id === 'inaturalist') {
                                count = data.total_results || 0
                            }

                            return { ...s, recordCount: count, loading: false, error: null }
                        }))
                    }
                } catch (err) {
                    if (isMounted) {
                        setSources(prev => prev.map((s, i) => {
                            if (i !== index) return s
                            return { ...s, loading: false, error: 'Failed to fetch' }
                        }))
                    }
                }
            }

            // Fetch all sources in parallel
            sources.forEach((_, index) => fetchSource(index))
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [individual.species.scientificName])

    // Determine if we should show anything (if loading or found records)
    const hasData = sources.some(s => s.loading || (s.recordCount && s.recordCount > 0))

    if (!hasData) return null

    return (
        <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('externalData')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sources.map((source) => (
                    <div
                        key={source.id}
                        className={cn(
                            "rounded-lg border p-4 transition-all hover:shadow-md",
                            "bg-card border-border hover:border-primary/50"
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-full bg-muted text-muted-foreground", source.loading && "animate-pulse")}>
                                    <source.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{source.name}</h4>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {source.loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                                {t('harvesting')}
                                            </span>
                                        ) : source.error ? (
                                            <span className="text-destructive text-xs">{t('notFound') || 'Error'}</span>
                                        ) : (
                                            <span className="font-medium text-primary">
                                                {source.recordCount?.toLocaleString()} {t('record')}s
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-full"
                                title={source.id === 'gbif' ? t('viewOnGbif') : t('viewOnInaturalist')}
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1">
                * Comparando registros públicos disponibles globalmente con los datos de IIAP.
            </p>
        </div>
    )
}
