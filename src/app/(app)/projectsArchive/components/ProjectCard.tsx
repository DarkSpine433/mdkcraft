'use client'

import { cn } from '@/utilities/cn'
import { Activity, BarChart, Cloud, Cpu, Lock, Network, Package, Search, Sparkles, Terminal, Zap } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Project, getIcon } from '../types/project'
import { ProjectStatsCard } from './ProjectStatsCard'

// -----------------------------------------------------------------------------
// 1. DYNAMIC SVG PREVIEW COMPONENTS (The "Heart" of the visual variety)
// -----------------------------------------------------------------------------

/**
 * Generates a unique "Digital Schematic" for each project using SVG.
 * This is much more flexible than static images and looks amazing.
 */
const ProjectVisualizer = ({ project }: { project: Project }) => {
    const seed = useMemo(() => {
        let h = 0
        for (let i = 0; i < project.id.length; i++) {
            h = Math.imul(31, h) + project.id.charCodeAt(i) | 0
        }
        return h
    }, [project.id])

    const random = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000
        return x - Math.floor(x)
    }

    // Generate random paths/shapes for the background
    const backgroundElements = useMemo(() => {
        const localRandom = (offset: number) => {
            const x = Math.sin(seed + offset) * 10000
            return x - Math.floor(x)
        }
        return Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            x: 10 + localRandom(i * 10) * 80,
            y: 10 + localRandom(i * 20) * 80,
            r: 5 + localRandom(i * 30) * 15,
            opacity: 0.05 + localRandom(i * 40) * 0.1
        }))
    }, [seed])

    const gridColor = project.theme.primary + '22'
    const accentColor = project.theme.primary

    return (
        <div className="relative w-full h-full bg-[#050505] flex items-center justify-center p-4">
            {/* GRID BACKGROUND */}
            <div className="absolute inset-0" 
                style={{ 
                    backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }} 
            />

            <svg viewBox="0 0 400 300" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                {/* AMBIENT SHAPES */}
                {backgroundElements.map(el => (
                    <circle key={el.id} cx={el.x * 4} cy={el.y * 3} r={el.r * 2} fill={accentColor} opacity={el.opacity} />
                ))}

                {/* THE "CORE" VISUALIZATION BASED ON CATEGORY */}
                {project.category === 'AI/ML' && (
                    <g transform="translate(100, 50)">
                        <rect x="0" y="0" width="200" height="200" rx="10" fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="5 5" />
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.circle 
                                key={i}
                                cx={100 + Math.cos(i * Math.PI / 4) * 60}
                                cy={100 + Math.sin(i * Math.PI / 4) * 60}
                                r="4"
                                fill={accentColor}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                        <motion.path 
                            d="M 100 40 L 100 160 M 40 100 L 160 100" 
                            stroke={accentColor} 
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                        <rect x="80" y="80" width="40" height="40" fill={accentColor} opacity="0.2" rx="4" />
                        <Cpu x="85" y="85" size={30} color={accentColor} />
                    </g>
                )}

                {project.category === 'Blockchain' && (
                    <g transform="translate(50, 50)">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <g key={i} transform={`translate(${i * 80}, ${Math.sin(i) * 20 + 100}) rotate(${i * 10})`}>
                                <rect x="0" y="0" width="60" height="60" rx="8" fill="none" stroke={accentColor} strokeWidth="2" />
                                <Lock x="20" y="20" size={20} color={accentColor} />
                                {i < 3 && (
                                    <motion.path 
                                        d="M 60 30 L 80 30" 
                                        stroke={accentColor} 
                                        strokeWidth="1" 
                                        strokeDasharray="4 2"
                                        animate={{ strokeDashoffset: [0, -6] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </g>
                        ))}
                    </g>
                )}

                {project.category === 'FinTech' && (
                    <g transform="translate(50, 50)">
                        <motion.path 
                            d="M 0 150 Q 50 100 100 180 T 200 120 T 300 160" 
                            fill="none" 
                            stroke={accentColor} 
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 2 }}
                        />
                         <motion.path 
                            d="M 0 150 Q 50 100 100 180 T 200 120 T 300 160" 
                            fill="none" 
                            stroke={accentColor} 
                            strokeWidth="10"
                            opacity="0.1"
                        />
                        <Zap x="190" y="100" size={30} color={accentColor} />
                        <BarChart x="20" y="20" size={40} color={accentColor} opacity="0.3" />
                    </g>
                )}

                 {project.category === 'E-commerce' && (
                    <g transform="translate(50, 50)">
                         <rect x="0" y="0" width="300" height="200" rx="12" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.3" />
                         <rect x="20" y="20" width="120" height="100" rx="4" fill={accentColor} opacity="0.1" />
                         <rect x="160" y="20" width="120" height="15" rx="2" fill={accentColor} opacity="0.2" />
                         <rect x="160" y="45" width="120" height="15" rx="2" fill={accentColor} opacity="0.2" />
                         <rect x="160" y="70" width="80" height="15" rx="2" fill={accentColor} opacity="0.2" />
                         <Package x="60" y="50" size={40} color={accentColor} />
                         <motion.circle 
                            cx="200" cy="150" r="25" 
                            fill="none" stroke={accentColor} strokeWidth="2"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                         />
                         <Search x="190" y="140" size={20} color={accentColor} />
                    </g>
                )}

                {/* GENERIC FALLBACK FOR OTHER CATEGORIES */}
                {['SaaS', 'IoT', 'Healthcare', 'Social'].includes(project.category) && (
                    <g transform="translate(100, 75)">
                         <motion.rect 
                            x="0" y="0" width="200" height="150" 
                            rx="15" fill="none" stroke={accentColor} strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                         />
                         <g transform="translate(20, 20)">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <rect 
                                    key={i}
                                    x={(i % 4) * 40} 
                                    y={Math.floor(i / 4) * 35} 
                                    width="30" height="25" 
                                    rx="2" fill={accentColor} opacity={0.1 + random(i) * 0.2} 
                                />
                            ))}
                         </g>
                         <Boxes category={project.category} color={accentColor} />
                    </g>
                )}

                {/* DECORATIVE LABELS */}
                <text x="20" y="280" fill={accentColor} fontSize="8" fontFamily="monospace" opacity="0.5">
                    SYSTEM_REF: {project.id}
                </text>
                <text x="380" y="280" fill={accentColor} fontSize="8" fontFamily="monospace" opacity="0.5" textAnchor="end">
                    LATENCY: {(10 + random(99) * 40).toFixed(2)}ms
                </text>
            </svg>

            {/* FLOATING DATA OVERLAYS */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
                 <motion.div 
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="px-3 py-1 bg-black/80 border border-white/10 rounded text-[9px] font-mono text-neutral-500"
                 >
                    [STREAMING_DATAFEED_V2.1]
                 </motion.div>
                 <motion.div 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="px-3 py-1 bg-black/80 border border-white/10 rounded text-[9px] font-mono text-neutral-500"
                 >
                    NODES: {Math.floor(random(4) * 100 + 12)} ACTIVE
                 </motion.div>
            </div>
        </div>
    )
}

