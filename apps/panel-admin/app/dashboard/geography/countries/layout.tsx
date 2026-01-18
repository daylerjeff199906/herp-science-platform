import { SidebarInsetCustom } from '@/components/miscellaneous/sidebar-inset'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInsetCustom currentPage="Países">
      {children}
    </SidebarInsetCustom>
  )
}
