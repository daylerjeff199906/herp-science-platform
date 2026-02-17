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
        <SidebarProvider defaultOpen>
            <div className="flex min-h-screen w-full bg-muted/40 p-4 md:p-8">
                <div className="mx-auto flex w-full max-w-6xl items-start gap-6">
                    <ProfileSidebar locale={locale} className="bg-background rounded-lg border shadow-sm" />

                    <div className="flex-1 flex flex-col gap-6 w-full">
                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden flex items-center gap-2 mb-4">
                            <SidebarTrigger />
                            <span className="font-semibold">Menu</span>
                        </div>

                        <div className="grid gap-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}
