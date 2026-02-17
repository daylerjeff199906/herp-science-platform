import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Obtener usuario autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    // Si no hay usuario, redirigir a login
    redirect(`/${locale}/login`)
  }

  // Obtener perfil del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  // Preparar datos del usuario
  const userData = {
    name:
      `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Usuario',
    email: user.email || '',
    avatar: profile?.avatar_url || user.user_metadata?.avatar_url || null,
  }

  return (
    <SidebarProvider>
      <AppSidebar userData={userData} />
      {children}
    </SidebarProvider>
  )
}
