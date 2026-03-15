'use client'

import { ProjectCard } from '@/app/(app)/(pages)/(unauthenticated)/projectsArchive/components/ProjectCard'
import { PROJECTS_DATA } from '@/app/(app)/(pages)/(unauthenticated)/projectsArchive/data/projects'
import MagneticButton from '@/components/ui/magneticBotton'
import { ArrowRight, Monitor } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useRef } from 'react'

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES (Extensive for 2000+ lines support)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// 2. CONSTANTS & CONFIGURATION
// -----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DAMPING = 20

// -----------------------------------------------------------------------------
// 3. SHADERS (GLSL embedded)
// -----------------------------------------------------------------------------

/**
 * Nebula Shader: Creates the atmospheric background
 */

// -----------------------------------------------------------------------------
// 6. UI SUB-COMPONENTS (DOM Animations)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// 7. MAIN COMPONENT
// -----------------------------------------------------------------------------

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative min-h-[500vh] w-full bg-[#050505] text-white "
    >
      {/* BACKGROUND ELEMENTS (DOM) */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-900/10 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[url('/img/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />

      {/* 5. PROJECT CARDS STACK */}
      <div className="relative z-10 pb-10">
        <AnimatePresence mode="popLayout">
          {PROJECTS_DATA.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. FINAL CTA: THE TERMINUS - SPECTACULAR EDITION */}
      <div className="relative border-t border-violet-500 min-h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden ">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-violet-600/20 via-purple-900/10 to-black">
          <motion.div
            className="absolute inset-0 bg-linear-to-tr from-violet-500/30 via-transparent to-purple-600/30"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-violet-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Radial Glow Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
          />
        </div>

        {/* Grid Pattern with Mask */}
        <div className="absolute inset-0 bg-dot-white/[0.05] mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">
            {/* Left Column - Main Content */}
            <motion.div
              className="space-y-6 sm:space-y-8 md:space-y-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                className="space-y-3 sm:space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.span
                  className="inline-block font-mono text-[10px] sm:text-xs text-violet-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                      '0 0 40px rgba(139, 92, 246, 0.5)',
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Projekt_Nadchodzi
                </motion.span>
                <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter leading-[1.1] sm:leading-none">
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    TWOJA WIZJA.
                  </motion.span>
                  <br />
                  <motion.span
                    className="text-transparent bg-clip-text bg-linear-to-r from-neutral-500 via-neutral-400 to-violet-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    NASZA REALIZACJA.
                  </motion.span>
                </h3>
              </motion.div>

              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-300 font-light leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Oferujemy kompleksowe podejście od strategii po wdrożenie. Twój projekt zasługuje na
                najlepszą technologię i design.
              </motion.p>

              <motion.div
                className="flex flex-col gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <MagneticButton
                    className="group w-full sm:w-auto px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-4xl font-black text-base sm:text-lg md:text-xl hover:from-white hover:to-white hover:text-black transition-all duration-700 shadow-[0_0_60px_-10px_rgba(139,92,246,0.8)] hover:shadow-[0_0_80px_-5px_rgba(255,255,255,0.8)] flex items-center justify-center gap-3 sm:gap-4 relative overflow-hidden"
                    margin="mx-0"
                    icon={
                      <ArrowRight className="size-5 sm:size-6 group-hover:translate-x-1 transition-transform" />
                    }
                  >
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span className="relative z-10">ZACZNIJMY WSPÓŁPRACĘ</span>
                  </MagneticButton>
                </motion.div>
                <Link href="/projectsArchive" target="_blank" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <MagneticButton
                      icon={<Monitor className="size-4 sm:size-5 ml-1" />}
                      className="w-full sm:w-auto px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 border-2 border-violet-500/30 rounded-4xl font-bold text-base sm:text-lg md:text-xl hover:bg-violet-500/10 hover:border-violet-400 transition-all text-neutral-400 hover:text-white flex items-center justify-center gap-3 backdrop-blur-sm hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]"
                      margin="mx-0"
                    >
                      ZOBACZ WSZYSTKIE PROJEKTY
                    </MagneticButton>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Animated Stats */}
            <motion.div
              className="hidden lg:grid grid-cols-2 gap-4 xl:gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {[
                { label: 'Projektów', value: '50+', icon: '🚀', delay: 0.1 },
                { label: 'Klientów', value: '30+', icon: '💼', delay: 0.2 },
                { label: 'Lat doświadczenia', value: '5+', icon: '⭐', delay: 0.3 },
                { label: 'Satysfakcji', value: '100%', icon: '✨', delay: 0.4 },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="group relative p-6 xl:p-8 rounded-3xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-sm overflow-hidden hover:border-violet-500/50 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 + stat.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {/* Animated background glow */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-br from-violet-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />

                  <div className="relative z-10 space-y-3">
                    <motion.div
                      className="text-4xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: stat.delay,
                      }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      className="text-3xl xl:text-4xl font-black text-white"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        delay: 0.8 + stat.delay,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs xl:text-sm font-mono text-neutral-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>

                  {/* Corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-violet-500/20 blur-2xl"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: stat.delay,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-violet-500 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </section>
  )
}

export default Projects
