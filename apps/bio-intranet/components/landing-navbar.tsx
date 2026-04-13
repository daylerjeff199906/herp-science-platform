"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { LogOut, LayoutDashboard, User, Settings, Bell } from "lucide-react"
import { signout } from "@/actions/auth"

export function LandingNavbar() {
    const locale = useLocale()
    const t = useTranslations()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, avatar_url')
                    .eq('auth_id', authUser.id)
                    .maybeSingle()

                setUser({
                    id: authUser.id,
                    email: authUser.email,
                    name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || authUser.email?.split('@')[0],
                    avatar: profile?.avatar_url || null
                })
            }
        }
        fetchUser()
    }, [])

    const handleSignOut = async () => {
        await signout(window.location.pathname, locale)
        window.location.reload()
    }

    return (
        <header className="fixed top-0 z-50 w-full transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left side Links */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href={`/${locale}`} className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-foreground">
                        Inicio
                    </Link>
                    <Link href="#" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-foreground">
                        Proyectos
                    </Link>
                    <Link href="#" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors text-foreground">
                        Explora
                    </Link>
                </nav>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link href={`/${locale}`} className="flex flex-col items-center">
                        <span className="text-xl font-black tracking-tighter text-primary">IIAP</span>
                    </Link>
                </div>

                {/* Right side Icons / Auth */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={user.avatar || ""} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${locale}/dashboard`} className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Panel de Control</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${locale}/dashboard/profile`} className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Mi Perfil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href={`/${locale}/login`}>
                                <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted/50">
                                    Entrar
                                </Button>
                            </Link>
                            <Link href={`/${locale}/signup`}>
                                <Button size="sm" className="text-xs font-bold uppercase tracking-widest rounded-full px-6">
                                    Unirse
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
