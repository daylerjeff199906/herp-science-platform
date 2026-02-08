'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// Fix for default marker icon in Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: (icon as any).src || (icon as unknown as string),
    shadowUrl: (iconShadow as any).src || (iconShadow as unknown as string),
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface IndividualMapComponentProps {
    lat: number
    lng: number
    popupText?: string
}

export default function IndividualMapComponent({ lat, lng, popupText }: IndividualMapComponentProps) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={8}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={[lat, lng]}
                icon={DefaultIcon}
            >
                {popupText && <Popup>{popupText}</Popup>}
            </Marker>
        </MapContainer>
    )
}
