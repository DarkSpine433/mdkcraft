'use client'

import { cn } from '@/utilities/cn'
import { motion } from 'framer-motion'

interface SectionDividerProps {
  className?: string
  containerClassName?: string
  showLine?: boolean
}

export const SectionDivider = ({ 
  className, 
  containerClassName,
  showLine = true 
}: SectionDividerProps) => {
  return (
    <div className={cn("relative w-full h-24 md:h-40 overflow-hidden pointer-events-none", containerClassName)}>
      {/* 1. GŁÓWNY GRADIENT TŁA (Transition) */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] z-10",
          className
        )} 
      />

      {/* 2. ANIMOWANA LINIA (BEAM) - Centralny punkt styku sekcji */}
      {showLine && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px z-20">
          {/* Podstawa linii */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Animowany impuls (Laser Beam) */}
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2
            }}
            className="absolute top-0 w-40 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
          />
        </div>
      )}

      {/* 3. POŚWIATA (GLOW) - Subtelny blask na łączeniu */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-20 bg-primary/5 blur-[80px] rounded-full z-0" />

      {/* 4. ELEMENTY DEKORACYJNE SVG (Grid Fade) */}
      <div className="absolute inset-0 z-5 opacity-[0.15]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="divider-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="fade-mask" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#fade-mask)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#divider-grid)" mask="url(#grid-mask)" />
        </svg>
      </div>
    </div>
  )
}

/**
 * Przykład użycia między sekcjami:
 * * <section>...</section>
 * <SectionDivider />
 * <section>...</section>
 */