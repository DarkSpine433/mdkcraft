'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Project } from '@/payload-types'
import { Calendar, ChevronRight, Cpu, ExternalLink, History, Layout } from 'lucide-react'
import { motion } from 'motion/react'

type Props = {
  project: Project
}

const Projects = ({ project }: Props) => {
  const {
    activityLog,
    id,
    progress,
    status,
    title,
    figmaLink,
    stagingLink,
    startDate,
    estimatedEndDate,
  } = project

  const lastActivity = activityLog?.[activityLog.length - 1]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative p-6 rounded-2xl bg-[#0a0a0c] border border-white/5 flex flex-col gap-6 group hover:border-primary/20 transition-all duration-500 shadow-xl cursor-pointer overflow-hidden">
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
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-[#050507] border border-violet-500/15 text-white p-0 overflow-hidden">
        {/* Nagłówek Dialogu */}
        <DialogHeader className="p-8 border-b border-white/5 bg-[#08080a] relative">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-primary animate-spin-slow" size={18} />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neutral-500">
              Projekt // {id.toUpperCase()}
            </span>
          </div>
          <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter text-white mb-8">
            {title}
          </DialogTitle>

          {/* Panel Informacyjny - Naprawione Daty i Linki */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
            <InfoBlock
              label="Start projektu"
              value={startDate ? new Date(startDate).toLocaleDateString('pl-PL') : 'Nieustalony'}
              icon={<Calendar size={14} className="text-primary" />}
            />
            <InfoBlock
              label="Gotowy Produkt"
              value={
                estimatedEndDate
                  ? new Date(estimatedEndDate).toLocaleDateString('pl-PL')
                  : 'W trakcie'
              }
              icon={<Calendar size={14} className="text-purple-400" />}
            />
            <InfoLink
              label="Projekt Figma"
              href={figmaLink}
              icon={<Layout size={14} />}
              color="bg-blue-500/10 border-blue-500/20 text-blue-400"
            />
            <InfoLink
              label="Serwer testowy"
              href={stagingLink}
              icon={<ExternalLink size={14} />}
              color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            />
          </div>
        </DialogHeader>

        {/* Historia Logów */}
        <div className="p-8 bg-[url('/grid.svg')] bg-fixed relative">
          <div className="flex items-center gap-2 mb-6">
            <History size={16} className="text-primary" />
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Historia operacji systemowych
            </h4>
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
            {activityLog && activityLog.length > 0 ? (
              [...activityLog].reverse().map((log, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l border-white/5 py-3 group/item hover:border-primary/50 transition-colors"
                >
                  <div className="absolute left-[-4.5px] top-5 h-2 w-2 rounded-full bg-neutral-800 group-hover/item:bg-primary group-hover/item:shadow-[0_0_8px_#7c3aed] transition-all" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-600 uppercase">
                        Wpis nr {(activityLog.length - index).toString().padStart(3, '0')}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(log.date).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-300 font-light leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <span className="text-xs font-mono text-neutral-700 uppercase italic">
                  Brak danych w rejestrze logów
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stopka statusu */}
        <div className="p-4 bg-black border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-neutral-600 tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>POŁĄCZENIE STABILNE</span>
          </div>
          <span className="animate-pulse">SYNCHRONIZACJA DANYCH AKTYWNA</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
/**
 * Komponent dla Dat - Usunięto sztywny margines, poprawiono układ
 */
const InfoBlock = ({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) => (
  <div className="flex flex-row flex-wrap gap-2 rounded-xl bg-white/[0.03] border border-white/5 items-center  w-full  shadow-inner transition-colors px-2 py-2 hover:bg-white/[0.05]">
    <div className="flex  gap-2 items-center w-full ">
      <div className="p-1 rounded bg-white/5">{icon}</div>
      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
    <div className="text-xs font-bold text-neutral-100 tracking-tight pl-1">{value}</div>
  </div>
)

/**
 * Komponent dla Linków - Poprawiony kontrast i spójność
 */
const InfoLink = ({
  label,
  href,
  icon,
  color,
}: {
  label: string
  href?: string | null
  icon: React.ReactNode
  color: string
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest ml-1">
      {label}
    </span>
    {href ? (
      <a
        href={href}
        target="_blank"
        className={`text-[10px] font-bold h-[46px] px-4 rounded-xl border flex items-center justify-between transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${color}`}
      >
        <span>Otwórz Link</span>
        {icon}
      </a>
    ) : (
      <div className="text-[10px] font-bold h-[46px] px-4 rounded-xl border border-white/5 bg-white/5 text-neutral-700 italic flex items-center justify-between opacity-50">
        <span>Brak danych</span>
        {icon}
      </div>
    )}
  </div>
)

export default Projects
