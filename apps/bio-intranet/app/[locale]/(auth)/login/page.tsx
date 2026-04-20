import { redirect } from 'next/navigation'

export default async function LoginPage(props: { params: Promise<{ locale: string }>; searchParams: Promise<{ redirect?: string; next?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const locale = params.locale;
    const redirectTo = searchParams.redirect || searchParams.next;
    
    // Configuración de URLs
    const isProd = process.env.NODE_ENV === 'production';
    const authUrl = isProd ? 'https://auth.iiap.gob.pe' : 'http://localhost:3003';
    const siteUrl = isProd ? 'https://intranet.iiap.gob.pe' : 'http://localhost:3004';
    
    // Construir la URL de retorno
    // Si ya viene un redirect, lo pasamos tal cual, si no, usamos el dashboard local
    const finalRedirect = redirectTo || `${siteUrl}/${locale}/dashboard`;
    
    const loginUrl = `${authUrl}/${locale}/login?redirect=${encodeURIComponent(finalRedirect)}`;
    
    redirect(loginUrl);

    return null;
}