const Boxes = ({ category, color }: { category: string, color: string }) => {
    if (category === 'IoT') return <Network x="85" y="60" size={30} color={color} />
    if (category === 'Healthcare') return <Activity x="85" y="60" size={30} color={color} />
    if (category === 'SaaS') return <Cloud x="85" y="60" size={30} color={color} />
    return <Zap x="85" y="60" size={30} color={color} />
}

// -----------------------------------------------------------------------------
// 2. PROJECT CARD SUB-COMPONENTS (Timeline & Specs)
// -----------------------------------------------------------------------------

const ProjectMilestones = ({ project }: { project: Project }) => {
    return (
        <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                 <div className="h-px w-4 bg-neutral-800" />
                 DEVELOPMENT_CYCLE
            </h4>
            <div className="space-y-4">
                {project.milestones.map((m, i) => (
                    <div key={i} className="flex gap-4 group/m">
                         <div className="flex flex-col items-center">
                              <div className={cn(
                                  "size-2 rounded-full",
                                  m.completed ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]" : "bg-neutral-800"
                              )} />
                              {i < project.milestones.length - 1 && (
                                  <div className="w-px flex-1 bg-neutral-900 group-hover/m:bg-neutral-800 transition-colors my-1" />
                              )}
                         </div>
                         <div className="pb-4">
                              <div className="flex items-center gap-3 mb-1">
                                  <span className="text-[10px] font-mono text-neutral-600">{m.date}</span>
                                  <span className={cn(
                                      "text-[9px] font-bold uppercase",
                                      m.completed ? "text-violet-400" : "text-neutral-600"
                                  )}>
                                    {m.title}
                                  </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 leading-tight pr-4">
                                {m.description}
                              </p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ProjectSpecs = ({ project }: { project: Project }) => {
    // Deterministic seeded random for telemetry consistency
    const seededHash = useMemo(() => {
        let h = 0
        for (let i = 0; i < project.id.length; i++) {
            h = Math.imul(31, h) + project.id.charCodeAt(i) | 0
        }
        return h
    }, [project.id])

    const seededRandom = (offset: number) => {
        const x = Math.sin(seededHash + offset) * 10000
        return x - Math.floor(x)
    }

    // Generative specs based on project category
    const specs = useMemo(() => {
        const base = [
            { label: 'ARCHITECTURE', value: project.techDetails?.architecture || (project.category === 'Blockchain' ? 'Distributed' : 'Microservices') },
            { label: 'CORE_LANGUAGE', value: project.techDetails?.language || 'TypeScript' },
            { label: 'DATA_STORAGE', value: project.techDetails?.database || 'PostgreSQL' },
            { label: 'INFRASTRUCTURE', value: project.techDetails?.hosting || 'Edge_V2' }
        ]
        return base
    }, [project])

    return (
        <div className="pt-6 border-t border-white/5 space-y-4">
             <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                         <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-tighter">{spec.label}</span>
                         <span className="text-[10px] font-bold text-neutral-400 tracking-tight">{spec.value}</span>
                    </div>
                ))}
             </div>
             
             {/* DATA FLOW VISUALIZER (SMOOTH ANIMATION) */}
             <div className="flex items-center gap-2 pt-2">
                 <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[9px] font-mono text-blue-500 opacity-50 uppercase tracking-widest">
                    Realtime System telemetry: [{ (seededRandom(99) * 10).toFixed(1) }ms]
                 </span>
             </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// 3. PROJECT CARD COMPONENT
// -----------------------------------------------------------------------------

interface ProjectCardProps {
    project: Project
    index: number
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    })
    
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.85, 1, 1, 0.85])

    const [isVisible, setIsVisible] = useState(true)

    useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
        // Toggle visibility if way outside viewport (buffer of 0.2)
        if (latest < -0.2 || latest > 1.2) {
            if (isVisible) setIsVisible(false)
        } else {
            if (!isVisible) setIsVisible(true)
        }
    })

    return (
        <motion.div 
            ref={cardRef}
            style={{ 
                opacity, 
                scale,
                display: isVisible ? 'flex' : 'none'
            }}
            className="min-h-screen sticky top-0 flex items-center justify-center py-10 md:py-20 px-4 md:px-10 lg:px-20 will-change-transform"
        >
            <div className="relative w-full max-w-7xl mx-auto bg-[#0a0a0a]/95 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                
                {/* DECORATIVE LIGHTING */}
                <div 
                    className="absolute -top-1/2 -left-1/4 w-full h-full opacity-10 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${project.theme.primary}, transparent 70%)` }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:h-[85vh] overflow-y-auto lg:overflow-hidden">
                    
                    {/* LEFT PANEL - RICH INFORMATION (The 2000 lines goal contributor) */}
                    <div className="lg:col-span-5 p-6 md:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 relative z-10 overflow-y-auto no-scrollbar order-2 lg:order-1">
                        <div className="space-y-10">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "size-3 rounded-full animate-pulse",
                                        project.status === 'completed' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                    )} />
                                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em]">{project.status}</span>
                                </div>
                                <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">{project.year} {"//"} RELEASE</span>
                             </div>

                             <div className="space-y-4">
                                 <h2 className="text-3xl md:text-6xl font-black text-white leading-[0.85] tracking-tighter">
                                    {project.title.toUpperCase()}
                                 </h2>
                                 <p className="text-lg md:text-xl text-violet-400 font-mono font-medium tracking-tight">
                                    {'>'} {project.client}
                                 </p>
                             </div>

                             <div className="space-y-8">
                                <section>
                                    <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="h-px w-4 bg-neutral-800" />
                                        OVERVIEW
                                    </h4>
                                    <p className="text-neutral-400 leading-relaxed text-sm md:text-base font-light">
                                        {project.description.overview}
                                    </p>
                                </section>

                                 <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div>
                                         <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                              <div className="h-px w-4 bg-neutral-800" />
                                              CHALLENGE
                                         </h4>
                                         <p className="text-neutral-500 text-xs leading-relaxed italic">
                                             &ldquo;{project.description.challenge.slice(0, 150)}...&rdquo;
                                         </p>
                                     </div>
                                     <div>
                                         <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                              <div className="h-px w-4 bg-neutral-800" />
                                              SOLUTION
                                         </h4>
                                         <p className="text-neutral-500 text-xs leading-relaxed">
                                             {project.description.solution}
                                         </p>
                                     </div>
                                 </section>

                                 <section className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden group/impact shadow-2xl">
                                      <div className="absolute -top-10 -right-10 size-32 bg-violet-500/10 group-hover/impact:bg-violet-500/20 transition-colors" />
                                      <h4 className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-3">SYSTEM_IMPACT</h4>
                                      <p className="text-white text-sm font-bold leading-snug relative z-10">
                                         {project.description.impact}
                                      </p>
                                 </section>
                             </div>
                             <ProjectStatsCard project={project} />

                             <div>
                                <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4">TECHNOLOGY STACK</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech, i) => {
                                        const Icon = typeof tech.icon === 'string' ? getIcon(tech.icon) : tech.icon
                                        return (
                                            <div key={i} className="group relative">
                                                <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 rounded-lg border border-white/5 text-[11px] text-neutral-300 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all ">
                                                    <Icon size={12} className="text-neutral-500 group-hover:text-violet-400 transition-colors" />
                                                    {tech.name}
                                                </div>
                                           
                                            </div>
                                        )
                                    })}
                                </div>
                             </div>

                              <div>
                                 <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4 italic">PROJECT LEADERSHIP</h4>
                                 <div className="flex -space-x-3">
                                     {project.team.slice(0, 5).map((member) => (
                                         <div key={member.id} className="size-11 rounded-full border-2 border-[#0a0a0a] bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden group/member relative">
                                             {member.avatar ? (
                                                 /* eslint-disable-next-line @next/next/no-img-element */
                                                 <img 
                                                     src={member.avatar} 
                                                     alt={member.name} 
                                                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                 />
                                             ) : (
                                                 <div className="w-full h-full flex items-center justify-center bg-linear-to-tr from-violet-900 to-blue-900 opacity-80 text-[11px]">
                                                     {member.name.split(' ').map(n => n[0]).join('')}
                                                 </div>
                                             )}
                                             {/* HOVER INFO */}
                                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-white text-black text-[10px] font-black rounded-lg whitespace-nowrap opacity-0 group-hover/member:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-20 shadow-xl">
                                                 {member.name.toUpperCase()}
                                                 <div className="text-[8px] font-mono text-neutral-500 leading-none mt-0.5">{member.role}</div>
                                             </div>
                                         </div>
                                     ))}
                                     {project.team.length > 5 && (
                                         <div className="size-11 rounded-full border-2 border-[#0a0a0a] bg-neutral-900 flex items-center justify-center text-[9px] font-bold text-neutral-500">
                                             +{project.team.length - 5}
                                         </div>
                                     )}
                                 </div>
                              </div>

                             {/* NEW SECTION: MILESTONES TIMELINE */}
                             <ProjectMilestones project={project} />

                             {/* NEW SECTION: PROJECT FEATURES */}
                             {project.features && project.features.length > 0 && (
                                 <div className="space-y-6">
                                     <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                                         <div className="h-px w-4 bg-neutral-800" />
                                         CORE_FEATURES
                                     </h4>
                                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {project.features.map((feat, i) => (
                                             <li key={i} className="group/feat p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-violet-500/20 transition-all">
                                                 <span className="block text-violet-400 text-[10px] font-bold uppercase mb-1">{feat.title}</span>
                                                 <p className="text-neutral-500 text-[11px] leading-tight">{feat.description}</p>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             )}

                             {/* NEW SECTION: TECH DETAILS */}
                             {project.techDetails && (
                                 <div className="space-y-6">
                                     <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                                         <div className="h-px w-4 bg-neutral-800" />
                                         SYSTEM_SPECIFICATIONS
                                     </h4>
                                     <div className="grid grid-cols-2 gap-4">
                                         <TechDetail label="ARCHITECTURE" value={project.techDetails.architecture || 'Microservices'} />
                                         <TechDetail label="LANGUAGE" value={project.techDetails.language || 'TypeScript'} />
                                         <TechDetail label="STORAGE" value={project.techDetails.database || 'PostgreSQL'} />
                                         <TechDetail label="INFRA" value={project.techDetails.hosting || 'Edge'} />
                                     </div>
                                 </div>
                             )}

                             {/* NEW SECTION: TESTIMONIAL */}
                             {project.testimonial?.quote && (
                                 <div className="p-6 bg-violet-500/5 border border-violet-500/10 rounded-2xl relative overflow-hidden group/quote shadow-2xl">
                                     <Sparkles className="absolute -top-2 -right-2 size-12 text-violet-500/10 rotate-12 group-hover/quote:scale-125 transition-transform" />
                                     <p className="text-sm text-neutral-300 italic mb-4 relative z-10 font-light leading-relaxed">
                                         &ldquo;{project.testimonial.quote}&rdquo;
                                     </p>
                                     <div className="flex items-center gap-3">
                                         <div className="size-8 rounded-full bg-violet-500/20 border border-violet-500/10 flex items-center justify-center text-[10px] font-bold text-violet-400">
                                             {project.testimonial.author?.[0]}
                                         </div>
                                         <div>
                                             <div className="text-[11px] font-bold text-white">{project.testimonial.author}</div>
                                             <div className="text-[9px] text-neutral-500 uppercase">{project.testimonial.role}</div>
                                         </div>
                                     </div>
                                 </div>
                             )}

                             <ProjectSpecs project={project} />
                        </div>
                    </div>

                    {/* RIGHT PANEL - SVG MOCKUPS & VISUAL ENGINE */}
                    <div className="lg:col-span-7 relative bg-black overflow-hidden group order-1 lg:order-2 h-[40vh] lg:h-full">
                        
                        {/* THE DYNAMIC PREVIEW COMPONENT */}
                        <div className="absolute inset-0 z-0">
                            <ProjectVisualizer project={project} />
                        </div>

                        {/* GLASS OVERLAYS */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                            <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-[#0a0a0a]/60 to-transparent" />
                        </div>
                        
                        {/* MOCK BROWSER / INTERFACE FRAME */}
                        <div className="absolute inset-8 z-20 transition-all duration-1000 md:group-hover:scale-[1.03] md:group-hover:-translate-y-4">
                            <div className="w-full h-full bg-[#111111]/40 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                                
                                {/* INTERFACE TOP BAR */}
                                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="size-2.5 rounded-full bg-red-400/50" />
                                        <div className="size-2.5 rounded-full bg-yellow-400/50" />
                                        <div className="size-2.5 rounded-full bg-green-400/50" />
                                    </div>
                                    <div className="flex-1 px-4">
                                         <div className="h-4 w-full max-w-[300px] bg-white/5 rounded-md flex items-center px-3">
                                            <div className="size-2 rounded-full bg-green-500/40 mr-2" />
                                            <span className="text-[8px] font-mono text-neutral-600 uppercase">mdkcraft_shell://internal_view/{project.id.toLowerCase()}</span>
                                         </div>
                                    </div>
                                    <Terminal className="size-3 text-neutral-700" />
                                </div>

                                {/* INNER SCENE CONTENT */}
                                <div className="flex-1 relative p-12 overflow-hidden">
                                     {/* REAL THUMBNAIL BACKGROUND */}
                                     {project.thumbnail && (
                                         <div className="absolute inset-0 z-0 scale-105 group-hover:scale-100 transition-transform duration-1000">
                                             {/* eslint-disable-next-line @next/next/no-img-element */}
                                             <img 
                                                 src={project.thumbnail} 
                                                 alt={project.title} 
                                                 className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700"
                                             />
                                             <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent" />
                                         </div>
                                     )}

                                     {/* FLOATING HUD ELEMENTS */}
                                     <HUDElement position="top-right" label="CPU_LOAD" value="12.4%" color={project.theme.primary} seed={project.id.length} />
                                     <HUDElement position="bottom-right" label="PACKET_LOSS" value="0.001%" color={project.theme.primary} seed={project.id.length + 1} />
                                     <HUDElement position="bottom-left" label="ACTIVE_THREADS" value="512" color={project.theme.primary} seed={project.id.length + 2} />

                                     <div className="h-full flex flex-col justify-center relative z-10">
                                          <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            className="space-y-6"
                                          >
                                              <h3 className="text-8xl font-black text-white/5 select-none leading-none drop-shadow-2xl">
                                                {project.category.slice(0, 4).toUpperCase()}
                                              </h3>
                                              <div className="flex items-center gap-6">
                                                   <div className="h-0.5 flex-1 bg-linear-to-r from-violet-500/50 to-transparent" />
                                                   <div className="px-4 py-1 border border-violet-500/30 rounded text-[10px] text-violet-400 font-mono backdrop-blur-md">
                                                        SYSTEM_ACTIVE
                                                   </div>
                                              </div>
                                          </motion.div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* HOVER SCANLINE EFFECT */}
                        <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent h-[10%] animate-scanline" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const HUDElement = ({ position, label, value, color, seed }: { position: string, label: string, value: string, color: string, seed: number }) => {
    const posClasses: Record<string, string> = {
        'top-right': 'top-10 right-10',
        'bottom-right': 'bottom-10 right-10',
        'bottom-left': 'bottom-10 left-10',
        'top-left': 'top-10 left-10'
    }

    const initialWidth = useMemo(() => {
        const x = Math.sin(seed) * 10000
        return 20 + (x - Math.floor(x)) * 70
    }, [seed])

    return (
        <div className={cn("absolute flex flex-col gap-1 items-end", posClasses[position])}>
            <span className="text-[7px] font-mono text-neutral-600 tracking-widest">{label}</span>
            <div className="flex items-center gap-2">
                 <div className="h-1 w-8 bg-neutral-900 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: `${initialWidth}%` }}
                        animate={{ width: ['20%', '90%', '40%'] }} 
                        transition={{ duration: 4, repeat: Infinity }}
                        className="h-full" 
                        style={{ backgroundColor: color }} 
                    />
                 </div>
                 <span className="text-[9px] font-mono text-white/40">{value}</span>
            </div>
        </div>
    )
}

const TechDetail = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[7px] font-mono text-neutral-600 tracking-tighter uppercase">{label}</span>
        <span className="text-[10px] font-bold text-neutral-400">{value}</span>
    </div>
)
