import Link from "next/link"
import Image from "next/image"

interface AuthLayoutProps {
    children: React.ReactNode
}

// Configuración del layout - Puedes cambiar estos valores
const AUTH_CONFIG = {
    appName: "Bio Intranet",
    appIcon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
        >
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    description: "Gestión inteligente para la investigación científica. Organiza, colabora y descubre con la plataforma de gestión académica más avanzada.",
    backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    // Puedes usar una imagen local: "/auth-background.jpg"
}

export default function AuthLayout({ children }: AuthLayoutProps) {
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
                    <div className="flex items-center gap-3 text-white">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                            {AUTH_CONFIG.appIcon}
                        </div>
                        <span className="text-xl font-semibold tracking-tight">
                            {AUTH_CONFIG.appName}
                        </span>
                    </div>

                    {/* Descripción Grande - Centro/Abajo */}
                    <div className="relative mt-auto max-w-2xl">
                        {/* Comillas decorativas */}
                        <div className="absolute -top-6 -left-2 text-white/20 text-8xl font-serif leading-none select-none">
                            "
                        </div>

                        <blockquote className="relative space-y-6">
                            <p className="text-3xl md:text-4xl font-medium text-white leading-relaxed tracking-tight">
                                {AUTH_CONFIG.description}
                            </p>

                            {/* Línea decorativa */}
                            <div className="flex items-center gap-3 pt-4">
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                <span className="text-sm text-white/60 font-medium">
                                    Plataforma Científica
                                </span>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}
