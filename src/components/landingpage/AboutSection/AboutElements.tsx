'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { useState } from 'react'
import AboutP from './AboutP'

type Props = {}

const AboutElements = (props: Props) => {
  const [show, setShow] = useState(false)
  return (
    <motion.div animate={{ height: show ? 'auto' : '16rem' }} className={` relative h-64 `}>
      <div
        className={`  border rounded-2xl bg-[url('/topography.svg')] grid items-center grid-cols-1 md:grid-cols-2 text-lg md:text-xl after:w-full after:transition-all after:duration-500 after:h-full  after:absolute overflow-hidden after:inset-0 after:bg-gradient-to-t  after:from-background h-full after:pointer-events-none pb-14 ${
          show ? ' after:to-20% after:from-5% ' : '  after:to-100%'
        }`}
      >
        <div className=" bg-gradient-to-b from-background to-background/30 h-full py-10">
          <AboutP text="Jesteśmy firmą działająca od 2015, która stoi na przecięciu kreatywności i technologii, oferując kompleksowe rozwiązania w dziedzinie projektowania stron internetowych." />

          <AboutP text="Nasz zespół doświadczonych projektantów, programistów i specjalistów od marketingu cyfrowego działa z pasją i zaangażowaniem, aby dostarczyć klientom strony internetowe, które nie tylko wyglądają świetnie, ale także skutecznie przyciągają uwagę użytkowników i generują zyski." />
        </div>
        <div className=" md:bg-gradient-to-b md:from-background md:to-background/30 h-full md:py-10 pb-5">
          <AboutP text="Dążymy do zrozumienia indywidualnych potrzeb klientów, tworząc spersonalizowane rozwiązania od prostych wizytówek do zaawansowanych platform e-commerce. Nasze podejście opiera się na ciągłym doskonaleniu, śledzeniu trendów i wykorzystaniu najlepszych praktyk, by zapewnić klientom przewagę konkurencyjną." />

          <AboutP text="Zaufało nam już wielu klientów, którym pomogliśmy osiągnąć sukces w świecie internetowym. Dołącz do naszej rodziny klientów i razem z nami zdobądź przewagę w dzisiejszym cyfrowym świecie biznesu." />
        </div>
      </div>
      <Button
        className=" absolute bottom-0 left-1/2 -translate-x-1/2 z-10 border-primary border bg-transparent shadow-xl shadow-black translate-y-5"
        onClick={() => setShow(!show)}
      >
        {show ? 'Pokaż mniej' : 'Pokaż więcej'}
      </Button>
    </motion.div>
  )
}

export default AboutElements
