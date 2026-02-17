"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
    LayoutGrid,
    User,
    Building2,
    Bell,
    Shield
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader
} from "@/components/ui/sidebar"

interface ProfileSidebarProps extends React.ComponentProps<typeof Sidebar> {
    locale: string
}

export function ProfileSidebar({ locale, ...props }: ProfileSidebarProps) {
    const pathname = usePathname()
    const t = useTranslations('Profile.menu')

    const items = [
        {
            title: t('general'),
            url: "/profile/general",
            icon: LayoutGrid,
        },
        {
            title: t('profile'), // Public Profile URL? Or Edit Profile Details? Assuming user wants to view it.
            // For now, mapping to /profile/view or similar if it exists, or just a placeholder.
            // Given context, maybe just another section. I'll make it /profile/public-preview for now.
            url: "/profile/public",
            icon: User,
        },
        {
            title: t('company'), // Mapping to Academic as requested
            url: "/profile/academic",
            icon: Building2,
        },
        {
            title: t('notifications'),
            url: "/profile/notifications",
            icon: Bell,
        },
        {
            title: t('security'),
            url: "/profile/security",
            icon: Shield,
        },
    ]

    return (
        <Sidebar collapsible="none" className="min-w-[240px] border-r bg-background text-foreground" {...props}>
            <SidebarHeader className="border-b p-4">
                <h2 className="text-lg font-semibold text-foreground">MENU</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.includes(item.url)}
                                        className="w-full justify-start gap-3 px-3 py-6 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
