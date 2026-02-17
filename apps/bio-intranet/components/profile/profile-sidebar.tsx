"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
    LayoutGrid,
    User,
    Building2,
    Bell,
    Shield,
    GraduationCap,
    Globe,
    Award,
    BadgeCheck
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
    const tLang = useTranslations('Profile.language')

    const tProf = useTranslations('Profile.professionalActivity')
    const tCert = useTranslations('Profile.certifications')

    const items = [
        {
            title: tMenu('general'),
            description: tDesc('general'),
            url: `/${locale}/dashboard/profile`,
            icon: LayoutGrid,
        },
        {
            title: tMenu('education'),
            description: tDesc('education'),
            url: `/${locale}/dashboard/profile/education`,
            icon: GraduationCap,
        },
        {
            title: tMenu('experience'),
            description: tDesc('experience'),
            url: `/${locale}/dashboard/profile/employment`,
            icon: Building2,
        },
        {
            title: tProf('title'),
            description: tProf('description'),
            url: `/${locale}/dashboard/profile/professional-activities`,
            icon: Award,
        },
        {
            title: tCert('title'),
            description: tCert('description'),
            url: `/${locale}/dashboard/profile/certifications`,
            icon: BadgeCheck,
        },
        {
            title: tLang('title'),
            description: tLang('description'),
            url: `/${locale}/dashboard/profile/languages`,
            icon: Globe,
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
