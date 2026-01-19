'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Database, Map, FileText, Search } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'

export function ResourcesSection() {
    const t = useTranslations('Home.resources')

    const features = [
        {
            icon: Search,
            title: "Búsqueda Avanzada",
            desc: "Filtra por especie, ubicación o taxonomía."
        },
        {
            icon: Map,
            title: "Mapas Interactivos",
            desc: "Visualiza la distribución de especies."
        },
        {
            icon: Database,
            title: "Acceso a Datos",
            desc: "Descarga datasets para investigación."
        },
        {
            icon: FileText,
            title: "Publicaciones",
            desc: "Artículos científicos relacionados."
        }
    ]

    return (
        <section className="py-24 bg-[#0F2F34] text-white relative overflow-hidden">
            {/* Abstract Background Design */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/20 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>


            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
                            {t('tag')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {t('title')}
                        </h2>
                        <Button className="bg-[#ADDE60] hover:bg-[#9cc954] text-emerald-950 font-bold px-8 py-6 rounded-full text-base transition-transform hover:scale-105 active:scale-95">
                            {t('cta')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                                <div className="p-3 bg-emerald-500/20 rounded-lg w-fit text-emerald-300 mb-4 group-hover:text-emerald-200 group-hover:bg-emerald-500/30 transition-colors">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
