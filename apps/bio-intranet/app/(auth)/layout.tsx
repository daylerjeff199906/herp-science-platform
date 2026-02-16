import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-12 bg-background">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="flex flex-col space-y-2 text-center">
                        {/* Logo placeholder if needed, though pages might have their own headers. 
                 I'll wrap children in a way that centers them. */}
                    </div>
                    {children}
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative bg-primary">
                <div className="relative z-20 flex h-full flex-col justify-between p-10 text-primary-foreground">
                    <div className="flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        Bio Intranet
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                "Gestión inteligente para todos. Gestiona tu salud con la plataforma de gestión médica más avanzada."
                            </p>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}
