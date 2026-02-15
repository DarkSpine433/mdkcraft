'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Media } from '@/payload-types'
import { Award, Quote, Sparkles, Star, TrendingUp, Users } from 'lucide-react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import React, { useRef } from 'react'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

// Local definition if Opinion type from payload-types is strict about collections vs globals
// The generated type for Global "Values" might differ.
// We expect an array of objects.

type OpinionItem = {
  id?: string | null
  name: string
  opinion: string
  rating: number
  image?: Media | string | null // Supporting Media object or ID/URL string
  role?: string | null
}

type Props = {
  opinions: OpinionItem[]
}

// -----------------------------------------------------------------------------
// DATA
// -----------------------------------------------------------------------------

const METRICS = [
  { label: 'Client Satisfaction', value: '98%', icon: TrendingUp },
  { label: 'Projects Completed', value: '150+', icon: Award },
  { label: 'Active Partnerships', value: '45+', icon: Users },
]

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

const PixelGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pixel-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pixel-pattern)" />
    </svg>
  </div>
)

const FloatingCard = ({ opinion, index }: { opinion: OpinionItem; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  })

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end end'],
  })

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * ((index % 3) + 1), -50 * ((index % 3) + 1)],
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const imageUrl = typeof opinion.image === 'object' && opinion.image?.url ? opinion.image.url : ''
  const avatarFallback = opinion.name ? opinion.name[0] : '?'

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      initial={{ scale: 0.9 }}
      whileInView={{ scale: 1 }}
      className="relative group p-8 rounded-3xl bg-linear-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-md hover:border-violet-500/30 transition-all duration-500 shadow-2xl shadow-black/50"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors duration-500 pointer-events-none" />

      <Quote className="absolute -top-4 -right-4 size-16 text-white/5 group-hover:text-violet-500/20 transition-colors duration-500 rotate-12" />

      <div className="relative z-10 space-y-6" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500 blur-md opacity-20 rounded-full group-hover:opacity-40 transition-opacity" />
            <Avatar className="h-16 w-16 border-2 border-white/10 p-0.5 group-hover:border-violet-500/50 transition-colors">
              <AvatarImage src={imageUrl} className="rounded-full object-cover" />
              <AvatarFallback className="bg-slate-800 text-violet-400 font-bold text-xl">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-violet-200 transition-colors">
              {opinion.name}
            </h4>
            <p className="text-violet-400 font-mono text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
              {opinion.role}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${i < opinion.rating ? 'fill-violet-500 text-violet-500' : 'fill-slate-700 text-slate-700'} transition-colors duration-300`}
            />
          ))}
        </div>

        <p className="text-slate-300 text-lg leading-relaxed italic font-light tracking-wide">
          &quot;{opinion.opinion}&quot;
        </p>

        <div className="pt-6 flex items-center gap-3 border-t border-white/5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
            Verified Client
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

const OpinionsClient = ({ opinions }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Split opinions into two columns
  const validOpinions = opinions || [] // Safety check
  const half = Math.ceil(validOpinions.length / 2)
  const col1 = validOpinions.slice(0, half)
  const col2 = validOpinions.slice(half)

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative bg-[#050505] min-h-[min(200vh,auto)] py-[15vh] overflow-hidden border-y border-white/5"
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <PixelGrid />

      <div className="container mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <div className="max-w-4xl mx-auto text-center mb-[15vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-mono tracking-widest uppercase mb-12 backdrop-blur-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            Social Proof & Trust
          </motion.div>

          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
            VOICES OF <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-violet-300 to-white drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              SUCCESS
            </span>
          </h2>

          <div className="h-1 w-40 bg-linear-to-r from-transparent via-violet-500 to-transparent mx-auto mb-12" />

          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
            Nie budujemy tylko oprogramowania. Budujemy{' '}
            <span className="text-white font-semibold">trwałe fundamenty sukcesu</span> naszych
            partnerów biznesowych.
          </p>
        </div>

        {/* --- METRICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-[20vh]">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-4xl bg-white/2 border border-white/5 text-center group hover:bg-white/4 hover:border-violet-500/20 transition-colors duration-500"
            >
              <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                <metric.icon
                  className="text-violet-400 group-hover:text-violet-300 transition-colors"
                  size={36}
                />
              </div>
              <div className="text-5xl font-black text-white mb-3 tracking-tighter group-hover:text-violet-100 transition-colors">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-[0.3em] font-bold group-hover:text-slate-400 transition-colors">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- OPINIONS WALL --- */}
        {validOpinions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative">
            <div className="space-y-12 lg:space-y-24">
              {col1.map((opinion, i) => (
                <FloatingCard key={opinion.id || i} opinion={opinion} index={i} />
              ))}
            </div>
            <div className="space-y-12 lg:space-y-24 pt-12 lg:pt-32">
              {col2.map((opinion, i) => (
                <FloatingCard key={opinion.id || i + half} opinion={opinion} index={i + half} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-20 font-mono">
            No opinions found. Seed the database to see reviews here.
          </div>
        )}
      </div>
    </section>
  )
}

export default OpinionsClient
