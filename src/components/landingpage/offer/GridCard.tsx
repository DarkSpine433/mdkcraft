'use client'

import { cn } from '@/utilities/cn'
import {
  ArrowUpRight,
  Code2,
  Gem,
  Layout,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import React, { useRef } from 'react'

// --- TYPY ---

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
  index: number
}

// --- KOMPONENT POMOCNICZY: ANIMOWANA IKONA SVG ---

const AnimatedIcon = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
      <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 text-neutral-400 group-hover:text-primary transition-colors duration-500">
        {icon}
      </div>
    </div>
  )
}

// --- KOMPONENT: BENTO CARD (Sercem jest interakcja myszy) ---

const FeatureCard = ({ title, description, icon, className, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Fizyka podążania światła
  const springConfig = { damping: 20, stiffness: 100 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${smoothX}px ${smoothY}px,
      rgba(var(--primary-rgb, 124, 58, 237), 0.15),
      transparent 80%
    )
  `

  const borderMask = useMotionTemplate`
    radial-gradient(
      300px circle at ${smoothX}px ${smoothY}px,
      rgba(var(--primary-rgb, 124, 58, 237), 1),
      transparent 100%
    )
  `

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 p-6 md:p-8 hover:border-transparent transition-colors duration-500',
        className,
      )}
    >
      {/* Dynamiczne podświetlenie krawędzi (Border Beam) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl z-10"
        style={{
          background: borderMask,
          WebkitMaskImage: 'linear-gradient(white, white), linear-gradient(white, white)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Holograficzny Gradient Tła */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background }}
      />

      {/* Treść Karty */}
      <div className="relative z-20">
        <div className="flex justify-between items-start mb-6">
          <AnimatedIcon icon={icon} />
          <motion.div
            whileHover={{ rotate: 45 }}
            className="p-2 rounded-full bg-white/5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-neutral-400 leading-relaxed text-sm md:text-base line-clamp-3 group-hover:text-neutral-300 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Dekoracyjny szlaczek SVG na dole karty */}
      <div className="absolute bottom-0 left-0 right-0 h-1 w-full overflow-hidden opacity-20 group-hover:opacity-100 transition-opacity duration-500">
        <svg width="100%" height="4">
          <motion.line
            x1="0"
            y1="2"
            x2="100%"
            y2="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-primary"
            animate={{ x: [0, -40] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </div>
    </motion.div>
  )
}

// --- GŁÓWNY KOMPONENT ---

const GridCard = () => {
  // Dane dla pierwszej sekcji Bento (Usługi)
  const features = [
    {
      title: 'SEO & Visibility',
      description:
        'Zwiększ widoczność swojej strony w wynikach wyszukiwania dzięki zaawansowanym algorytmom optymalizacji treści i struktury danych.',
      icon: <Search size={24} />,
      className: 'md:col-span-2 md:row-span-1',
    },
    {
      title: 'Performance',
      description: 'Poprawa wydajności i dostosowanie do wymagań Core Web Vitals.',
      icon: <Zap size={24} />,
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Design Experience',
      description:
        'Kreatywne rozwiązania, estetyka i funkcjonalność, która konwertuje odwiedzających w lojalnych klientów.',
      icon: <Layout size={24} />,
      className: 'md:col-span-1 md:row-span-2',
    },
    {
      title: 'Cyber Security',
      description:
        'Gwarancja ochrony danych oraz spokój użytkowników dzięki szyfrowaniu klasy bankowej.',
      icon: <ShieldCheck size={24} />,
      className: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Mobile First',
      description:
        "Twoja strona będzie wyglądać perfekcyjnie na iPhone'ach, Androidach i tabletach.",
      icon: <Smartphone size={24} />,
      className: 'md:col-span-1 md:row-span-1',
    },
  ]

  // Dane dla drugiej sekcji (Dlaczego my)
  const advantages = [
    {
      title: 'Indywidualne podejście',
      description:
        'Rozumiemy, że każdy biznes jest unikalny. Nasze podejście opiera się na dogłębnej analizie celów biznesowych.',
      icon: <Code2 size={24} />,
      className: 'md:col-span-1',
    },
    {
      title: 'Długofalowa współpraca',
      description:
        'Relacja nie kończy się po projekcie. Oferujemy wsparcie techniczne i doradztwo strategiczne online.',
      icon: <TrendingUp size={24} />,
      className: 'md:col-span-1',
    },
    {
      title: 'Transparentne ceny',
      description:
        'Brak ukrytych kosztów. Elastyczne podejście do budżetu dostosowane do Twoich potrzeb.',
      icon: <Gem size={24} />,
      className: 'md:col-span-1',
    },
  ]

  return (
    <section id='services' className="relative w-full py-24 bg-black overflow-hidden">
      {/* Efekt tła (Grid) - identyczny jak w Hero dla spójności */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <div className="relative z-10 container mx-auto px-6">
        {/* NAGŁÓWEK */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Nasza Oferta 2025
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 via-neutral-300 to-neutral-500">
              W Naszej Ofercie
            </span>
            <br />
            <span className="text-primary">Możesz Znaleźć</span>
          </h2>

          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            Unikalne rozwiązania dopasowane do Twoich potrzeb, które nie tylko spełnią oczekiwania,
            ale wyznaczą nowe standardy w Twojej branży.
          </p>
        </div>

        {/* BENTO GRID 1 - USŁUGI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-12">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              index={i}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </div>

        {/* PRZERWA / DEKORACJA */}
        <div className="flex items-center gap-4 my-20">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="p-2 rounded-full border border-white/10">
            <Gem className="text-neutral-500 w-5 h-5" />
          </div>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* BENTO GRID 2 - WARTOŚCI */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Dlaczego warto nam zaufać?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {advantages.map((adv, i) => (
            <FeatureCard
              key={i}
              index={i + 5}
              title={adv.title}
              description={adv.description}
              icon={adv.icon}
              className={adv.className}
            />
          ))}
        </div>
      </div>

      {/* BACKGROUND BLOBS - Subtelne dekoracje w tle */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  )
}

export default GridCard
