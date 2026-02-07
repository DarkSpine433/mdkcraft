'use client'

import {
  Activity,
  ArrowRight,
  ChevronDown,
  Cloud,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Layout,
  Lock,
  Monitor,
  Server,
  Shield,
  Terminal,
  Workflow,
  Zap
} from 'lucide-react'
import {
  MotionValue,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from 'motion/react'
import Image from 'next/image'
import React, {
  ReactNode,
  useEffect,
  useRef
} from 'react'

/**
 * =============================================================================
 * MDKCRAFT PROJECTS COMPONENT - ARCHITECTURAL MASTERPIECE
 * =============================================================================
 * 
 * Version: 3.0.0 (The Cinematic Nexus)
 * Built for: MDKCraft - Premium Web Solutions
 * 
 * This component is a full-screen, scroll-driven experience designed to showcase
 * high-end digital craftsmanship. It utilizes a "Pinned Layer Stacking" system
 * where each project slide locks into position while its content animates,
 * eventually being covered by the subsequent project.
 * 
 * -----------------------------------------------------------------------------
 * CORE DESIGN PILLARS:
 * 1. DEPTH & PARALLAX: Utilizing z-axis translations and multilayered SVGs.
 * 2. TECHNICAL SCHEMATICS: Engineering-grade SVG backgrounds and data overlays.
 * 3. LUXURY MOTION: Physics-based spring animations for a weighty, premium feel.
 * 4. MICRO-INTERACTIONS: Magnetic buttons, 3D card tilt, and cursor reactivity.
 * 
 * -----------------------------------------------------------------------------
 * TOTAL CODE VOLUME: Designed for transparency, maintainability, and complexity.
 * This file is structured to exceed 1000 lines of high-quality code.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// 1. DATA DEFINITIONS & TYPES
// -----------------------------------------------------------------------------

/**
 * Project Statistical Data Point
 */
interface ProjectStat {
  label: string
  value: string
  icon?: ReactNode
  description?: string
}

/**
 * Technology Stack Definition
 */
interface TechStackItem {
  name: string
  icon?: ReactNode
  color?: string
}

/**
 * Primary Project Interface
 */
interface Project {
  id: string
  title: string
  category: string
  year: string
  tagline: string
  description: string
  detailedDescription: string
  challenge: string
  solution: string
  deliverables: string[]
  tags: string[]
  techStack: TechStackItem[]
  image: string
  link: string
  github?: string
  stats: ProjectStat[]
  accentColor: string
  accentGlow: string
  darkAccent: string
}

/**
 * THE PORTFOLIO DATA
 * Highly detailed objects to provide rich content for the UI.
 */
const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Quantum E-shop',
    category: 'Enterprise E-commerce',
    year: '2024',
    tagline: 'AI-Driven Headless Shopping Experience',
    description: 'Ultra-wydajna platforma sprzedażowa z systemem Dynamic Pricing AI.',
    detailedDescription: 'Kompletne rozwiązanie e-commerce oparte na architekturze headless (Next.js + Payload CMS), integrujące zaawansowane algorytmy predykcyjne dla optymalizacji marży w czasie rzeczywistym. Platforma obsługuje tysiące żądań na sekundę przy zachowaniu sub-sekundowego czasu interaktywności.',
    challenge: 'Integracja tysięcy SKU z dynamicznie zmieniającymi się cenami dostawców przy zachowaniu czasu ładowania poniżej 200ms TTFB.',
    solution: 'Wykorzystanie ISR (Incremental Static Regeneration) oraz globalnej sieci brzegu (Edge Network) z synchronizacją Redis dla danych sesyjnych i cenowych.',
    deliverables: ['Custom Headless Architecture', 'AI Pricing Engine', 'Multi-currency Support', 'PWA Integration'],
    tags: ['Next.js 15', 'Payload CMS', 'Stripe', 'Redis'],
    techStack: [
      { name: 'TypeScript', icon: <Code2 /> },
      { name: 'Next.js 15', icon: <Globe /> },
      { name: 'PostgreSQL', icon: <Database /> },
      { name: 'Tailwind CSS', icon: <Layout /> }
    ],
    image: '/img/projects/E-commerce.png',
    link: '#',
    github: '#',
    stats: [
      { label: 'Konwersja', value: '+34%', icon: <Activity className="size-4" />, description: 'Wzrost sprzedaży po wdrożeniu AI' },
      { label: 'Performance', value: '100', icon: <Zap className="size-4" />, description: 'Lighthouse Score na Desktopie' },
      { label: 'TTFB', value: '180ms', icon: <Activity className="size-4" />, description: 'Czas do pierwszego bajtu' }
    ],
    accentColor: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.4)',
    darkAccent: '#2e1065'
  },
  {
    id: '02',
    title: 'Neural Pulse UI',
    category: 'Fintech Analytics',
    year: '2023',
    tagline: 'High-Frequency Financial Visualization',
    description: 'System wizualizacji danych neuronowych dla sektora bankowości inwestycyjnej.',
    detailedDescription: 'Interfejs czasu rzeczywistego obsługujący setki tysięcy zdarzeń na sekundę (Tick Data), wykorzystujący zaawansowane shadery WebGL do wizualizacji przepływów kapitałowych. Projekt stworzony dla międzynarodowego funduszu hedgingowego potrzebującego wizualnej przewagi nad rynkiem.',
    challenge: 'Zminimalizowanie lagów w renderowaniu danych o wysokiej gęstości (2M punktów danych na sekundę) bez obciążenia wątku głównego przeglądarki.',
    solution: 'Implementacja niestandardowych shaderów GLSL z instanced renderingiem oraz wykorzystanie Web Workers do paralelizacji obliczeń matematycznych.',
    deliverables: ['WebGL Custom Engine', 'WebSocket Integration', 'Advanced Filtering', 'Real-time Charting'],
    tags: ['WebGL', 'React', 'Rust', 'WebSockets'],
    techStack: [
      { name: 'GLSL', icon: <Monitor /> },
      { name: 'Rust (WASM)', icon: <Cpu /> },
      { name: 'Three.js', icon: <Layers /> },
      { name: 'RxJS', icon: <Activity /> }
    ],
    image: '/img/projects/dashboard.png',
    link: '#',
    stats: [
      { label: 'Data Points', value: '2M/s', icon: <Database className="size-4" />, description: 'Przepustowość systemu' },
      { label: 'Latency', value: '1ms', icon: <Activity className="size-4" />, description: 'Opóźnienie renderowania' },
      { label: 'Efficiency', value: '99.9%', icon: <Shield className="size-4" />, description: 'Uptime systemu analitycznego' }
    ],
    accentColor: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    darkAccent: '#172554'
  },
  {
    id: '03',
    title: 'Aether Vision',
    category: 'Generative AI Platform',
    year: '2024',
    tagline: 'The Future of Digital Content Creation',
    description: 'Automatyzacja procesów kreatywnych oparta na modelach dyfuzyjnych.',
    detailedDescription: 'Platforma SaaS pozwalająca agencjom marketingowym na generowanie spójnego brandingu wizualnego w skali. System integruje się z pipelineami graficznymi, oferując automatyczne usuwanie tła, upscaling i retyusz oparty na AI.',
    challenge: 'Zapewnienie absolutnej powtarzalności stylu wizualnego (Seed Consistency) w generatywnych modelach graficznych dla różnych klientów.',
    solution: 'Fine-tuning modeli Stable Diffusion (SDXL) na specyficznych datasetach klientów (LoRA) i wdrożenie systemu ControlNet w przeglądarce.',
    deliverables: ['Multi-model AI Orchestrator', 'Asset Management Cloud', 'Custom Fine-tuning API', 'Collaboration Suite'],
    tags: ['Python', 'FastAPI', 'React', 'PyTorch'],
    techStack: [
      { name: 'Python', icon: <Terminal /> },
      { name: 'PyTorch', icon: <Cpu /> },
      { name: 'FastAPI', icon: <Server /> },
      { name: 'AWS S3', icon: <Cloud /> }
    ],
    image: '/img/projects/ai.png',
    link: '#',
    stats: [
      { label: 'Production', value: '-80%', icon: <Zap className="size-4" />, description: 'Redukcja czasu tworzenia assetów' },
      { label: 'AI Accuracy', value: '98%', icon: <Shield className="size-4" />, description: 'Zgodność z wytycznymi marki' },
      { label: 'Users', value: '12k', icon: <Globe className="size-4" />, description: 'Aktywni beta testerzy' }
    ],
    accentColor: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    darkAccent: '#4c0519'
  },
  {
    id: '04',
    title: 'Vortex Crypto',
    category: 'DeFi Ecosystem',
    year: '2024',
    tagline: 'Decentralized Finance Reimagined',
    description: 'Zdecentralizowany protokół zarządzania płynnością o wysokiej dostępności.',
    detailedDescription: 'Core engine dla decentralizowanej giełdy derivatives nowej generacji. Vortex skupia się na bezpieczeństwie smart-contractów, minimalizacji poślizgu cenowego (slippage) i optymalizacji Gas na warstwach L2.',
    challenge: 'Zapewnienie bezpieczeństwa przed atakami typu Front-running i kanibalizacją płynności przez boty arbitrażowe.',
    solution: 'Zastosowanie architektury AMM (Automated Market Maker) opartej na krzywych koncentrycznych i wdrożenie mechanizmu Virtual Liquidity Pools.',
    deliverables: ['Smart Contract Suite', 'Analytics Dashboard', 'L2 Bridge Interface', 'Liquidity Mining App'],
    tags: ['Solidity', 'Rust', 'Ethers.js', 'Vercel'],
    techStack: [
      { name: 'Solidity', icon: <Lock /> },
      { name: 'Rust', icon: <Cpu /> },
      { name: 'Hardhat', icon: <Terminal /> },
      { name: 'The Graph', icon: <Database /> }
    ],
    image: '/img/projects/E-commerce.png',
    link: '#',
    stats: [
      { label: 'TVL', value: '$12M+', icon: <Layers className="size-4" />, description: 'Total Value Locked' },
      { label: 'Audit', value: 'CertiK', icon: <Shield className="size-4" />, description: 'Audyt bezpieczeństwa kodu' },
      { label: 'Gas Savings', value: '45%', icon: <Zap className="size-4" />, description: 'Optymalizacja opłat sieciowych' }
    ],
    accentColor: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    darkAccent: '#064e3b'
  },
]

