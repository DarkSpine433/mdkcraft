import About from '@/components/landingpage/AboutSection/About'
import Cta from '@/components/landingpage/cta/Cta'
import GridCard from '@/components/landingpage/offer/GridCard'
import Opinions from '@/components/landingpage/opinions/Opinions'
import Projects from '@/components/landingpage/projects/Projects'
import ScrollIndicatorWrapper from '@/components/landingpage/ScrollIndicatorWrapper'
import TitleHero from '@/components/landingpage/TitleHero'

type Props = {}

const Home = (props: Props) => {
  return (
    <ScrollIndicatorWrapper>
      <TitleHero />

      <About />

      <GridCard />

      <Projects />

      <Opinions />

      <Cta />
    </ScrollIndicatorWrapper>
  )
}

export default Home
