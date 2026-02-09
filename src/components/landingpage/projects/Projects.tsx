'use client'

import { ProjectCard } from '@/app/(app)/projectsArchive/components/ProjectCard'
import { PROJECTS_DATA } from '@/app/(app)/projectsArchive/data/projects'
import { ProjectCategory } from '@/app/(app)/projectsArchive/types/project'
import MagneticButton from '@/components/ui/magneticBotton'
import { ArrowRight, LucideIcon, Monitor } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useRef } from 'react'

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES (Extensive for 2000+ lines support)
// -----------------------------------------------------------------------------

interface TechStackItem {
  name: string
  icon: LucideIcon
  category: 'frontend' | 'backend' | 'devops' | 'mobile' | 'core'
  version?: string
  description?: string
}

interface ProjectStat {
  label: string
  value: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  description?: string
}

interface Testimonial {
  author: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
}

interface ProjectTeamMember {
  name: string
  role: string
  avatar: string
  contribution: string
}

interface ProjectMilestone {
  date: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned'
}

interface Project {
  id: string
  title: string
  tagline: string
  category: ProjectCategory
  description: {
    short: string
    detailed: string
    challenge: string
    solution: string
    impact: string
  }
  image: string
  gallery: string[]
  logo?: string
  accentColor: string
  techStack: TechStackItem[]
  stats: ProjectStat[]
  testimonials: Testimonial[]
  team: ProjectTeamMember[]
  milestones: ProjectMilestone[]
  links: {
    live: string
    github: string
    caseStudy?: string
  }
  features: string[]
  technicalDetails: {
    architecture: string
    performance: string
    security: string
  }
}

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
const NebulaShader = {
  vertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;

    // Simplex Noise (simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Dynamic noise
      float noise = snoise(vec3(vUv * 3.0, time * 0.1));
      
      // Mix colors based on noise
      vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
      
      // Add vignette
      float dist = distance(vUv, vec2(0.5));
      float vignette = smoothstep(0.8, 0.2, dist);
      
      gl_FragColor = vec4(finalColor * vignette, 1.0);
    }
  `,
}

// -----------------------------------------------------------------------------
// 6. UI SUB-COMPONENTS (DOM Animations)
// -----------------------------------------------------------------------------

const TechBadge = ({ item }: { item: TechStackItem }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 group cursor-default">
    <item.icon className="size-3 text-neutral-400 group-hover:text-violet-400 transition-colors" />
    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 group-hover:text-white">
      {item.name}
    </span>
  </div>
)

const StatCard = ({ stat }: { stat: ProjectStat }) => (
  <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-neutral-900 text-violet-400">
        <stat.icon size={16} />
      </div>
      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
        {stat.label}
      </span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
      {stat.trend === 'up' && (
        <span className="text-[10px] text-green-400 mb-1">↑ {stat.trendValue}</span>
      )}
    </div>
  </div>
)

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
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-black to-black pointer-events-none" />
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
