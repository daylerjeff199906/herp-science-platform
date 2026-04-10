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

    // 2. Obtener los IDs de los roles asociados al usuario
    const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('profile_id', profile.id);

    const roleIds = userRoles?.map(ur => ur.role_id) || [];
    
    if (roleIds.length === 0) return [];

    // 3. Obtener los módulos únicos asociados a esos roles
    // El camino es: Role -> RolePermissions -> Permissions -> Modules
    const { data: modules, error } = await supabase
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

    if (error) {
        console.error('Error al obtener módulos del usuario:', error);
        return [];
    }

    // 4. Eliminar duplicados (un usuario puede tener varios roles que den acceso al mismo módulo)
    const uniqueModulesMap = new Map();
    modules.forEach(m => uniqueModulesMap.set(m.id, m));
    
    return Array.from(uniqueModulesMap.values());
}
