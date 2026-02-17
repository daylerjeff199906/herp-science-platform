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
    const t = useTranslations('Profile')
    const tMenu = useTranslations('Profile.menu')
    const tDesc = useTranslations('Profile.menuDescriptions')

    const items = [
        {
            title: tMenu('general'),
            description: tDesc('general'),
            url: `/${locale}/dashboard/profile`,
            icon: LayoutGrid,
        },
        {
            title: tMenu('profile'),
            description: tDesc('profile'),
            url: `/${locale}/dashboard/profile/public`,
            icon: User,
        },
        {
            title: tMenu('company'),
            description: tDesc('company'),
            url: `/${locale}/dashboard/profile/academic`,
            icon: Building2,
        },
        {
            title: tMenu('notifications'),
            description: tDesc('notifications'),
            url: `/${locale}/dashboard/profile/notifications`,
            icon: Bell,
        },
        {
            title: tMenu('security'),
            description: tDesc('security'),
            url: `/${locale}/dashboard/profile/security`,
            icon: Shield,
        },
    ]

    return (
        <Sidebar collapsible="none" className="min-w-[280px] border-none bg-transparent" {...props}>
            <SidebarHeader className="px-4 py-2">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Menu</h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2 px-2">
                            {items.map((item) => {
                                // For the root profile path, require exact match to avoid highlighting it for sub-routes
                                const isRootProfile = item.url.endsWith('/dashboard/profile')
                                const isActive = isRootProfile
                                    ? pathname === item.url
                                    : pathname.startsWith(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className="w-full h-auto py-3 justify-start items-start gap-3 rounded-lg px-3 transition-colors hover:bg-muted/50 data-[active=true]:bg-muted data-[active=true]:text-primary"
                                        >
                                            <Link href={item.url} className="flex w-full items-start gap-3">
                                                <item.icon className="mt-0.5 h-5 w-5 shrink-0" />
                                                <div className="flex flex-col gap-1 text-left w-full overflow-hidden">
                                                    <span className="text-sm font-medium leading-none block truncate w-full">
                                                        {item.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-normal line-clamp-2 w-full whitespace-normal">
                                                        {item.description}
                                                    </span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
