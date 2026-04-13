import { createClient } from "@/utils/supabase/server"
import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"
import { LandingNavbar } from "@/components/landing-navbar"
import { Badge, Card, CardContent, Button } from "@repo/ui"
import { MapPin, Clock, Mail, User, Target, Users, BookOpen, Star, ExternalLink, Calendar, Search } from "lucide-react"
import { FacebookGallery } from "./_components/facebook-gallery"
import Link from "next/link"

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
    const galleryImages = facility.gallery_images || []

    return (
        <div className="min-h-screen bg-background flex flex-col pt-14">
            <LandingNavbar />

            {/* Hero Section - Refined and Minimalist (h-[75vh]) */}
            <section className="relative h-[72vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center bg-slate-900 border-b">
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0">
                    {/* Darker uniform overlay instead of gradient to background */}
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src={galleryImages[0] || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"}
                        alt={facility.name}
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 z-20" />
                </div>

                <div className="container relative z-30 px-6 max-w-7xl mx-auto text-center space-y-6">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <Badge variant="secondary" className="bg-primary text-white border-none px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] inline-flex">
                            {facility.type?.name || 'Espacio IIAP'}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter uppercase leading-tight">
                            {facility.name}
                        </h1>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-white/70 max-w-2xl text-base leading-relaxed mx-auto font-normal">
                            {facility.description.split('.')[0]}.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content - No negative margin to avoid overlapping */}
            <main className="flex-1 container mx-auto px-6 py-12 relative z-40 pb-20 max-w-7xl">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Facebook-style Gallery */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Galería de Instalaciones</h2>
                                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Imágenes Reales • IIAP 2024</span>
                            </div>
                            <FacebookGallery images={galleryImages} />
                        </div>

                        {/* About Section */}
                        <div className="space-y-8 p-0">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Sobre el Espacio</h2>
                                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                                    {facility.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-muted/30">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                                        <Target className="h-5 w-5" /> Nuestros Objetivos
                                    </div>
                                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
                                        {metadata.objectives}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                                        <Users className="h-5 w-5" /> ¿A quién va dirigido?
                                    </div>
                                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
                                        {metadata.target_audience}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Featured Project Banner */}
                        {featuredProject.title && (
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 md:p-14 text-white border border-white/5 group">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-700" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                                <div className="relative z-10 space-y-10">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/20 backdrop-blur-md">
                                        <Star className="h-3 w-3 fill-primary" /> Proyecto Destacado
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none uppercase">{featuredProject.title}</h3>
                                        <p className="text-slate-400 leading-relaxed max-w-2xl text-lg font-medium">
                                            {featuredProject.description}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Ejes de Acción</p>
                                        <div className="flex flex-wrap gap-3">
                                            {featuredProject.activities?.map((activity: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 text-xs font-bold bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md group-hover:border-primary/20 transition-all">
                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                    {activity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar Info */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Information Dashboard Card */}
                        <Card className="border-none bg-[#0a0a0a] text-white rounded-[2rem] overflow-hidden border border-white/5">
                            <CardContent className="p-10 space-y-10 relative">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                                <div className="space-y-8 z-10 relative">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Sede Central</h4>
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-sm font-bold leading-tight pt-1">{facility.address}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Atención</h4>
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <Clock className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-sm font-bold leading-tight pt-1">{facility.schedule_info}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Enlace Directo</h4>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <p className="text-sm font-bold leading-tight pt-1">{metadata.contact_person}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                    <Mail className="h-5 w-5 text-primary" />
                                                </div>
                                                <a href={`mailto:${facility.contact_email}`} className="text-sm font-bold leading-tight hover:underline text-primary/80 pt-1">{facility.contact_email}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button disabled className="w-full bg-primary text-white hover:bg-primary/90 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs h-14 relative z-10 opacity-50 cursor-not-allowed">
                                    Programar Visita
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="border-t bg-card/50 py-12 backdrop-blur-xl mt-auto">
                <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-2xl font-bold tracking-tighter text-primary uppercase">IIAP</span>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">Amazonía Peruana</p>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] max-w-xs text-center md:text-right">
                        Instituto de Investigaciones de la Amazonía Peruana &copy; {new Date().getFullYear()} • Ciencia para la Vida
                    </div>
                </div>
            </footer>
        </div>
    )
}
