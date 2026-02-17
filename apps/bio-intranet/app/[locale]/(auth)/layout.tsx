import { Logo } from "@/components/ui/logo"
import { getTranslations } from "next-intl/server"

interface AuthLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

// Configuración del layout - Puedes cambiar estos valores
const AUTH_CONFIG = {
    appName: "B.E.A",
    backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth' });
    const tHome = await getTranslations({ locale, namespace: 'Home' });

    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-3 overflow-hidden">
            {/* Formulario - Lado Izquierdo (Scrollable) */}
            <div className="h-full overflow-y-auto bg-background">
                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto grid w-full gap-6 max-w-sm">
                        {children}
                    </div>
                </div>
            </div>

            {/* Panel Visual - Lado Derecho */}
            <div className="hidden lg:block relative col-span-2 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${AUTH_CONFIG.backgroundImage}')`,
                    }}
                />

                {/* Dark Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/98 via-slate-900/95 to-slate-950/98" />

                {/* Content */}
                <div className="relative z-20 flex h-full flex-col justify-between p-12">
                    {/* Logo y Nombre de la App - Arriba */}
                    <div className="text-white">
                        <Logo
                            name={AUTH_CONFIG.appName}
                            textClassName="text-white"
                            imageClassName="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                            size="lg"
                        />
                    </div>

                    {/* Descripción Grande - Centro/Abajo */}
                    <div className="relative mt-auto max-w-2xl">
                        {/* Comillas decorativas */}
                        <div className="absolute -top-6 -left-2 text-white/20 text-8xl font-serif leading-none select-none">
                            "
                        </div>

                        <blockquote className="relative space-y-6">
                            <p className="text-3xl md:text-4xl font-medium text-white leading-relaxed tracking-tight">
                                {t('tagline')}
                            </p>

                            {/* Línea decorativa */}
                            <div className="flex items-center gap-3 pt-4">
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                <span className="text-sm text-white/60 font-medium">
                                    {tHome('instituteName')}
                                </span>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}