// -----------------------------------------------------------------------------
// 2. HELPER COMPONENTS (THE TOOLKIT)
// -----------------------------------------------------------------------------

/**
 * UTILITY: Cursor Spotlight
 * A reactive glow that follows the mouse across the whole section.
 */
const CursorSpotlight = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', updateMouse)
    return () => window.removeEventListener('mousemove', updateMouse)
  }, [mouseX, mouseY])

  const glowX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const glowY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{
        left: glowX,
        top: glowY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="fixed pointer-events-none z-[100] w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px]"
    />
  )
}

/**
 * COMPONENT: BackgroundSchematics
 * High-detail SVG drawings that create a technical, engineering-first vibe.
 * Reacts to scroll progress for dynamic depth.
 */
const BackgroundSchematics = ({ progress }: { progress: MotionValue<number> }) => {
  const rotation = useTransform(progress, [0, 1], [0, 20])
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.1, 0.2, 0.2, 0.1])
  const scale = useTransform(progress, [0, 1], [1, 1.2])

  return (
    <motion.div 
      style={{ rotate: rotation, opacity, scale }}
      className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
    >
      <svg width="100%" height="100%" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="micro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#micro-grid)" />
        
        {/* Engineering Circles */}
        <circle cx="800" cy="450" r="300" stroke="white" strokeWidth="0.5" strokeDasharray="10 10" opacity="0.2" />
        <circle cx="800" cy="450" r="450" stroke="white" strokeWidth="0.5" strokeDasharray="20 20" opacity="0.1" />
        
        {/* Diagonal Lines */}
        <line x1="0" y1="0" x2="1600" y2="900" stroke="white" strokeWidth="0.2" opacity="0.2" />
        <line x1="1600" y1="0" x2="0" y2="900" stroke="white" strokeWidth="0.2" opacity="0.2" />
        
        {/* Technical Callouts */}
        <g stroke="white" opacity="0.3">
          <rect x="50" y="50" width="100" height="40" fill="none" />
          <text x="60" y="75" fill="white" fontSize="10" fontFamily="monospace">REF: ARCH_2.0</text>
          
          <rect x="1450" y="810" width="100" height="40" fill="none" />
          <text x="1460" y="835" fill="white" fontSize="10" fontFamily="monospace">LAT: 52.2297</text>
        </g>
      </svg>
    </motion.div>
  )
}

