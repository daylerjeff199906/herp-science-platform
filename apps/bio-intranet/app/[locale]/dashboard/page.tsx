"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { HeroSlider, HeroSlide } from "./_components/hero-slider"

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

  // Example of a populated slider for testing (commented out)
  /*
  const slides: HeroSlide[] = [
    {
      id: "1",
      title: "Investigación de Biodiversidad Amazónica",
      description: "Explora los últimos hallazgos y datos recopilados por nuestros investigadores en la Amazonía.",
      imageUrl: "/images/hero-1.jpg",
      href: "/dashboard/research",
      ctaLabel: "Ver Reporte",
    },
     {
      id: "2", 
      title: "Nueva Especie Descubierta",
      description: "Conoce más sobre la nueva especie de anfibio catalogada en la región de Loreto.", 
      imageUrl: "/images/hero-2.jpg",
      href: "/dashboard/species/new",
    }
  ]
  */

  return (
    <LayoutWrapper sectionTitle={t("Dashboard.title")}>
      <div className="flex flex-col gap-8 w-full container">
        <HeroSlider slides={slides} />

        {/* Placeholder for other dashboard content based on "tener acceso a diferentes etc" */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Example cards for "different sections" */}
          {/* This part helps fulfill "tener acceso a diferentes etc" visually */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold mb-2">Proyectos Recientes</h3>
            <p className="text-sm text-muted-foreground">Accede a tus proyectos de investigación en curso.</p>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold mb-2">Publicaciones</h3>
            <p className="text-sm text-muted-foreground">Revisa las últimas publicaciones científicas del equipo.</p>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="font-semibold mb-2">Herramientas</h3>
            <p className="text-sm text-muted-foreground">Utiliza nuestras herramientas de análisis de datos.</p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
