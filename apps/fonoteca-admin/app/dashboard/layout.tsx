import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/panel-admin/admin-sidebar"
import { createBioIntranetServer } from '@/utils/supabase/bio-intranet/server'
import { cookies } from 'next/headers'
import { AppSidebar } from "@/components/app-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = "es";
  const cookieStore = await cookies()
  const supabase = await createBioIntranetServer(cookieStore)


  const { data: { user } } = await supabase.auth.getUser()

  // Obtener roles o datos del perfil (opcional, pero requerido para mostrar rol y nombre)
  let role = 'user'
  let name = 'Usuario'

  if (user) {
    // Intentar obtener un nombre desde el perfil buscando por auth_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('auth_id', user.id)
      .single()

    if (profile) {
      name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuario'

      // Obtener roles de user_roles usando el profile.id (el nuevo UUID independiente)
      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select(`roles (name)`)
        .eq('profile_id', profile.id)
      const roles = userRolesData?.map((ur: any) => ur.roles?.name).filter(Boolean) || []
      if (roles.length > 0) role = roles[0]
    }
  }

  const userData = {
    name: name,
    email: user?.email || 'email@ejemplo.com',
    avatar: '', // O poner la imagen si la hay
    role: role.toUpperCase()
  }

  return (
    <SidebarProvider>
      <AppSidebar userData={userData} />
      {children}
    </SidebarProvider>
  )
}


