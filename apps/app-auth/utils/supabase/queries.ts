import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Obtiene todos los módulos a los que un usuario tiene acceso
 * basándose en sus roles y los permisos asignados a esos roles.
 */
export async function getUserModules(supabase: SupabaseClient, authUserId: string) {
    // 1. Obtener el perfil del usuario usando su ID de autenticación
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', authUserId)
        .single();

    if (!profile) return [];

    // 2. Obtener los roles y posibles módulos directos asociados al usuario
    const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('role_id, module_id')
        .eq('profile_id', profile.id);

    const roleIds = userRolesData?.map(ur => ur.role_id) || [];
    const directModuleIds = userRolesData?.map(ur => ur.module_id).filter(Boolean) as string[] || [];
    
    if (roleIds.length === 0 && directModuleIds.length === 0) return [];

    // 3. Obtener módulos por roles (vía permisos)
    let modulesByRole: any[] = [];
    if (roleIds.length > 0) {
        const { data: roleModules } = await supabase
            .from('modules')
            .select(`
                *,
                permissions!inner (
                    role_permissions!inner (
                        role_id
                    )
                )
            `)
            .in('permissions.role_permissions.role_id', roleIds)
            .eq('is_active', true);
        
        modulesByRole = roleModules || [];
    }

    // 4. Obtener módulos por asignación directa
    let modulesByDirect: any[] = [];
    if (directModuleIds.length > 0) {
        const { data: directModules } = await supabase
            .from('modules')
            .select('*')
            .in('id', directModuleIds)
            .eq('is_active', true);
        
        modulesByDirect = directModules || [];
    }

    // 5. Combinar y eliminar duplicados
    const uniqueModulesMap = new Map();
    [...modulesByRole, ...modulesByDirect].forEach(m => {
        // Eliminar la propiedad virtual de la unión si existe para limpiar el objeto
        const { permissions, ...moduleData } = m;
        uniqueModulesMap.set(m.id, moduleData);
    });
    
    return Array.from(uniqueModulesMap.values());
}
