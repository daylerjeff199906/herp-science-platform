import { HeroSlider } from '@/components/home/HeroSlider'
import { AboutSection } from '@/components/home/AboutSection'
import { MultimediaSection } from '@/components/home/MultimediaSection'
import { PortalServices } from '@/components/home/PortalServices'
import { StatsSection } from '@/components/home/StatsSection'

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSlider />
      <StatsSection />
      <AboutSection />
      <MultimediaSection />
      <PortalServices />
    </main>
  )
}
