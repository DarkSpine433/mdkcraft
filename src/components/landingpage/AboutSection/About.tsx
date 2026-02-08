'use client'

import MagneticButton from '@/components/ui/magneticBotton'
import { cn } from '@/utilities/cn'
import {
  Box,
  Code2,
  Database,
  Globe,
  Layers,
  LucideIcon,
  Network,
  Search,
  Server,
  Settings,
  Shield,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react'
import { Variants, motion, useInView, useMotionValue, useScroll, useTransform } from 'motion/react'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

// -----------------------------------------------------------------------------
// TYPES & INTERFACES
// -----------------------------------------------------------------------------

type SectionIdentifier = 'intro' | 'philosophy' | 'stack' | 'process' | 'security' | 'team'

interface Coordinate {
  x: number
  y: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  targetAlpha: number
}

interface TechStackItem {
  name: string
  category: 'frontend' | 'backend' | 'devops' | 'mobile'
  icon: LucideIcon
  description: string
  proficiency: number // 0-100
}

interface ProcessStep {
  id: number
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  features: string[]
}

// -----------------------------------------------------------------------------
// CONSTANTS & CONFIGURATION
// -----------------------------------------------------------------------------

const SECTION_SPACING = 'py-32 md:py-48'
const PRIMARY_COLOR = '#8b5cf6' // violet-500
const SECONDARY_COLOR = '#d946ef' // fuchsia-500

const ANIMATION_VARIANTS: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  pathDraw: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  },
}

const TECH_STACK: TechStackItem[] = [
  {
    name: 'Next.js 14',
    category: 'frontend',
    icon: Box,
    description: 'App Router ready framework',
    proficiency: 98,
  },
  {
    name: 'React 19',
    category: 'frontend',
    icon: Code2,
    description: 'Cutting edge UI library',
    proficiency: 99,
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    icon: Code2,
    description: 'Type-safe development',
    proficiency: 95,
  },
  {
    name: 'Rust',
    category: 'backend',
    icon: Settings,
    description: 'High-performance systems',
    proficiency: 85,
  },
  {
    name: 'PostgreSQL',
    category: 'backend',
    icon: Database,
    description: 'Advanced relational data',
    proficiency: 92,
  },
  {
    name: 'Kubernetes',
    category: 'devops',
    icon: Server,
    description: 'Container orchestration',
    proficiency: 88,
  },
  {
    name: 'AWS',
    category: 'devops',
    icon: Network,
    description: 'Cloud infrastructure',
    proficiency: 90,
  },
  {
    name: 'React Native',
    category: 'mobile',
    icon: Smartphone,
    description: 'Cross-platform mobile',
    proficiency: 94,
  },
]

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Discovery & Strategy',
    subtitle: 'Rygorystyczna Analiza',
    description:
      'Zanim napiszemy pierwszą linię kodu, dekompozytujemy Twój model biznesowy na czynniki pierwsze. Nasz proces discovery to nie spotkania przy kawie - to audyt technologiczny i strategiczny.',
    icon: Search,
    features: [
      'Analiza rynku',
      'Mapowanie interesariuszy',
      'Specyfikacja wymagań (SRS)',
      'Studium wykonalności',
    ],
  },
  {
    id: 2,
    title: 'System Architecture',
    subtitle: 'Projektowanie Fundamentów',
    description:
      'Tworzymy skalowalne, bezpieczne i wydajne architektury systemowe. Stawiamy na mikroserwisy (gdy to uzasadnione) lub modularne monolity, zawsze z myślą o przyszłym rozwoju.',
    icon: Layers,
    features: [
      'Diagram C4',
      'Modelowanie Danych',
      'Wybór Stacku Technologicznego',
      'Strategia Cloud-Native',
    ],
  },
  {
    id: 3,
    title: 'High-Performance Dev',
    subtitle: 'Kodowanie Standardu Enterprise',
    description:
      'Nasz kod jest czysty, testowalny i udokumentowany. Stosujemy TDD, DDD i SOLID. Review kodu jest u nas religią, a pipeline CI/CD kręgosłupem projektu.',
    icon: Terminal,
    features: ['Clean Architecture', '100% Code Coverage', 'Automated Testing', 'Code Reviews'],
  },
  {
    id: 4,
    title: 'Deployment & Scale',
    subtitle: 'Globalna Dystrybucja',
    description:
      'Wdrażamy systemy w oparciu o konteneryzację (Docker/K8s) i strategie Zero-Downtime. Monitorujemy wydajność w czasie rzeczywistym, reagując na anomalie w milisekundy.',
    icon: Globe,
    features: [
      'Blue-Green Deployment',
      'Auto-scaling',
      'Real-time Monitoring',
      'Disaster Recovery',
    ],
  },
]

