"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
import {
    LogOut,
    LayoutDashboard,
    User,
    Home,
    Building2,
    PlayCircle,
    LayoutGrid,
    Sun,
    Moon,
    Bell,
    UserPlus,
    LogIn
} from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { signout } from "@/actions/auth"
import { cn } from "@/lib/utils"

export function LandingNavbar() {
    const locale = useLocale()
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
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

    const navItems = [
        { icon: Home, label: "Inicio", href: `/${locale}` },
        { icon: Building2, label: "Instalaciones", href: `/${locale}/facilities` },
        { icon: PlayCircle, label: "Explora", href: `/${locale}/reels` },
        { icon: LayoutGrid, label: "Aplicaciones", href: `/${locale}/apps` },
    ]

    const isActive = (href: string) => {
        if (href === `/${locale}`) return pathname === href
        return pathname.includes(href)
    }

    if (!mounted) return null

    return (
        <>
            {/* Desktop Navbar */}
            <header className="fixed top-0 left-0 right-0 z-[60] w-full bg-background border-b border-border transition-all">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
                    
                    {/* Left: Logo & Full Name */}
                    <div className="flex-1 flex items-center">
                        <Link href={`/${locale}`} className="flex items-center gap-3 group">
                            <div className="h-10 w-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                                <img 
                                    src="/brands/logo-iiap.webp" 
                                    alt="IIAP Logo" 
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                            <div className="hidden lg:flex flex-col">
                                <span className="font-bold tracking-tighter text-sm uppercase text-foreground leading-none">IIAP</span>
                                <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-muted-foreground leading-none mt-0.5">Instituto de Investigaciones de la Amazonía Peruana</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Navigation Tabs (Facebook Style) */}
                    <nav className="hidden md:flex items-center h-full max-w-md w-full justify-around px-4">
                        {navItems.map((item) => {
                            const Active = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative h-full flex flex-col items-center justify-center px-8 transition-colors group",
                                        Active ? "text-primary" : "text-muted-foreground hover:bg-muted/50 rounded-xl my-1"
                                    )}
                                >
                                    <item.icon className={cn("h-6 w-6", Active && "fill-current")} />
                                    {Active && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                                    )}
                                    <div className="absolute top-[110%] bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold uppercase tracking-widest z-[70]">
                                        {item.label}
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex-1 flex items-center justify-end gap-2">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-9 w-9 hover:bg-muted"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        {user ? (
                            <>
                                <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full h-9 w-9 bg-muted/50">
                                    <Bell className="h-5 w-5" />
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={user.avatar || ""} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2" align="end" forceMount>
                                        <DropdownMenuLabel className="p-3">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-bold leading-none uppercase tracking-tight">{user.name}</p>
                                                <p className="text-[10px] leading-none text-muted-foreground font-bold">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup className="p-1">
                                            <DropdownMenuItem asChild className="rounded-xl cursor-not-allowed opacity-50">
                                                <div className="flex items-center p-2">
                                                    <LayoutDashboard className="mr-3 h-4 w-4" />
                                                    <span className="font-bold text-xs uppercase tracking-widest">Panel de Control</span>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="rounded-xl p-2">
                                                <Link href={`/${locale}/dashboard/profile`} className="cursor-pointer flex items-center">
                                                    <User className="mr-3 h-4 w-4" />
                                                    <span className="font-bold text-xs uppercase tracking-widest">Mi Perfil</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer rounded-xl p-2">
                                            <LogOut className="mr-3 h-4 w-4" />
                                            <span className="font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href={`/${locale}/login`}>
                                    <Button variant="ghost" size="sm" className="hidden sm:flex h-9 text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-muted/50 rounded-full px-4">
                                        <LogIn className="w-4 h-4 mr-2" /> Entrar
                                    </Button>
                                </Link>
                                <Link href={`/${locale}/signup`}>
                                    <Button size="sm" className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-full px-6">
                                        <UserPlus className="w-4 h-4 mr-2" /> Unirse
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation (Facebook Style) */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm">
                <nav className="flex items-center justify-around bg-background border border-border h-16 rounded-[2rem] px-4 overflow-hidden shadow-2xl">
                    {navItems.map((item) => {
                        const Active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex flex-col items-center justify-center p-2 transition-all",
                                    Active ? "text-primary scale-110" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6", Active && "fill-current")} />
                                {Active && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        className="absolute -bottom-1 h-1 w-1 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}
