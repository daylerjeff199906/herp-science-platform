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
import { User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserNavProps {
    email: string | undefined
    locale: string
    signOutLabel: string
}

export function UserNav({ email, locale, signOutLabel }: UserNavProps) {
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-white/5 border border-white/5 hover:bg-white/10">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="text-red-500 cursor-pointer focus:text-red-500"
                    onSelect={async () => {
                        const response = await fetch('/auth/signout', { method: 'POST' })
                        if (response.ok) {
                            router.refresh()
                            router.push(`/${locale}/login`)
                        }
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{signOutLabel}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