// -----------------------------------------------------------------------------
// UTILITY COMPONENTS
// -----------------------------------------------------------------------------

const GradientText = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span
    className={cn(
      'bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-slate-400',
      className,
    )}
  >
    {children}
  </span>
)

const SectionHeading = ({ children, subtitle }: { children: string; subtitle?: string }) => (
  <div className="mb-16 md:mb-24 text-center">
    {subtitle && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 mb-6"
      >
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20" />
        <span className="text-slate-400 font-mono text-xs uppercase tracking-[0.3em] font-semibold">
          {subtitle}
        </span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20" />
      </motion.div>
    )}
    <motion.h2
      variants={ANIMATION_VARIANTS.fadeInUp}
      initial="hidden"
      whileInView="visible"
      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
    >
      <GradientText>{children}</GradientText>
    </motion.h2>
  </div>
)

// -----------------------------------------------------------------------------
// COMPLEX SUB-COMPONENTS
// -----------------------------------------------------------------------------

/**
 * StarfieldCanvas: A procedural particle system interacting with mouse
 * Renders on a canvas for max performance
 */
const StarfieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.w === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size.w
    canvas.height = size.h

    const particles: Particle[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * size.w,
      y: Math.random() * size.h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5,
      alpha: Math.random() * 0.5 + 0.1,
      targetAlpha: Math.random() * 0.5 + 0.1,
    }))

    let animationId: number
    let time = 0

    const render = () => {
      time++
      ctx.clearRect(0, 0, size.w, size.h)

      // Draw connecting lines
      ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Bounce
        if (p.x < 0 || p.x > size.w) p.vx *= -1
        if (p.y < 0 || p.y > size.h) p.vy *= -1

        // Twinkle
        if (time % 10 === 0 && Math.random() > 0.9) {
          p.targetAlpha = Math.random() * 0.8 + 0.2
        }
        p.alpha += (p.targetAlpha - p.alpha) * 0.05

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Connect nearby
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationId)
  }, [size])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <canvas ref={canvasRef} />
    </div>
  )
}

/**
 * HoloCard: 3D Tilt Effect Card
 */
const HoloCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative rounded-2xl bg-slate-900/50 border border-white/10 p-1 backdrop-blur-xl transition-all duration-200 ease-out shadow-2xl group',
        className,
      )}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.08), transparent 40%)',
        }}
      />
      <div
        className="relative h-full w-full bg-[#0a0a0a]/80 rounded-xl overflow-hidden p-6 md:p-8"
        style={{ transform: 'translateZ(20px)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

/**
 * CircuitLines: SVG Animated background element
 */
const CircuitLines = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 100 H 200 L 250 150 H 500 L 550 100 H 1920"
          stroke="url(#circuit-grad)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.path
          d="M 1920 600 H 1500 L 1450 650 H 800 L 750 600 H 0"
          stroke="url(#circuit-grad)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            delay: 1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      </svg>
    </div>
  )
}

// -----------------------------------------------------------------------------
// MAIN SECTIONS
// -----------------------------------------------------------------------------

/**
 * 2. STATS & METRICS (Interactive)
 */
