import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface ProfileLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

export default async function ProfileLayout({
    children,
    params,
}: ProfileLayoutProps) {
    const { locale } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect(`/${locale}/login`)
    }

    return (
        <LayoutWrapper
            sectionTitle="Informacion general"
        >
            <SidebarProvider defaultOpen>
                <div className="flex w-full bg-muted/30">
                    <div className="mx-auto flex w-full items-start gap-8  max-w-7xl">
                        {/* Sidebar */}
                        <ProfileSidebar locale={locale} className="hidden md:flex bg-transparent border-l-0 border-t-0 border-b-0 border-r shadow-none w-64 shrink-0" />

                        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
                            {/* Mobile Menu Trigger */}
                            <div className="md:hidden flex items-center gap-2 mb-4">
                                <SidebarTrigger />
                                <span className="font-semibold">Menu</span>
                            </div>
                            <div className="w-full h-auto pb-4 lg:pb-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </LayoutWrapper>
    )
}
