import { createClient } from "@/utils/supabase/server"
import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"
import { LandingNavbar } from "@/components/landing-navbar"
import { Badge } from "@repo/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui"
import { MapPin, Clock, Mail, User, Target, Users, BookOpen, Star, ExternalLink, Calendar } from "lucide-react"
import { Button } from "@repo/ui"

export default async function FacilityPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

    // Fetch facility data with its type
    const { data: facility, error } = await supabase
        .from('facilities')
        .select(`
            *,
            type:facility_types(name, description)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (error || !facility) {
        notFound()
    }

    const metadata = facility.metadata || {}
    const featuredProject = metadata.featured_project || {}

    return (
        <div className="min-h-screen bg-background flex flex-col pt-16">
            <LandingNavbar />

            {/* Hero Section / Header */}
            <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center justify-center">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-slate-900/60 to-slate-900 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
                        alt={facility.name}
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-20" />
                </div>

                <div className="container relative z-30 px-6 text-center space-y-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 backdrop-blur-md px-4 py-1 text-xs font-black uppercase tracking-widest">
                        {facility.type?.name || 'Espacio IIAP'}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none max-w-4xl mx-auto">
                        {facility.name}
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto font-medium text-sm md:text-base px-4">
                        Conoce más sobre este espacio dedicado a la ciencia, la cultura y la investigación en la Amazonía.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 -mt-12 relative z-40 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Gallery / Image Render Placeholders */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="aspect-video rounded-3xl overflow-hidden border-4 border-background shadow-xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1470&auto=format&fit=crop"
                                    alt="Biblioteca 1"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="aspect-video rounded-3xl overflow-hidden border-4 border-background shadow-xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1473&auto=format&fit=crop"
                                    alt="Biblioteca 2"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* About Section */}
                        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm p-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase border-l-4 border-primary pl-4">Sobre este espacio</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {facility.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-muted">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-xs">
                                            <Target className="h-4 w-4" /> Objetivos
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {metadata.objectives}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-xs">
                                            <Users className="h-4 w-4" /> Público Objetivo
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {metadata.target_audience}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Featured Project */}
                        {featuredProject.title && (
                            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30">
                                        <Star className="h-3 w-3" /> Proyecto Destacado
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black tracking-tight leading-none">{featuredProject.title}</h3>
                                        <p className="text-slate-300 leading-relaxed max-w-2xl">
                                            {featuredProject.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                                        {featuredProject.activities?.map((activity: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs font-bold bg-white/5 p-3 rounded-xl border border-white/10">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                {activity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Quick Info Card */}
                        <Card className="border-none shadow-xl bg-primary text-white overflow-hidden">
                            <CardContent className="p-8 space-y-8 relative">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                                <div className="space-y-6 z-10 relative">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Ubicación</h4>
                                        <div className="flex gap-3">
                                            <MapPin className="h-5 w-5 shrink-0 text-white/80" />
                                            <p className="text-sm font-bold leading-tight">{facility.address}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Horario de Atención</h4>
                                        <div className="flex gap-3">
                                            <Clock className="h-5 w-5 shrink-0 text-white/80" />
                                            <p className="text-sm font-bold leading-tight">{facility.schedule_info}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Contacto y Consultas</h4>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <User className="h-5 w-5 shrink-0 text-white/80" />
                                                <p className="text-sm font-bold leading-tight">{metadata.contact_person}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <Mail className="h-5 w-5 shrink-0 text-white/80" />
                                                <a href={`mailto:${facility.contact_email}`} className="text-sm font-bold leading-tight hover:underline">{facility.contact_email}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-white text-primary hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs h-12 relative z-10">
                                    Programar Visita
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Services Widget */}
                        <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md p-6">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-primary" /> Servicios Disponibles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-3 text-sm text-muted-foreground font-medium">
                                <p>{metadata.collections_and_services}</p>
                            </CardContent>
                        </Card>

                        {/* Links section */}
                        <div className="px-2 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Más información</h4>
                            <div className="grid gap-2">
                                <a href="#" className="flex items-center justify-between p-3 rounded-2xl border border-muted bg-card/20 hover:bg-primary/5 hover:border-primary/20 transition-all group">
                                    <span className="text-xs font-bold">Portal IIAP</span>
                                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                                </a>
                                <a href="#" className="flex items-center justify-between p-3 rounded-2xl border border-muted bg-card/20 hover:bg-primary/5 hover:border-primary/20 transition-all group">
                                    <span className="text-xs font-bold">Transparencia</span>
                                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t bg-card/30 py-8 backdrop-blur-md mt-auto">
                <div className="container mx-auto px-6 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Instituto de Investigaciones de la Amazonía Peruana • {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    )
}
