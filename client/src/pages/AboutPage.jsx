import { useEffect } from 'react'
import AboutHero from '../components/about/AboutHero'
import AboutIntro from '../components/about/AboutIntro'
import Divider from '../components/ui/Divider'
import FadeIn from '../components/ui/FadeIn'
import PageTransition from '../components/ui/PageTransition'

export default function AboutPage() {
  useEffect(() => {
    document.title = 'UIA 특별관 — 사회연대경제박람회'
  }, [])

  return (
    <PageTransition>
      <AboutHero animReady />
      <Divider />
      <FadeIn><AboutIntro /></FadeIn>
    </PageTransition>
  )
}
