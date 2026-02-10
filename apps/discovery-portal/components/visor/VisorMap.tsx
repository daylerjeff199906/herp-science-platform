'use client'

import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Individual } from '@repo/shared-types'
import { Eye, MapPin, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

// Fix for default marker icon using local imports
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: (icon as any).src || (icon as unknown as string),
    shadowUrl: (iconShadow as any).src || (iconShadow as unknown as string),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
})

// Custom Icon for Clusters
const createClusterIcon = (count: number) => {
    return L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold border-2 border-white shadow-lg text-sm">${count}</div>`,
        className: 'custom-cluster-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    })
}

interface VisorMapProps {
    items: Individual[]
}

function MapController({ items }: { items: Individual[] }) {
    const map = useMap()

    // Fit bounds to items on load
    React.useEffect(() => {
        const validItems = items.filter(i => i.ocurrence?.event?.latitude && i.ocurrence?.event?.longitude)
        if (validItems.length > 0) {
            const group = new L.FeatureGroup(
                validItems.map(i => L.marker([
                    Number(i.ocurrence.event.latitude),
                    Number(i.ocurrence.event.longitude)
                ] as [number, number]))
            )
            const bounds = group.getBounds()
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] })
            }
        }
    }, [items, map])

    return null
}

export default function VisorMap({ items }: VisorMapProps) {
    const t = useTranslations('Common')

    // Group items by location (simple clustering for exact matches)
    const clusters = useMemo(() => {
        const groups: Record<string, Individual[]> = {}
        items.forEach(item => {
            const lat = item.ocurrence?.event?.latitude
            const lng = item.ocurrence?.event?.longitude

            if (lat && lng) {
                const key = `${lat},${lng}`
                if (!groups[key]) groups[key] = []
                groups[key].push(item)
            }
        })
        return Object.values(groups)
    }, [items])

    return (
        <div className="h-[calc(100vh-200px)] w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 z-0 relative">
            <MapContainer
                center={[-9.19, -75.015]} // Peru center roughly
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapController items={items} />

                {clusters.map((group, idx) => {
                    if (group.length === 0) return null;

                    const firstItem = group[0]
                    if (!firstItem?.ocurrence?.event?.latitude || !firstItem?.ocurrence?.event?.longitude) return null

                    const lat = Number(firstItem.ocurrence.event.latitude)
                    const lng = Number(firstItem.ocurrence.event.longitude)
                    const position: [number, number] = [lat, lng]
                    const isCluster = group.length > 1

                    return (
                        <Marker
                            key={idx}
                            position={position}
                            icon={isCluster ? createClusterIcon(group.length) : DefaultIcon}
                        >
                            <Popup className="min-w-[300px]">
                                <div className="p-2 max-h-[300px] overflow-y-auto">
                                    {isCluster ? (
                                        <>
                                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 sticky top-0 bg-white dark:bg-gray-950 pb-2 border-b z-10">
                                                <MapPin className="w-5 h-5 text-orange-500" />
                                                {group.length} Especies en este punto
                                            </h3>
                                            <div className="space-y-4">
                                                {group.map((item) => (
                                                    <div key={item.id} className="flex gap-3 border-b pb-3 last:border-0 border-gray-100 dark:border-gray-800">
                                                        {/* Thumbnail */}
                                                        <div className="relative w-16 h-16 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                                                            <Image
                                                                src={item.files.images?.[0]?.name || '/placeholder.png'}
                                                                alt={item.species?.scientificName || 'Species'}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                                {item.species?.genus?.family?.name || 'Taxonomy'}
                                                            </p>
                                                            <p className="font-bold text-sm truncate" title={item.species?.scientificName}>
                                                                {item.species?.scientificName}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate mb-1">
                                                                {item.species?.commonName || 'Sin nombre común'}
                                                            </p>
                                                            <Link target='_blank' href={`/collections/${item.id}`} className="inline-flex items-center text-xs font-medium text-primary hover:underline gap-1">
                                                                Ver detalle <ArrowRight className="w-3 h-3" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Thumbnail */}
                                            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                                <Image
                                                    src={firstItem.files.images?.[0]?.name || '/placeholder.png'}
                                                    alt={firstItem.species?.scientificName || 'Species'}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 300px"
                                                />
                                                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                    {firstItem.code}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                                    {firstItem.species?.genus?.family?.name || 'Taxonomy'}
                                                </p>
                                                <h3 className="font-bold text-lg leading-tight mb-1">
                                                    {firstItem.species?.scientificName}
                                                </h3>
                                                {firstItem.species?.commonName && (
                                                    <p className="text-sm text-gray-500 italic">
                                                        {firstItem.species.commonName}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-2">
                                                <Link
                                                    href={`/collections/${firstItem.id}`}
                                                    className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                    Ver ficha completa
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}
