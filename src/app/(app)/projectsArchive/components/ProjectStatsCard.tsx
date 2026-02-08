import { cn } from '@/utilities/cn'
import {
    Clock,
    GitBranch,
    TrendingUp,
    Users
} from 'lucide-react'
import { motion } from 'motion/react'
import { memo } from 'react'
import { Project } from '../types/project'

interface ProjectStatsCardProps {
    project: Project
}

/**
 * A highly detailed metrics dashboard for a specific project.
 * Designed to look like a high-end dev tool interface.
 */
export const ProjectStatsCard = memo(({ project }: ProjectStatsCardProps) => {
    // Generate some consistent but unique-looking secondary metrics


    return (
        <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                 <div className="h-px w-4 bg-neutral-800" />
                 LIVE PERFORMANCE_MATRICS
            </h4>

            <div className="grid grid-cols-2  gap-4">
                <StatItem 
                    icon={Clock} 
                    value={`${project.stats.hoursSpent}h`} 
                    label="Engineering" 
                    color="text-violet-400" 
                    delay={0}
                />
                <StatItem 
                    icon={GitBranch} 
                    value={project.stats.commits.toString()} 
                    label="Active Commits" 
                    color="text-blue-400" 
                    delay={0.1}
                />
                <StatItem 
                    icon={TrendingUp} 
                    value={`${project.stats.performanceScore}/100`} 
                    label="Lighthouse" 
                    color="text-yellow-400" 
                    delay={0.2}
                />
                <StatItem 
                    icon={Users} 
                    value={project.stats.users || '0'} 
                    label="Total Users" 
                    color="text-green-400" 
                    delay={0.3}
                />
            </div>

            {project.stats.uptime && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">System Uptime: {project.stats.uptime}</span>
                </div>
            )}

          

       
        </div>
    )
})
ProjectStatsCard.displayName = 'ProjectStatsCard'

const StatItem = memo(({ icon: Icon, value, label, color, delay }: { icon: React.ElementType, value: string, label: string, color: string, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="group relative flex flex-col items-center justify-center p-5 bg-white/5 rounded-4xl border border-white/5 hover:border-white/10 hover:bg-white/8 transition-all cursor-default overflow-hidden"
    >
        {/* BACKGROUND GLOW */}
        <div className={cn("absolute -bottom-4 -right-4 size-16 opacity-0 group-hover:opacity-10 transition-opacity", color.replace('text', 'bg'))} />
        
        <Icon className={cn("size-6 mb-3 transition-transform group-hover:scale-110", color)} />
        <span className="text-2xl font-black text-white tracking-tighter mb-1">{value}</span>
        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">{label}</span>
    </motion.div>
))
StatItem.displayName = 'StatItem'

const _MiniStat = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[7px] font-mono text-neutral-700 tracking-tighter">{label}</span>
        <span className="text-[9px] font-bold text-neutral-400">{value}</span>
    </div>
)
