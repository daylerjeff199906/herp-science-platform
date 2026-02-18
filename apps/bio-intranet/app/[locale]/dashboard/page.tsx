"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Calendar, Bell, ExternalLink, Activity, Users } from "lucide-react"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { HeroSlider, HeroSlide } from "./_components/hero-slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get("welcome") === "true"

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
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-8">
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

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recursos Recientes</CardTitle>
                    <CardDescription>
                      Últimas publicaciones y documentos subidos al intranet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Guía de Campo 2025</p>
                        <p className="text-sm text-muted-foreground">PDF - 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Protocolo de Muestreo</p>
                        <p className="text-sm text-muted-foreground">DOCX - 1.1 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Base de Datos Herpetológica</p>
                        <p className="text-sm text-muted-foreground">CSV - 500 KB</p>
                      </div>
                    </div>
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
