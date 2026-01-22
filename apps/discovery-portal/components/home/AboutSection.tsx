'use client'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import Image from 'next/image'

export function AboutSection() {
  const t = useTranslations('Home.about')

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image / Visuals - Moved to Left */}
          <Image
            src="https://vertebrados.iiap.gob.pe/_next/static/media/rana.d741fb18.webp"
            alt="About Section Image"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg order-2 lg:order-1"
          />

          {/* Content - Moved to Right */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[#ADDE60] text-lg font-bold">+</span>
                <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">
                  {t('tag')}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold  leading-[1.1] tracking-tight">
                {t('title')}
              </h2>

              <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                <p>{t('description')}</p>
                <p>{t('description2')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                className="bg-transparent border-[#ADDE60] text-[#ADDE60] hover:bg-[#ADDE60] hover:text-[#111] rounded-full px-8 h-12 text-sm uppercase tracking-wider font-bold transition-all duration-300"
              >
                {t('cta')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