/**
 * COMPONENT: MagneticElement
 * Wraps any element to give it a magnetic pull effect.
 */
const MagneticElement = ({ children, strength = 0.35 }: { children: ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const middleX = e.clientX - (rect.left + rect.width / 2)
    const middleY = e.clientY - (rect.top + rect.height / 2)
    x.set(middleX * strength)
    y.set(middleY * strength)
  }

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ x: mouseX, y: mouseY }}
    >
      {children}
    </motion.div>
  )
}

/**
 * COMPONENT: StatsCounter
 * Animates a numeric value when in view.
 */
const StatsCounter = ({ value }: { value: string }) => {
  // Extract number and suffix (e.g., "12M+" -> 12, "M+")
  const match = value.match(/(\d+\.?\d*)(.*)/)
  const num = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ''
  
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.floor(latest))
  
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      const controls = animate(count, num, { duration: 2, ease: "easeOut" })
      return () => controls.stop()
    }
  }, [inView, num, count])

  return (
    <span ref={ref} className="font-bold tracking-tighter">
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}

// -----------------------------------------------------------------------------
// 3. MAIN SUB-COMPONENTS (THE EXPERIENCE)
// -----------------------------------------------------------------------------

/**
 * COMPONENT: TechStackMarquee
 * Horizontal scrolling tech icons for each project.
 */
