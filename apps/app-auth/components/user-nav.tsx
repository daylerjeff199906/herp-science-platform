'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { Button } from '@repo/ui/components/ui/button'
import { User, LogOut, Settings, LayoutDashboard, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserNavProps {
    email: string | undefined
    locale: string
    signOutLabel: string
}

export function UserNav({ email, locale, signOutLabel }: UserNavProps) {
    const router = useRouter()

    const userAlias = email?.split('@')[0] || 'User'
    const initials = userAlias.substring(0, 2).toUpperCase()

    const handleSignOut = async () => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            
            router.refresh()
            router.push(`/${locale}/login`)
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 hover:border-primary/40 p-0 overflow-hidden transition-all duration-300 ring-offset-background focus-visible:ring-2 focus-visible:ring-primary shadow-sm group"
                >
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <span className="relative text-xs font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                        {initials}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 shadow-xl border-white/10 dark:border-white/5" align="end" sideOffset={12}>
                <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="text-xs font-bold text-primary">{initials}</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold leading-none text-foreground capitalize">{userAlias}</p>
                                <p className="text-[10px] leading-none text-muted-foreground mt-1 truncate max-w-[140px]">
                                    {email}
                                </p>
                            </div>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 opacity-50" />
                
                <DropdownMenuItem asChild className="p-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary rounded-md group">
                    <Link href={`/${locale}/launcher`} className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        <span className="text-xs font-medium">Lanzador</span>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="p-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary rounded-md group">
                    <div className="flex items-center gap-3 w-full">
                        <User className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        <span className="text-xs font-medium">Mi Perfil</span>
                        <ExternalLink className="h-2 w-2 ml-auto text-muted-foreground opacity-50" />
                    </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-2 cursor-pointer transition-colors focus:bg-primary/10 focus:text-primary rounded-md group">
                    <div className="flex items-center gap-3 w-full">
                        <Settings className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        <span className="text-xs font-medium">Configuración</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 opacity-50" />

                <DropdownMenuItem
                    className="p-2 cursor-pointer text-red-500 focus:text-white focus:bg-red-500 transition-all duration-200 rounded-md group"
                    onSelect={handleSignOut}
                >
                    <div className="flex items-center gap-3 w-full">
                        <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-xs font-semibold">{signOutLabel}</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
