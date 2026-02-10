'use client'

import { CollectionsLayoutWrapper } from "@/components/collections/CollectionsLayoutWrapper"

export default function VisorLayout({ children }: { children: React.ReactNode }) {
    return (
        <CollectionsLayoutWrapper>
            {children}
        </CollectionsLayoutWrapper>
    )
}
