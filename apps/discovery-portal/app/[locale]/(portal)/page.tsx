import { HeroSlider } from '@/components/home/HeroSlider'
import { AboutSection } from '@/components/home/AboutSection'
import { MultimediaSection } from '@/components/home/MultimediaSection'
import { ResourcesSection } from '@/components/home/ResourcesSection'

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSlider />
      <AboutSection />
      <MultimediaSection />
      <ResourcesSection />
    </main>
  )
}
