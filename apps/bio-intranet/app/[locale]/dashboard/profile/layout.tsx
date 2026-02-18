import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { SocialLinksCard } from "@/components/profile/social-links-card"
import { AdditionalEmailsCard } from "@/components/profile/additional-emails-card"

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

    // Fetch complete profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()


    return (
        <LayoutWrapper
            sectionTitle="Informacion general"
        >
            <SidebarProvider defaultOpen>
                <div className="md:hidden">
                    <ProfileSidebar locale={locale} collapsible="offcanvas" />
                </div>
                <div className="flex w-full bg-muted/30">
                    <div className="mx-auto flex items-start gap-8 container flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="bg-transparent border-0 shadow-none w-full md:w-64 shrink-0 flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <div className="bg-card rounded-lg border p-6 flex flex-col items-center text-center">
                                    <AvatarUpload
                                        avatarUrl={profile?.avatar_url}
                                        firstName={profile?.first_name}
                                        lastName={profile?.last_name}
                                    />
                                    <h3 className="mt-4 font-semibold text-lg">{profile?.first_name} {profile?.last_name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{profile?.bio}</p>
                                </div>
                                <SocialLinksCard links={profile?.social_links || []} locale={locale} />
                                <AdditionalEmailsCard emails={profile?.additional_emails || []} locale={locale} />
                            </div>
                            <ProfileSidebar locale={locale} className="hidden md:flex" />
                        </div>
                        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
                            {/* Mobile Menu Trigger */}
                            <div className="md:hidden flex items-center gap-2 mb-4">
                                <SidebarTrigger />
                                <span className="font-semibold">Menu</span>
                            </div>
                            <div className="w-full h-auto pb-4 lg:pb-6 max-w-4xl">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </LayoutWrapper>
    )
}
