import { createBioIntranetServer } from "@/utils/supabase/bio-intranet/server";
import { cookies, headers } from "next/headers";

export interface TeamModule {
    name: string;
    logo: string;
    url: string;
    plan: string;
}

const MODULE_ASSETS: Record<string, { logo: string; plan: string; defaultUrl: string }> = {
    'intranet': {
        logo: '/brands/logo-iiap.webp',
        plan: 'Plataforma Core',
        defaultUrl: 'https://auth.iiap.gob.pe'
    },
    'coniap': {
        logo: '/brands/coniap.png', // Assuming these exist or user will provide
        plan: 'Gestión de Eventos',
        defaultUrl: 'https://coniap.iiap.gob.pe'
    },
    'fonoteca': {
        logo: '/brands/fonoteca.png',
        plan: 'Administración',
        defaultUrl: '/'
    }
};

export async function getAuthorizedTeams() {
    const cookieStore = await cookies();
    const headerList = await headers();
    const host = headerList.get('host') || '';
    const supabase = await createBioIntranetServer(cookieStore, host);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // 1. Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .single();

    if (!profile) return [];

    // 2. Get roles
    const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('profile_id', profile.id);

    const roles = userRoles?.map((r: any) => r.roles?.name?.toLowerCase()) || [];
    const roleIds = userRoles?.map(r => r.role_id) || [];
    if (roleIds.length === 0) return [];

    // 3. Get permissions with module info
    const { data: permissions, error } = await supabase
        .from('role_permissions')
        .select(`
            permissions (
                module_name,
                url
            )
        `)
        .in('role_id', roleIds);

    if (error) {
        console.error('Error fetching teams permissions:', error);
        return [];
    }

    const modules = new Map<string, TeamModule>();

    // Standard modules mapping if not in DB
    const addModule = (rawName: string, dbUrl?: string) => {
        const asset = MODULE_ASSETS[rawName] || {
            logo: '/brands/logo-iiap.webp',
            plan: 'Aplicativo',
            defaultUrl: dbUrl || '#'
        };
        modules.set(rawName, {
            name: rawName.toUpperCase(),
            logo: asset.logo,
            url: dbUrl || asset.defaultUrl,
            plan: asset.plan
        });
    };

    // If admin, show all key modules by default
    if (roles.includes('admin')) {
        Object.keys(MODULE_ASSETS).forEach(m => addModule(m));
    }

    permissions?.forEach((p: any) => {
        const mod = p.permissions;
        if (!mod || !mod.module_name) return;
        addModule(mod.module_name.toLowerCase(), mod.url);
    });

    return Array.from(modules.values());
}
