import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface SiteHeaderProps {
    sectionTitle?: string
}

export const SiteHeader = ({ sectionTitle }: SiteHeaderProps) => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear z-40 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="flex-1">
                    {sectionTitle && (
                        <h1 className="text-sm font-medium">{sectionTitle}</h1>
                    )}
                </div>
            </div>
        </header>
    )
}

