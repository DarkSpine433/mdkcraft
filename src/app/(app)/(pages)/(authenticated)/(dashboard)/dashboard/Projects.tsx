'use client'

import { Project } from '@/payload-types'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

type Props = {
  project: Project
}

const Projects = ({ project }: Props) => {
  const { activityLog, id, progress, status, title, slug } = project

  const lastActivity = activityLog?.[activityLog.length - 1]

  return (
    <Link
      href={`/projects/${slug || id}`}
      className="relative p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 flex flex-col gap-6 group hover:border-primary/20 transition-all duration-500 shadow-xl cursor-pointer overflow-hidden"
    >
      {/* Nagłówek i Postęp */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <h3 className="font-black text-xl tracking-tight uppercase italic text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em]">
            STATUS: <span className="text-primary">{status}</span>
          </p>
        </div>

        <div className="flex flex-1 items-center gap-4 w-full md:justify-end">
          <div className="w-full md:w-64 bg-white/5 h-1.5 rounded-none overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-primary h-full shadow-[0_0_15px_#7c3aed]"
            />
          </div>
          <div className="text-xs font-mono font-bold text-primary italic uppercase">
            {progress}% ukończono
          </div>
        </div>
      </div>

      {/* Ostatnia Aktywność */}
      <div className="w-full pt-4 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-end mb-3 font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <ChevronRight size={10} className="text-primary" />
            Ostatnia aktywność systemu:
          </span>
          <span className="text-primary group-hover:animate-pulse uppercase">
            Szczegóły operacji
          </span>
        </div>

        <div className="text-sm font-light text-neutral-400 flex justify-between items-center bg-white/[0.02] p-3 rounded-lg border border-white/5 group-hover:bg-white/[0.04] transition-colors">
          <span className="italic truncate max-w-[70%] text-neutral-300">
            {lastActivity ? `"${lastActivity.message}"` : 'Brak zarejestrowanych operacji.'}
          </span>
          {lastActivity && (
            <span className="text-[9px] text-neutral-600 font-mono shrink-0 bg-white/5 px-2 py-1 rounded">
              {new Date(lastActivity.date).toLocaleDateString('pl-PL')}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
export default Projects
