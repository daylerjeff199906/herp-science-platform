import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'
import { getUserModules } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${locale}/login`);
    }

    // Si ya tiene sesión, verificar módulos para saber a dónde mandarlo
    const modules = await getUserModules(supabase, user.id);

    if (modules.length === 0) {
        redirect(process.env.NODE_ENV === 'development' 
            ? `http://localhost:3004/${locale}/dashboard` 
            : `https://intranet.iiap.gob.pe/${locale}/dashboard`)
    }

    redirect(`/${locale}/launcher`);
}