const MetricsSection = () => {
  return (
    <section className={cn('relative overflow-hidden bg-black', SECTION_SPACING)}>
      {' '}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Uptime Guarantee', value: '99.99%', icon: Zap, color: 'text-white' },
            { label: 'Global Latency', value: '< 35ms', icon: Globe, color: 'text-white' },
            { label: 'Security Score', value: 'A+', icon: Shield, color: 'text-white' },
            { label: 'Projects Shipped', value: '140+', icon: Box, color: 'text-violet-500' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
            >
              <stat.icon
                size={32}
                className={cn(
                  'mb-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300',
                  stat.color,
                )}
              />
              <span className="text-3xl md:text-5xl font-black text-white mb-2 font-mono tracking-tighter">
                {stat.value}
              </span>
              <span className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * 3. PROCESS TIMELINE (The "Magnum Opus" part)
 */
const ProcessTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.15', 'end 0.65'],
  })

  return (
    <section ref={containerRef} className={cn('relative overflow-hidden bg-black pt-44')}>
      <div className="absolute  inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-30" />
      <CircuitLines />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <div className="container mx-auto px-6 relative z-10 ">
        <SectionHeading subtitle="Workflow Methodology">Engineering Precision</SectionHeading>

        <div className="relative mt-32">
          {/* Running Line Background */}
          <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-1 bg-slate-800 -translate-x-1/2 hidden lg:block" />
          <motion.div
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
            className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white via-violet-500 to-white -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.3)] hidden lg:block"
          />

          <div className="space-y-32">
            {PROCESS_STEPS.map((step, index) => (
              <TimelineBlock key={step.id} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const TimelineBlock = ({ step, index }: { step: ProcessStep; index: number }) => {
  const isEven = index % 2 === 0
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px', once: false })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.2, x: isEven ? -20 : 20 }}
      transition={{ duration: 0.8 }}
      className={cn(
        'flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative',
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse',
      )}
    >
      {/* Center Node */}
      <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-white/10 z-20 flex items-center justify-center lg:block hidden">
        <motion.div
          animate={
            isInView
              ? { scale: [1, 1.1, 1], backgroundColor: '#ffffff' }
              : { scale: 1, backgroundColor: '#1e293b' }
          }
          transition={{ duration: 1 }}
          className="w-full h-full rounded-full"
        />
      </div>

      {/* Connector Mobile */}
      <div className="absolute left-[20px] top-0 bottom-0 w-1 bg-white/5 lg:hidden" />
      <div className="absolute left-[14px] top-8 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white] z-10 lg:hidden" />

      {/* Content Card */}
      <div
        className={cn('w-full lg:w-1/2 pl-12 lg:pl-0', isEven ? 'lg:text-right' : 'lg:text-left')}
      >
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono font-bold uppercase">
          Step 0{step.id}
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">{step.title}</h3>
        <h4 className="text-xl text-slate-400 mb-6 font-mono">{step.subtitle}</h4>
        <p
          className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl ml-auto mr-0 h-auto block"
          style={isEven ? { marginLeft: 'auto' } : { marginRight: 'auto' }}
        >
          {step.description}
        </p>

        <ul className={cn('flex flex-wrap gap-3', isEven ? 'justify-end' : 'justify-start')}>
          {step.features.map((f, i) => (
            <li
              key={i}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-slate-300 text-sm font-medium flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual/Icon Side */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <HoloCard className="w-full max-w-md aspect-square flex flex-col items-center justify-center bg-black">
          <div
            className={cn(
              'p-8 rounded-full bg-white/5 border border-white/10 mb-6 transition-all duration-700',
              isInView ? 'shadow-[0_0_80px_-20px_rgba(255,255,255,0.2)] scale-110' : '',
            )}
          >
            <step.icon size={64} className="text-white" strokeWidth={1} />
          </div>
          <div className="w-full px-8 space-y-3 opacity-50">
            <div
              className="h-2 w-full bg-slate-800 rounded animate-pulse"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="h-2 w-3/4 bg-slate-800 rounded animate-pulse"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="h-2 w-1/2 bg-slate-800 rounded animate-pulse"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </HoloCard>
      </div>
    </motion.div>
  )
}

/**
 * 5. CTA / FOOTER PREVIEW
 */
const FinalCTA = () => {
  return (
    <section className="relative py-32 border-y border-purple-500/20 overflow-hidden flex items-center justify-center">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-8xl font-black text-white mb-8"
        >
          ZBUDUJMY COŚ <br />
          <span className="text-white">NIEMOŻLIWEGO</span>
        </motion.h2>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12">
          Masz wizję, która wymaga technicznej perfekcji? Jesteśmy gotowi podjąć wyzwanie.
        </p>

        <MagneticButton className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]">
          Umów Się Na Konsultację
        </MagneticButton>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// MAIN EXPORT
// -----------------------------------------------------------------------------

export default function AboutPage() {
  return (
    <section className="bg-[#020408] min-h-screen text-slate-200 selection:bg-violet-500/30 selection:text-white overflow-hidden  relative  " id='about'>
      <ProcessTimeline />

      <MetricsSection />

      <FinalCTA />
    </section>
  )
}
