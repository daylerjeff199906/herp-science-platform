import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'
import { getUserModules } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import * as LucideIcons from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { UserNav } from '@/components/user-nav'
import { ThemeToggle } from '@/components/theme-toggle'

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
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Background pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <header className="relative z-10 border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <Logo size="sm" imageClassName="bg-primary/5" />
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserNav
                            email={user.email}
                            locale={locale}
                            signOutLabel={t('signOut') || 'Salir'}
                        />
                    </div>
                </div>
            </header>

            <main className="relative z-10 flex-1 py-12 md:py-24">
                <div className="container mx-auto px-6 space-y-16">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Hola, {user.email?.split('@')[0]}
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                            Estas son las aplicaciones que tienes asignadas. Selecciona una para acceder a sus funciones y herramientas de investigación.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                    <div className="relative bg-card/50 hover:bg-card border border-border p-5 rounded-lg h-full flex flex-col gap-4 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-sm">
                                        <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${module.color_class || 'from-primary to-cyan-500'} flex items-center justify-center shadow-sm`}>
                                            <IconComponent className="w-5 h-5 text-white" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <h3 className="text-base font-semibold tracking-tight">{module.name}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {module.description || 'Herramienta especializada para la gestión e investigación científica.'}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-2 flex items-center text-[10px] font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Acceder ahora
                                            <LucideIcons.ArrowRight className="ml-1.5 w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-black/20">
                <div className="container mx-auto px-6 h-16 flex items-center justify-center text-muted-foreground text-[10px] uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} IIAP • Plataforma de Inteligencia Amazónica
                </div>
            </footer>
        </div>
    )
}
