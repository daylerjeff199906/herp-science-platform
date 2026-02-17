'use client'

import { BadgeCheck, Bell, ChevronsUpDown, LogOut, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { signout } from '@/app/[locale]/(auth)/login/actions'

interface NavUserProps {
  user?: {
    name: string
    email: string
    avatar: string | null
  } | null
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const t = useTranslations('Navigation')
  const params = useParams()
  const locale = params.locale as string

  // Default user data if not provided
  const userData = user || {
    name: 'Usuario',
    email: 'usuario@iiap.gob.pe',
    avatar: null,
  }

  // Helper to build URL with locale
  const buildUrl = (url: string) => {
    if (url.startsWith('http')) return url
    return `/${locale}${url}`
  }

  const handleSignOut = async () => {
    await signout()
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name || name === 'Usuario') return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.avatar || ''} alt={userData.name} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {userData.avatar ? (
                    getInitials(userData.name)
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userData.avatar || ''}
                    alt={userData.name}
                  />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {userData.avatar ? (
                      getInitials(userData.name)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userData.name}
                  </span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={buildUrl('/settings/profile')}>
                  <BadgeCheck />
                  {t('settingsProfile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={buildUrl('/settings/notifications')}>
                  <Bell />
                  {t('notifications')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
