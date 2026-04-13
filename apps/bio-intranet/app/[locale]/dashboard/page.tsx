"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/utils/supabase/client"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { MainFeed } from "./_components/main-feed"
import { LeftAside } from "./_components/left-aside"
import { RightAside } from "./_components/right-aside"

// Scraped data from IIAP Campaigns
const SCRAPED_POSTS = [
  {
    id: 1,
    title: "Infórmate sobre el Hostigamiento Sexual en el IIAP",
    date: "13 de nov. 2024",
    img_url: "https://www.gob.pe/institucion/iiap/campañias/84978",
    snippet: "Campaña informativa sobre la prevención y sanción del hostigamiento sexual en el ámbito laboral del IIAP. Fomentamos un ambiente de trabajo seguro y respetuoso.",
    link: "https://www.gob.pe/institucion/iiap/campa%C3%B1as/84978-informate-sobre-el-hostigamiento-sexual-en-el-iiap"
  },
  {
    id: 2,
    title: "Elección de representantes ante el comité de Seguridad y Salud en el Trabajo",
    date: "29 de abr. 2024",
    img_url: "https://www.gob.pe/institucion/iiap/campañias/62263",
    snippet: "Proceso de elección de los representantes de los trabajadores que integrarán el Comité de Seguridad y Salud en el Trabajo para el periodo 2024-2026.",
    link: "https://www.gob.pe/institucion/iiap/campa%C3%B1as/62263-eleccion-de-representantes-ante-el-comite-de-seguridad-y-salud-en-el-trabajo"
  },
  {
    id: 3,
    title: "Viernes Científicos",
    date: "En curso",
    img_url: "https://www.gob.pe/institucion/iiap/campañias/7325",
    snippet: "Ciclo de conferencias y exposiciones sobre avances en investigación científica en la Amazonía. Únete a nosotros todos los viernes para aprender más.",
    link: "https://www.gob.pe/institucion/iiap/campa%C3%B1as/7325-viernes-cientificos"
  },
  {
    id: 4,
    title: "Consultorio de ética e integridad pública",
    date: "Permanente",
    img_url: "https://www.gob.pe/institucion/iiap/campañias/44106",
    snippet: "Espacio de orientación y consultas sobre integridad y valores éticos dentro de la institución para asegurar una gestión transparente.",
    link: "https://www.gob.pe/institucion/iiap/campa%C3%B1as/44106-consultorio-de-etica"
  }
]

export default function DashboardPage() {
  const t = useTranslations()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('auth_id', user.id)
          .maybeSingle()

        setUserData({
          name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Investigador',
          email: user.email || '',
          avatar: profile?.avatar_url || null
        })
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <LayoutWrapper sectionTitle={t("Dashboard.title")}>
        <div className="container mx-auto p-4 flex gap-6 animate-pulse">
           <div className="hidden lg:block w-72 h-[400px] bg-muted rounded-2xl" />
           <div className="flex-1 space-y-4">
              <div className="h-24 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
           </div>
           <div className="hidden xl:block w-80 h-[500px] bg-muted rounded-2xl" />
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper sectionTitle="Inicio">
      <div className="container mx-auto p-0 md:p-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Profile (Hidden on mobile, 3 cols) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
             <LeftAside userData={userData} />
          </div>

          {/* Center Column - Feed (Main focus) */}
          <main className="col-span-1 md:col-span-8 lg:col-span-6 space-y-4">
             <MainFeed posts={SCRAPED_POSTS} />
          </main>

          {/* Right Column - Widgets (Hidden on md, visible on lg+) */}
          <div className="hidden lg:block lg:col-span-3">
             <RightAside />
          </div>

        </div>
      </div>
    </LayoutWrapper>
  )
}
