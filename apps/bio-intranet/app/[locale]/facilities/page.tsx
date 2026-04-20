import { createClient } from "@/utils/supabase/server"
import { cookies, headers } from "next/headers"
import { LandingNavbar } from "@/components/landing-navbar"
import { Badge, Card, CardContent, Button } from "@repo/ui"
import { MapPin, ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"

export default async function FacilitiesListingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const cookieStore = await cookies()
    const headerList = await headers()
    const host = headerList.get('host') || ''
    const supabase = createClient(cookieStore, host)

    // Fetch all facilities with types
    const { data: facilities } = await supabase
        .from('facilities')
        .select(`
            *,
            type:facility_types(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-background flex flex-col pt-14">
            <LandingNavbar />

            {/* Header Listing - Flush with Navbar */}
            <section className="pt-12 pb-20 bg-slate-50 dark:bg-slate-900 border-b">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="max-w-3xl space-y-6">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] inline-flex">
                            Infraestructura científica
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9]">
                            Nuestras <br/> <span className="text-primary font-bold">Instalaciones</span>
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Explora los centros de investigación, bibliotecas y espacios culturales del IIAP distribuidos en toda la Amazonía Peruana.
                        </p>
                    </div>
                </div>
            </section>

            {/* Grid Listing */}
            <main className="flex-1 container mx-auto px-6 py-16 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facilities?.map((facility) => (
                        <Card key={facility.id} className="group overflow-hidden border bg-card hover:bg-muted/50 transition-all rounded-[2rem]">
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img 
                                    src={facility.gallery_images?.[0] || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"} 
                                    alt={facility.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[10px] uppercase font-bold px-3 py-1">
                                        {facility.type?.name}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight uppercase group-hover:text-primary transition-colors">{facility.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                                        {facility.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold truncate">{facility.address}</span>
                                </div>

                                <div className="pt-4 border-t border-muted/50">
                                    <Link href={`/${locale}/facilities/${facility.slug}`}>
                                        <Button className="w-full rounded-full font-bold uppercase tracking-widest text-[10px] h-11 border-none bg-primary text-white hover:bg-primary/90">
                                            Ver Detalle <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {(!facilities || facilities.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <Building2 className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold uppercase">No se encontraron espacios</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">Actualmente no hay instalaciones públicas registradas en esta sede.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="border-t bg-card/50 py-12 backdrop-blur-xl mt-auto">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold tracking-tighter text-primary uppercase">IIAP</span>
                        <div className="h-4 w-px bg-muted" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amazonía para el mundo</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
