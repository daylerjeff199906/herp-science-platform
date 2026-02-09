'use client'
import * as React from 'react'
import { Search, ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@repo/ui/components/ui/carousel'
import { Input } from '@repo/ui/components/ui/input'
import { Button } from '@repo/ui/components/ui/button'
import Autoplay from 'embla-carousel-autoplay'
import { ROUTES } from '@/config/routes'
import { Link } from '@/i18n/routing'
import { HeroSearch } from './HeroSearch'
import { useTranslations } from 'next-intl'

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )
  const t = useTranslations('Hero')

  const slides = [
    {
      id: 1,
      image:
        'https://vertebrados.iiap.gob.pe/_next/static/media/rana.d741fb18.webp',
      title: t('slides.slide1.title'),
      subtitle: t('slides.slide1.subtitle'),
    },
    {
      id: 2,
      image:
        'https://vertebrados.iiap.gob.pe/_next/static/media/iguana.b3c16d1d.webp',
      title: t('slides.slide2.title'),
      subtitle: t('slides.slide2.subtitle'),
    },
    {
      id: 3,
      image:
        'https://vertebrados.iiap.gob.pe/_next/static/media/reptil.a1cef8f3.webp',
      title: t('slides.slide3.title'),
      subtitle: t('slides.slide3.subtitle'),
    },
  ]

  const handleScrollToCollections = () => {
    const element = document.getElementById('latest-collections')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full h-screen min-[1920px]:h-[920px] bg-emerald-950 overflow-hidden">
      {' '}
      {/* Background Slider */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: true,
          align: 'start',
        }}
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="pl-0 relative w-full h-full"
            >
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover transition-transform duration-1000 select-none w-full h-screen md:h-full"
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Content Container (Overlay) */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl space-y-8 md:space-y-10 animate-in fade-in slide-in-from-left-10 duration-700">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-md">
                {t('titlePrefix')} <br />
                <span className="text-[#ADDE60]">{t('titleAccent')}</span>
              </h1>
              <p className="text-lg text-emerald-100/90 max-w-2xl leading-relaxed font-light">
                {t('description')}
              </p>
            </div>

            {/* Search & Actions Container */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
              {/* Search Bar - Style match: Outline white, pill shape, icon right */}
              <div className="relative w-full max-w-md group">
                <HeroSearch />
              </div>

              {/* Custom Action Button - Style match: Solid Green background, dark text */}
              <Button
                asChild
                size="lg"
                className="h-14 pl-2 pr-6 bg-[#ADDE60] hover:bg-[#9cc954] text-emerald-950 font-bold text-lg rounded-full transition-all group shadow-[0_0_20px_rgba(173,222,96,0.3)] hover:shadow-[0_0_30px_rgba(173,222,96,0.5)]"
              >
                <Link href={ROUTES.COLLECTIONS}>
                  <div className="bg-emerald-950 rounded-full p-2 mr-3 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 text-[#ADDE60]" />
                  </div>
                  {t('actionButton')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#ADDE60]/60 text-sm animate-pulse flex flex-col items-center gap-2 z-30">
        <button
          onClick={handleScrollToCollections}
          className="uppercase tracking-widest text-xs font-medium hover:text-[#ADDE60] transition-colors"
        >
          {t('explore')}
        </button>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#ADDE60]/60 to-transparent" />
      </div>
    </div>
  )
}