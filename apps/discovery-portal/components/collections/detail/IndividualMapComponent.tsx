'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: (icon as any).src || (icon as unknown as string),
    shadowUrl: (iconShadow as any).src || (iconShadow as unknown as string),
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

interface IndividualMapComponentProps {
    lat: number
    lng: number
    popupText?: string
}

export default function IndividualMapComponent({ lat, lng, popupText }: IndividualMapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)

    useEffect(() => {
        if (!mapRef.current) return

        // Cleanup existing map if it exists (handles Strict Mode double-mount)
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
            mapInstanceRef.current = null
        }

        try {
            // Initialize map
            const map = L.map(mapRef.current, {
                scrollWheelZoom: false
            }).setView([lat, lng], 8)

            mapInstanceRef.current = map

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map)

            const marker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(map)

            if (popupText) {
                marker.bindPopup(popupText)
            }
        } catch (error) {
            console.error('Error initializing map:', error)
        }

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [lat, lng, popupText])

    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} className="z-0" />
}
