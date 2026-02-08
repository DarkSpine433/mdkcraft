'use client'

import { ProjectCard } from '@/app/(app)/projectsArchive/components/ProjectCard'
import { PROJECTS_DATA } from '@/app/(app)/projectsArchive/data/projects'
import { ProjectCategory } from '@/app/(app)/projectsArchive/types/project'
import MagneticButton from '@/components/ui/magneticBotton'
import {
  ArrowRight,
  LucideIcon,
  Monitor
} from 'lucide-react'
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
  `
}








// -----------------------------------------------------------------------------
// 6. UI SUB-COMPONENTS (DOM Animations)
// -----------------------------------------------------------------------------



const TechBadge = ({ item }: { item: TechStackItem }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300 group cursor-default">
    <item.icon className="size-3 text-neutral-400 group-hover:text-violet-400 transition-colors" />
    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 group-hover:text-white">{item.name}</span>
  </div>
)

const StatCard = ({ stat }: { stat: ProjectStat }) => (
  <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
     <div className="flex items-center gap-3 mb-2">
       <div className="p-2 rounded-lg bg-neutral-900 text-violet-400">
         <stat.icon size={16} />
       </div>
       <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{stat.label}</span>
     </div>
     <div className="flex items-end gap-2">
       <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
       {stat.trend === 'up' && <span className="text-[10px] text-green-400 mb-1">↑ {stat.trendValue}</span>}
     </div>
  </div>
)


// -----------------------------------------------------------------------------
// 7. MAIN COMPONENT
// -----------------------------------------------------------------------------

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)





  return (
    <section ref={containerRef} id="projects" className="relative min-h-[500vh] w-full bg-[#050505] text-white ">
        

      
    
      
      {/* BACKGROUND ELEMENTS (DOM) */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[url('/img/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />

   {/* 5. PROJECT CARDS STACK */}
      <div className="relative z-10 pb-48">
          {PROJECTS_DATA.slice(0, 5).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
          ))}
          
         
      </div>

      {/* 3. FINAL CTA: THE TERMINUS */}
      <div className="relative min-h-[120vh] w-full flex flex-col items-center justify-center overflow-hidden bg-dot-white/[0.05]">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
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

                 <div className="flex flex-col gap-8">
                   <MagneticButton className="px-12 py-7 bg-violet-600 text-white rounded-[2rem] font-black text-xl hover:scale-105 hover:bg-white hover:text-black transition-all duration-700 shadow-[0_0_50px_-10px_rgba(139,92,246,0.6)] flex items-center justify-center gap-4 w-max" margin='mx-0' icon={<ArrowRight className="size-6" />} >
                        ZACZNIJMY WSPÓŁPRACĘ
                   </MagneticButton>
                  <Link href="/projectsArchive">
                   <MagneticButton icon={<Monitor className="size-5 ml-1" />} className="px-12 py-7 border border-white/10 rounded-[2rem] font-bold text-xl hover:bg-white/5 transition-all text-white  bg-white/5  text-neutral-500 hover:text-white flex items-center justify-center gap-3 hover:[text-shadow:1px_1px_2px_rgba(255,255,255,1)] w-max" margin='mx-0'>
                      ZOBACZ WSZYSTKIE PROJEKTY
                      
                    </MagneticButton>
                  </Link>
                 </div>
              </div>
            </div>
          </div>
      </div>

    </section>
  )
}

export default Projects
