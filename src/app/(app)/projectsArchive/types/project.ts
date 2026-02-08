import * as LucideIcons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Cpu: LucideIcons.Cpu,
  Zap: LucideIcons.Zap,
  Box: LucideIcons.Box,
  Code: LucideIcons.Code,
  Globe: LucideIcons.Globe,
  Database: LucideIcons.Database,
  Cloud: LucideIcons.Cloud,
  Layers: LucideIcons.Layers,
  Lock: LucideIcons.Lock,
  Search: LucideIcons.Search,
  Activity: LucideIcons.Activity,
  BarChart: LucideIcons.BarChart,
  Network: LucideIcons.Network,
  Package: LucideIcons.Package,
  Sparkles: LucideIcons.Sparkles,
  Terminal: LucideIcons.Terminal,
  ExternalLink: LucideIcons.ExternalLink,
  Github: LucideIcons.Github,
}

export const getIcon = (name: string): LucideIcon => {
  return ICON_MAP[name] || LucideIcons.HelpCircle
}

export type Projectstatus = 'completed' | 'in-progress' | 'maintenance' | 'deprecated'
export type ProjectCategory = 'E-commerce' | 'FinTech' | 'Healthcare' | 'AI/ML' | 'Blockchain' | 'IoT' | 'SaaS' | 'Social'

export interface TechStackItem {
  name: string
  icon: LucideIcon | string
  category: 'frontend' | 'backend' | 'devops' | 'mobile' | 'cloud' | 'core'
  version?: string
  description?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  contribution: string
}

export interface Milestone {
  date: string
  title: string
  description: string
  completed: boolean
}

export interface ProjectStats {
  commits: number
  hoursSpent: number
  performanceScore: number
  uptime?: string
  users?: string
}

export interface Project {
  id: string
  title: string
  client: string
  tagline: string
  description: {
    overview: string
    challenge: string
    solution: string
    impact: string
  }
  category: ProjectCategory
  status: Projectstatus
  year: string
  thumbnail: string
  gallery: string[]
  techStack: TechStackItem[]
  team: TeamMember[]
  milestones: Milestone[]
  stats: ProjectStats
  links: {
    live?: string
    github?: string
    caseStudy?: string
  }
  theme: {
    primary: string
    secondary?: string
    accent?: string
  }
  features?: {
    title: string
    description: string
  }[]
  techDetails?: {
    architecture?: string
    language?: string
    database?: string
    hosting?: string
  }
  testimonial?: {
    quote?: string
    author?: string
    role?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}
