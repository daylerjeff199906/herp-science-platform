"use client"

import { useSearchParams } from "next/navigation"
import { Calendar, Bell, ExternalLink, Activity, Users, Briefcase } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { format } from "date-fns"
import { es as esLocale } from "date-fns/locale"
import { useState, useEffect } from "react"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { HeroSlider, HeroSlide } from "./_components/hero-slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const t = useTranslations()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get("welcome") === "true"
  const [latestCalls, setLatestCalls] = useState<any[]>([])
  const [loadingCalls, setLoadingCalls] = useState(true)

  useEffect(() => {
    const fetchCalls = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('event_calls')
        .select(`
          id,
          title,
          end_date,
          role:participant_roles(name),
          main_event:main_events(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (data) setLatestCalls(data)
      setLoadingCalls(false)
    }

    fetchCalls()
  }, [])

  useEffect(() => {
    if (isNewUser) {
      // Could trigger a toast here
      // alert("Welcome to B.E.A IIAP! Your profile is set up.")
    }
  }, [isNewUser])

  // Example of how slides could be structure, currently empty to trigger default welcome slide
  const slides: HeroSlide[] = []

  return (
    <LayoutWrapper sectionTitle={t("Dashboard.title")}>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 flex flex-col gap-8">
            <HeroSlider slides={slides} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Acceso Rápido</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Proyectos Activos
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      +2 desde el mes pasado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Investigadores
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+50</div>
                    <p className="text-xs text-muted-foreground">
                      Colaborando en la plataforma
                    </p>
                  </CardContent>
                </Card>

                {/* Convocatorias Section */}
                <Card className="md:col-span-2 overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                  <CardHeader className="pb-3 px-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          Convocatorias Abiertas
                        </CardTitle>
                        <CardDescription>
                          Oportunidades actuales para participar en proyectos y eventos.
                        </CardDescription>
                      </div>
                      <Link href={`/${locale}/dashboard/convocatorias`}>
                        <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider">
                          Ver Todas <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    {loadingCalls ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                        ))}
                      </div>
                    ) : latestCalls.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        {latestCalls.map((call) => {
                          const callTitle = typeof call.title === 'object' ? call.title?.[locale] : call.title;
                          const roleName = typeof call.role?.name === 'object' ? call.role?.name?.[locale] : call.role?.name;

                          return (
                            <Link key={call.id} href={`/${locale}/dashboard/convocatorias/${call.id}`}>
                              <div className="group relative flex flex-col justify-between p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all h-full">
                                <div className="space-y-1.5">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                                    {roleName}
                                  </div>
                                  <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {callTitle}
                                  </h4>
                                </div>
                                <div className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(call.end_date), "dd MMM", { locale: esLocale })}
                                  </span>
                                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center border border-dashed rounded-xl bg-muted/5">
                        <p className="text-sm text-muted-foreground">No hay convocatorias activas en este momento.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>

          {/* Right Sidebar (Aside) */}
          <aside className="w-full lg:w-80 space-y-6 shrink-0">

            {/* Calendar / Events Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center rounded-md border bg-muted p-2 w-12 h-12">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">FEB</span>
                    <span className="text-lg font-bold">24</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Taller de Taxonomía</p>
                    <p className="text-xs text-muted-foreground">9:00 AM - Auditorio Principal</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center rounded-md border bg-muted p-2 w-12 h-12">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">MAR</span>
                    <span className="text-lg font-bold">03</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Salida de Campo</p>
                    <p className="text-xs text-muted-foreground">Todo el día - Reserva Allpahuayo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications / Activity Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="relative flex h-2 w-2 translate-y-1.5 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Nuevo comentario en tu reporte</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="relative flex h-2 w-2 translate-y-1.5 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Documento aprobado</p>
                    <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="relative flex h-2 w-2 translate-y-1.5 rounded-full bg-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">Mantenimiento programado</p>
                    <p className="text-xs text-muted-foreground">Ayer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Enlaces de Interés
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">Portal de Transparencia</span>
                    <span className="text-xs text-muted-foreground">Acceso público a la información</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2 px-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">Sistema de Bibliotecas</span>
                    <span className="text-xs text-muted-foreground">Catálogo en línea</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

          </aside>

        </div>
      </div>
    </LayoutWrapper>
  )
}
