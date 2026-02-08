'use client'

import { Activity, ChevronDown, Cpu, Network, Shield, Sparkles, Terminal } from 'lucide-react'
import { motion } from 'motion/react'
import { memo } from 'react'
import { Scene3D } from './Scene3D'

interface ArchiveHeroProps {
    projectCount: number
}

/**
 * A cinematic hero section for the projects archive.
 * Focuses on scale, technical depth, and visual polish.
 */
export const ArchiveHero = memo(({ projectCount }: ArchiveHeroProps) => {
    return (
        <section className="relative h-dvh md:h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
            
            {/* SCENE 3D - NOW CONFINED TO HERO */}
            <Scene3D />

            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="absolute top-1/4 -left-1/4 size-[50vw] bg-violet-600/10 rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 size-[50vw] bg-blue-600/10 rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-center space-y-12 z-10 px-6"
            >
                {/* STATUS BADGE */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full border border-violet-500/30 bg-violet-950/20 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                >
                    <div className="flex -space-x-1">
                        <Terminal size={14} className="text-violet-400" />
                        <Activity size={14} className="text-violet-400" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-violet-100/80 tracking-widest uppercase">
                        System Archive Status: {projectCount} Entries Loaded // Active
                    </span>
                    <Sparkles size={14} className="text-violet-400 animate-pulse" />
                </motion.div>

                {/* MAIN TITLES */}
                <div className="space-y-2">
                    <h1 className="text-7xl md:text-[8vw] font-black text-transparent bg-clip-text bg-linear-to-b from-white via-white/80 to-neutral-700 tracking-tighter leading-[0.8]">
                        UNIFIED<br/>ARCHIVE
                    </h1>
                    <div className="flex items-center justify-center gap-4 py-4">
                        <div className="h-px w-20 bg-linear-to-r from-transparent to-neutral-800" />
                        <span className="text-xs font-mono text-neutral-500 tracking-[0.5em] uppercase">Engineering Excellence</span>
                        <div className="h-px w-20 bg-linear-to-l from-transparent to-neutral-800" />
                    </div>
                </div>
                
                {/* DESCRIPTION */}
                <p className="max-w-2xl mx-auto text-neutral-400 text-lg md:text-xl leading-relaxed font-light">
                    Explore the definitive collection of our production-grade systems, algorithmic experiments, and full-stack architecture deployments, curated for technical rigor.
                </p>

                {/* TECH TAGS CLOUD */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-6 opacity-30">
                    <TechTag icon={Cpu} label="Edge Computing" />
                    <TechTag icon={Shield} label="End-to-End Encryption" />
                    <TechTag icon={Network} label="Distributed Systems" />
                </div>

                {/* SCROLL INDICATOR */}
                <motion.div 
                    animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }} 
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="pt-12"
                >
                    <ChevronDown className="size-12 mx-auto text-white/50" />
                </motion.div>
            </motion.div>

            {/* DECORATIVE LINE ART */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>
    )
})
ArchiveHero.displayName = 'ArchiveHero'

const TechTag = memo(({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full">
        <Icon size={12} />
        {label}
    </div>
))
TechTag.displayName = 'TechTag'
