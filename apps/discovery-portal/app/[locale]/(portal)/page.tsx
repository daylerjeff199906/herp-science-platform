import { HeroSlider } from '@/components/home/HeroSlider'
import { AboutSection } from '@/components/home/AboutSection'
import { MultimediaSection } from '@/components/home/MultimediaSection'
import { PortalServices } from '@/components/home/PortalServices'

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSlider />
      <AboutSection />
      <MultimediaSection />
      <PortalServices />
    </main>
  )
}
