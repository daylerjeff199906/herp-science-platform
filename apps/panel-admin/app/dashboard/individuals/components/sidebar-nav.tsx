
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
    }[]
    uuid: string
}

export function SidebarNav({ className, items, uuid, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    return (
        <nav
            className={cn(
                'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
                className
            )}
            {...props}
        >
            {items.map((item) => {
                // Build the full href (e.g., /dashboard/individuals/[uuid]/edit)
                // Ensure that the uuid is properly replaced in the href logic
                const fullHref = `/dashboard/individuals/${uuid}${item.href}`

                return (
                    <Link
                        key={item.href}
                        href={fullHref}
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            pathname === fullHref
                                ? 'bg-muted hover:bg-muted'
                                : 'hover:bg-transparent hover:underline',
                            'justify-start'
                        )}
                    >
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    )
}