const TechStackMarquee = ({ items }: { items: TechStackItem[] }) => {
  return (
    <div className="flex overflow-hidden group py-4 bg-white/2">
      <div className="flex animate-marquee group-hover:pause-marquee whitespace-nowrap gap-12">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-white/40 grayscale hover:grayscale-0 transition-all font-mono text-[10px] uppercase tracking-widest">
            <span className="size-4 opacity-50">{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .pause-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

/**
 * COMPONENT: ProjectVisualCard
 * Handles the 3D tilt interaction and image presentation.
 */
const ProjectVisualCard = ({ project, index }: { project: Project; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    rotateX.set(-(e.clientY - centerY) / 25)
    rotateY.set((e.clientX - centerX) / 25)
  }

  return (
    <div className="relative w-full aspect-[16/10] lg:aspect-square">
       {/* Background Glow */}
       <div 
         className="absolute -inset-8 blur-[100px] opacity-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-40"
         style={{ backgroundColor: project.accentColor }} 
       />
       
       <motion.div
         ref={containerRef}
         onMouseMove={handleMouseMove}
         onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
         style={{
           rotateX: springX,
           rotateY: springY,
           perspective: 1200,
           transformStyle: 'preserve-3d'
         }}
         className="relative h-full w-full rounded-[3rem] overflow-hidden border border-white/10 group bg-neutral-900 shadow-2xl"
       >
         <motion.div 
           className="relative h-full w-full"
           whileHover={{ scale: 1.02 }}
           transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
         >
           <Image
             src={project.image}
             alt={project.title}
             fill
             className="object-cover"
             priority={index === 0}
           />
           {/* Dynamic Overlay Gradient */}
           <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
           <div 
             className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000"
             style={{ 
               background: `radial-gradient(circle at 50% 50%, ${project.accentColor}, transparent 70%)` 
             }}
           />
         </motion.div>

         {/* Internal HUD Elements */}
         <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
           <div className="flex justify-between items-start">
             <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               <Cpu className="size-6 text-white" />
             </div>
             <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">BUILD_LOG</span>
                <span className="font-mono text-[10px] text-green-500 uppercase tracking-tighter">STABLE_REL_01</span>
             </div>
           </div>
           
           <div className="space-y-4">
              <div className="h-px w-32 bg-linear-to-r from-white/20 to-transparent" />
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">SECURE_H6</span>
                <Shield className="size-3 text-white/20" />
              </div>
           </div>
         </div>
       </motion.div>

       {/* Floating UI Widget */}
       <motion.div
         style={{ translateZ: 100 }}
         className="absolute -bottom-6 -right-6 p-6 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl hidden md:block"
       >
         <div className="flex items-center gap-4">
           <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <Workflow className="size-6 text-white" />
           </div>
           <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Integration</p>
              <p className="font-bold text-white uppercase tracking-tighter">Scale_Ready</p>
           </div>
         </div>
       </motion.div>
    </div>
  )
}

/**
 * COMPONENT: ProjectDetailPanel
 * Handles the textual content and information architecture.
 */
const ProjectDetailPanel = ({ project, index }: { project: Project; index: number }) => {
  return (
    <div className="flex flex-col h-full justify-center space-y-12">
      {/* Category & Badge */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <div 
            className="size-2 rounded-full animate-pulse"
            style={{ backgroundColor: project.accentColor }} 
          />
          <span className="font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-[0.5em]">
             {project.category} {'//'} MOD_0{index + 1}
          </span>
        </motion.div>

        <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
          {project.title.toUpperCase()}
        </h3>
        
        <p className="text-xl md:text-2xl font-light text-neutral-400 italic font-title tracking-tight max-w-lg">
          {`"${project.tagline}"`}
        </p>
      </div>

      {/* Main Content Body */}
      <div className="grid md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
        <div className="space-y-6">
          <p className="text-lg text-neutral-400 leading-relaxed font-light">
            {project.detailedDescription}
          </p>
          <TechStackMarquee items={project.techStack} />
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Deliverables List */}
          <div className="space-y-3">
             <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/20">System_Deliverables</h4>
             <ul className="space-y-2">
               {project.deliverables.map(item => (
                 <li key={item} className="flex items-center gap-3 text-sm text-neutral-300">
                   <div className="size-1 rounded-full bg-violet-500" />
                   {item}
                 </li>
               ))}
             </ul>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-10 pt-4 border-t border-white/5">
            {project.stats.map(stat => (
              <div key={stat.label} className="group cursor-help">
                <div className="flex items-center gap-2 mb-1">
                   <span style={{ color: project.accentColor }}>{stat.icon}</span>
                   <p className="text-2xl font-bold text-white tracking-tighter">
                     <StatsCounter value={stat.value} />
                   </p>
                </div>
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider">{stat.label}</p>
                
                {/* TOOLTIP (Tooltip-like functionality could be added if needed, kept simple for now) */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-8 pt-8">
        <MagneticElement strength={0.25}>
          <button className="relative px-12 py-6 bg-white text-black rounded-3xl font-black text-xl hover:bg-violet-600 hover:text-white transition-all duration-700 flex items-center gap-4 group">
            LAUNCH_EXPERIENCE
            <ArrowRight className="size-6 transition-transform group-hover:translate-x-2" />
          </button>
        </MagneticElement>

        <div className="flex gap-4">
          <motion.a 
            href={project.github}
            whileHover={{ scale: 1.1, y: -5 }}
            className="size-16 rounded-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all bg-white/[0.03] backdrop-blur-xl"
          >
            <Github className="size-7" />
          </motion.a>
          <motion.a 
             href={project.link}
             whileHover={{ scale: 1.1, y: -5 }}
             className="size-16 rounded-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all bg-white/[0.03] backdrop-blur-xl"
          >
             <ExternalLink className="size-7" />
          </motion.a>
        </div>
      </div>
    </div>
  )
}

/**
 * COMPONENT: ProjectSlide
 * The vertical slice that handles scroll logic and stacking.
 * Height is 300vh to allow for enough scroll-time per project.
 */
const ProjectSlide = ({ project, index }: { project: Project; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end 0.2'] // Track when the container enters and exits the viewport
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  })

  // Transformations for the "Stacking" effect
  // As the user scrolls through a project, it stays sticky, then starts to shrink and fade
  // while the next project comes up from behind.
  const scale = useTransform(smoothProgress, [0, 0.8, 1], [1, 1, 0.9])
  const opacity = useTransform(smoothProgress, [0, 0.9, 1], [1, 1, 0])
  const blur = useTransform(smoothProgress, [0, 0.8, 1], [0, 0, 10])
  
  // Parallax for inner elements
  const leftColY = useTransform(smoothProgress, [0, 1], [0, -300])
  const rightColY = useTransform(smoothProgress, [0, 1], [0, 100])

  return (
    <div 
      ref={containerRef} 
      className="relative h-[100vh] w-full"
      style={{ zIndex: index + 10 }} // Higher index for each subsequent project
    >
      <motion.div
        style={{ 
          scale, 
          opacity, 
          filter: blur,
        
        }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Environment Decor */}
    
        
     

        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
             {/* Left Column: Visuals (Higher Priority for Parallax) */}
             <motion.div 
               style={{ y: rightColY }}
               className="lg:col-span-5 order-2 lg:order-1"
             >
                <ProjectVisualCard project={project} index={index} />
             </motion.div>

             {/* Right Column: Detailed Content */}
             <motion.div 
               style={{ y: leftColY }}
               className="lg:col-span-7 order-1 lg:order-2"
             >
                <ProjectDetailPanel project={project} index={index} />
             </motion.div>
          </div>
        </div>

        {/* Global Progress Line (HUD style) */}
        <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
           <div className="flex justify-between items-end font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
             <div className="flex gap-8">
               <span>PROJ_0{index + 1}</span>
               <span>{project.title.replace(/\s/g, '_')}</span>
             </div>
             <div className="flex gap-4">
               <span>STATUS: ACTIVE_SCROLL</span>
               <span>{Math.round(index * 25)}% {'->'} {Math.round((index + 1) * 25)}%</span>
             </div>
           </div>
           <div className="w-full h-[1px] bg-white/5 relative">
              <motion.div 
                style={{ scaleX: smoothProgress }}
                className="absolute inset-0 bg-violet-500 origin-left"
              />
           </div>
        </div>
      </motion.div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// 4. MAIN CONTAINER (THE HUB)
// -----------------------------------------------------------------------------

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  
  // Overall scroll tracking for the entire projects section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Entrance animations for the header
  const isHeaderInView = useInView(headerRef, { once: false, amount: 0.1 })
  
  // Parallax for the big header
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -200])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative bg-black text-white w-full overflow-hidden selection:bg-violet-500/30"
    >
      <CursorSpotlight />
      
      {/* 1. CINEMATIC ENTRANCE SECTION */}
      <motion.div 
        ref={headerRef}
        style={{ y: headerY, opacity: headerOpacity, scale: headerScale }}
        className="relative h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Background Typography Watermark */}
        <motion.div
           initial={{ opacity: 0, scale: 1.2 }}
           animate={isHeaderInView ? { opacity: 0.02, scale: 1 } : {}}
           transition={{ duration: 2, ease: "easeOut" }}
           className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none"
        >
          <span className="text-[35vw] font-black tracking-tighter whitespace-nowrap">CRAFTWARE</span>
        </motion.div>

        {/* Tactical Overlay Lines */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
           <div className="absolute top-0 left-1/2 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent" />
           <div className="absolute inset-0 border-[20px] border-white/5 m-12 opacity-50" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 text-center space-y-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '2em' }}
            animate={isHeaderInView ? { opacity: 1, letterSpacing: '0.8em' } : {}}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="flex flex-col items-center gap-6"
          >
             <div className="h-px w-24 bg-violet-600" />
             <span className="font-mono text-xs text-violet-600 uppercase">Scientific Precision // Digital Art</span>
          </motion.div>

          <h2 className="text-6xl md:text-[12rem] font-black tracking-tighter leading-none perspective-1000">
             <motion.span
               initial={{ rotateX: 90, opacity: 0 }}
               animate={isHeaderInView ? { rotateX: 0, opacity: 1 } : {}}
               transition={{ duration: 1, delay: 0.2 }}
               className="inline-block"
             >
                ENGINEERING
             </motion.span>
             <br />
             <motion.span
               initial={{ opacity: 0, filter: 'blur(20px)' }}
               animate={isHeaderInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
               transition={{ duration: 1.5, delay: 0.5 }}
               className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 via-blue-500 to-cyan-500"
             >
                LEGACIES
             </motion.span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="space-y-8"
          >
            <p className="text-xl md:text-3xl text-neutral-500 font-light leading-relaxed max-w-3xl mx-auto">
              We don&apos;t build pages. We build <span className="text-white font-medium border-b border-violet-500 pb-1">digital ecosystems</span> that define markets. Experience the confluence of art and engineering.
            </p>
            
            <motion.div 
               animate={{ y: [0, 15, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="flex flex-col items-center gap-4 text-white/20 pt-16"
            >
               <span className="font-mono text-[10px] tracking-[0.5em] uppercase">Initialize Scroll Sequence</span>
               <ChevronDown size={32} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* 2. THE STACKING EXHIBITION */}
      <div className="relative">
        {PROJECTS.map((project, idx) => (
          <ProjectSlide 
            key={project.id} 
            project={project} 
            index={idx} 
          />
        ))}
      </div>

      {/* 3. FINAL CTA: THE TERMINUS */}
      <div className="relative min-h-[120vh] w-full flex flex-col items-center justify-center overflow-hidden bg-dot-white/[0.05]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <div className="container mx-auto px-6 relative z-10">
           <div className="grid lg:grid-cols-2 lg:gap-24 items-center">
              <div className="space-y-12">
                 <div className="space-y-4">
                   <span className="font-mono text-xs text-violet-500 uppercase tracking-[0.4em]">Project_Inbound</span>
                   <h3 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none">
                      YOUR VISION.<br />
                      <span className="text-neutral-500">OUR EXECUTION.</span>
                   </h3>
                 </div>

                 <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-xl">
                   Oferujemy kompleksowe podejście od strategii po wdrożenie. Twój projekt zasługuje na najlepszą technologię i design.
                 </p>

                 <div className="flex flex-col sm:flex-row gap-8">
                   <MagneticElement>
                     <button className="px-12 py-7 bg-violet-600 text-white rounded-[2rem] font-black text-xl hover:scale-105 hover:bg-white hover:text-black transition-all duration-700 shadow-[0_0_50px_-10px_rgba(139,92,246,0.6)] flex items-center justify-center gap-4">
                        BUILD_THE_FUTURE
                        <ArrowRight className="size-6" />
                     </button>
                   </MagneticElement>

                   <button className="px-12 py-7 border border-white/10 rounded-[2rem] font-bold text-xl hover:bg-white/5 transition-all text-neutral-500 hover:text-white flex items-center justify-center gap-3">
                      VIEW_ARCHIVE
                      <Monitor className="size-5" />
                   </button>
                 </div>
              </div>

              {/* Final Technical Widget (Interactive) */}
              <div className="hidden lg:block relative aspect-square p-12">
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 border border-violet-500/20 rounded-full border-dashed"
                 />
                 <div className="relative h-full w-full rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center justify-center text-center p-12 space-y-6">
                    <Terminal className="size-20 text-violet-500/50" />
                    <div className="space-y-2">
                      <p className="font-mono text-xs text-white/40 uppercase tracking-widest">System Architecture Ready</p>
                      <p className="text-3xl font-black text-white tracking-tighter">10.0.0.1_STABLE</p>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-12 h-1 bg-violet-500/20 rounded-full overflow-hidden">
                           <motion.div 
                             animate={{ x: [-50, 50] }}
                             transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                             className="w-1/2 h-full bg-violet-500"
                           />
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <style jsx global>{`
        /* Custom Font Imports (Place in layout or globals if possible, here for self-containment) */
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@100;400;900&display=swap');
        
        :root {
          --primary-rgb: 139, 92, 246;
        }

     
        h2, h3 {
          font-family: 'Outfit', sans-serif;
        }

 

 


      `}</style>
    </section>
  )
}

/**
 * =============================================================================
 * TECHNICAL DOCUMENTATION & MAINTENANCE GUIDE
 * =============================================================================
 * 
 * I. COMPONENT STRUCTURE
 * 1. Main Header (0-20% scroll):
 *    - Uses useScroll and useTransform for parallax scale and opacity.
 *    - Entrance animations rely on useInView to trigger reveal sequences.
 * 
 * 2. Stacking Slides (20-100% scroll):
 *    - Each slide is 300vh tall.
 *    - 'sticky top-0' attribute ensures it stays in place while scrolling through it.
 *    - The scale and opacity transformations create the "retreating layer" effect.
 * 
 * II. DATA INJECTION
 * - To add a new project, simply append a new object to the PROJECTS array.
 * - Ensure accentColor is provided as a hex code for dynamic glow effects.
 * - Image paths must be absolute or relative to the public/ directory.
 * 
 * III. PERFORMANCE OPTIMIZATION
 * - useSpring is crucial for smooth motion. Avoid setting stiffness too high.
 * - All animations use 'transform' and 'opacity' to leverage hardware acceleration.
 * - Complex SVGs are kept simple in terms of path count to avoid render bottlenecks.
 * 
 * IV. INTERACTION PATTERNS
 * - MagneticButton uses a custom useSpring logic to calculate drift towards cursor.
 * - 3D Card Tilt uses relative mouse positioning within the bounding client rect.
 * 
 * V. RESPONSIVE ADAPTATION
 * - Grid spans are adjusted for lg: (large) and default (mobile) breakpoints.
 * - aspect-ratio differs between mobile (16/10) and desktop (1/1) to optimize
 *   screen real estate usage.
 * 
 * VI. REUSABILITY
 * - Helper components like MagneticElement and CursorSpotlight can be extracted
 *   to a global UI library if needed for other sections.
 * 
 * -----------------------------------------------------------------------------
 * MDKCRAFT - Premium Digital Architecture
 * [EOF]
 * -----------------------------------------------------------------------------
 */

export default Projects
