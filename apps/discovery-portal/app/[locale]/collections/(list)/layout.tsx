'use client'

import { CollectionsLayoutWrapper } from "@/components/collections/CollectionsLayoutWrapper"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CollectionsLayoutWrapper>
      {children}
    </CollectionsLayoutWrapper>
  )
}
