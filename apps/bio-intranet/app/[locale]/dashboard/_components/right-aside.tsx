"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Info, ArrowUpRight, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"

export function RightAside() {
  return (
    <div className="flex flex-col gap-4 sticky top-4">
      {/* Trending Topics / News */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Tendencias IIAP
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { tag: "#ViernesCientificos", subtitle: "2k publicaciones" },
            { tag: "#BioDiversidad", subtitle: "Reciente • 1.5k" },
            { tag: "#Amazonia2024", subtitle: "Tendencia en Loreto" },
            { tag: "#IntegridadPublica", subtitle: "Campaña activa" },
          ].map((item, i) => (
            <div key={i} className="space-y-0.5 cursor-pointer group">
              <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.tag}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{item.subtitle}</p>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary hover:bg-primary/5">
            Ver más tendencias
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events Widget */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {[
                { day: "24", month: "FEB", title: "Taller de Taxonomía", color: "bg-blue-500" },
                { day: "03", month: "MAR", title: "Salida de Campo", color: "bg-green-500" },
                { day: "15", month: "ABR", title: "Congreso Amazónico", color: "bg-orange-500" },
            ].map((event, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center rounded-xl border border-muted/20 bg-muted/30 p-1.5 min-w-[42px] group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                        <span className="text-[8px] uppercase font-black text-muted-foreground group-hover:text-primary">{event.month}</span>
                        <span className="text-sm font-black text-foreground group-hover:text-primary">{event.day}</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight truncate group-hover:text-primary transition-colors">{event.title}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">Iquitos • Auditorio</p>
                    </div>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </div>
            ))}
        </CardContent>
      </Card>

      {/* Recommended for you */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="p-4 space-y-4">
            <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary/70">Recomendado</h4>
                <p className="text-sm font-bold leading-tight">Basado en tus intereses de investigación</p>
            </div>
            
            <div className="relative group rounded-xl overflow-hidden aspect-video bg-muted/20 border">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 transition-opacity group-hover:opacity-60" />
                <img 
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                    alt="Nature"
                />
                <div className="absolute bottom-3 left-3 z-20">
                    <p className="text-white text-xs font-bold shadow-sm">Nuevas metodologías en GIS</p>
                </div>
            </div>

            <Button variant="outline" className="w-full rounded-full border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold">
                Seguir explorando
            </Button>
        </div>
      </Card>

      {/* Footer Links (Mini) */}
      <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest justify-center">
            <a href="#" className="hover:text-primary">Acerca de</a>
            <a href="#" className="hover:text-primary">Accesibilidad</a>
            <a href="#" className="hover:text-primary">Ayuda</a>
            <a href="#" className="hover:text-primary">Privacidad</a>
            <a href="#" className="hover:text-primary">Más</a>
            <p className="w-full text-center mt-2">&copy; IIAP • 2024</p>
      </div>
    </div>
  )
}
