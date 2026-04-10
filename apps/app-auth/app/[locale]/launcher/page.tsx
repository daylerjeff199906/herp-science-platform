import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'
import { getUserModules } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

export default async function LauncherPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)
    const t = await getTranslations({ locale, namespace: 'Auth' })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${locale}/login`)
    }

    const modules = await getUserModules(supabase, user.id)

    // Si no hay módulos, ir al dashboard de la intranet
    if (modules.length === 0) {
        redirect(process.env.NODE_ENV === 'development' 
            ? `http://localhost:3004/${locale}/dashboard` 
            : `https://intranet.iiap.gob.pe/${locale}/dashboard`)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            {/* Background pattern */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <header className="relative z-10 p-8 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
                <Logo size="md" />
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <form action="/auth/signout" method="post">
                        <button className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                            {t('signOut') || 'Salir'}
                        </button>
                    </form>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="max-w-6xl w-full space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                            {t('welcome') || 'Bienvenido'}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Selecciona una aplicación para comenzar tu jornada de investigación en la Amazonía.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {modules.map((module) => {
                            // Dinamicamente encontrar el icono
                            const IconComponent = (LucideIcons as any)[module.icon_name] || LucideIcons.AppWindow;
                            
                            return (
                                <Link
                                    key={module.id}
                                    href={module.url}
                                    target={module.url.startsWith('http') ? '_blank' : undefined}
                                    rel={module.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="group relative block"
                                >
                                    <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${module.color_class || 'from-primary to-cyan-500'} opacity-0 group-hover:opacity-100 transition duration-500 blur`}></div>
                                    <div className="relative bg-[#111111] border border-white/5 p-8 rounded-2xl h-full flex flex-col gap-6 transition-all duration-300 group-hover:bg-[#151515] group-hover:-translate-y-1">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color_class || 'from-primary to-cyan-500'} flex items-center justify-center shadow-lg`}>
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{module.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {module.description || 'Accede a las herramientas de gestión e investigación.'}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Abrir Aplicación
                                            <LucideIcons.ArrowRight className="ml-2 w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <footer className="relative z-10 p-8 text-center text-muted-foreground text-xs font-light tracking-wide border-t border-white/5 bg-black/40">
                &copy; {new Date().getFullYear()} IIAP - Plataforma de Inteligencia Amazónica
            </footer>
        </div>
    )
}
