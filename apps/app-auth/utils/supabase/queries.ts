import { SupabaseClient } from '@supabase/supabase-js'

export async function getUserModules(supabase: SupabaseClient, userId: string) {
    // 1. Get the profile id for this auth user
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', userId)
        .single();

    if (!profile) return [];

    // 2. Fetch modules through user_roles -> role_permissions -> permissions -> modules
    // Join logic with updated schema: 
    // modules (id) <- permissions (module_id)
    // permissions (id) <- role_permissions (permission_id)
    // role_permissions (role_id) <- user_roles (role_id)
    
    const { data: modules, error } = await supabase
        .from('modules')
        .select(`
            *,
            permissions!inner (
                role_permissions!inner (
                    user_roles!inner (
                        profile_id
                    )
                )
            )
        `)
        .eq('permissions.role_permissions.user_roles.profile_id', profile.id)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching user modules:', error);
        return [];
    }

    // Deduplicate modules by id
    const uniqueModules = Array.from(new Map(modules.map(m => [m.id, m])).values());
    
    return uniqueModules;
}
