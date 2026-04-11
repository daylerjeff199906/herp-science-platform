import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/panel-admin/admin-sidebar"
import { createBioIntranetServer } from '@/utils/supabase/bio-intranet/server'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { getAuthorizedTeams } from "@/actions/auth-teams"

import { TeamsProvider } from "@/components/providers/teams-provider"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = "es";
  const cookieStore = await cookies()
  const supabase = await createBioIntranetServer(cookieStore)


  const { data: { user } } = await supabase.auth.getUser()

  const isDev = (await headers()).get('host')?.includes('localhost') ?? true
  const loginUrl = isDev ? 'http://localhost:3003/login' : 'https://auth.iiap.gob.pe/'

  if (!user) {
    redirect(loginUrl)
  }

  // Obtener roles o datos del perfil
  let role = 'user'
  let name = 'Usuario'

  // Intentar obtener un nombre desde el perfil buscando por auth_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('auth_id', user.id)
    .single()

  if (!profile) {
    // Si no hay perfil, algo anda mal, mejor cerrar sesión o redirigir
    redirect(loginUrl)
  }

  name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Usuario'

  // Verificación de acceso al módulo Fonoteca
  // Obtenemos los módulos asignados al usuario en user_roles
  const { data: userRolesData } = await supabase
    .from('user_roles')
    .select(`
      role_id, 
      module_id,
      roles (name),
      modules (code)
    `)
    .eq('profile_id', profile.id)

  const roles = userRolesData?.map((ur: any) => ur.roles?.name).filter(Boolean) || []
  if (roles.length > 0) role = roles[0]

  const isAdmin = roles.some(r => r.toLowerCase() === 'admin')
  const hasModuleAccess = userRolesData?.some((ur: any) => ur.modules?.code === 'fonoteca')

  if (!isAdmin && !hasModuleAccess) {
    // No tiene permiso para este módulo específico
    redirect(`${loginUrl.replace('/login', '')}/launcher?error=unauthorized`)
  }

  const userData = {
    name: name,
    email: user?.email || 'email@ejemplo.com',
    avatar: '', // O poner la imagen si la hay
    role: role.toUpperCase()
  }
  
  const authorizedTeams = await getAuthorizedTeams()

  return (
    <TeamsProvider teams={authorizedTeams}>
      <SidebarProvider>
        <AppSidebar userData={userData} />
        {children}
      </SidebarProvider>
    </TeamsProvider>
  )
}


