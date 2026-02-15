import { getStripeCustomerPortalUrl } from '@/app/actions/stripe'
import { Project, User } from '@/payload-types'
import configPromise from '@payload-config'
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Figma,
  Layers,
  Layout,
  MessageSquare,
  Zap,
} from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function ProjectDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await paramsPromise
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  // Try to find by slug first, then by ID as fallback
  let project: Project | null = null

  const resultBySlug = await payload.find({
    collection: 'projects',
    user,
    overrideAccess: false,
    where: {
      slug: { equals: slug },
      client: { equals: user?.id },
    },
  })

  if (resultBySlug.docs.length > 0) {
    project = resultBySlug.docs[0] as Project
  } else {
    // Fallback to ID
    try {
      const resultById = await payload.findByID({
        collection: 'projects',
        id: slug,
        user,
        overrideAccess: false,
      })
      // Double check client matches (though overrideAccess: false should handle it)
      const clientId = typeof resultById.client === 'string' ? resultById.client : resultById.client.id
      if (clientId === user?.id) {
        project = resultById as Project
      }
    } catch (_e) {
      // Not a valid ID or not found
    }
  }

  if (!project) {
    notFound()
  }

  const statusColors = {
    planning: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    designing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    development: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    testing: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    completed: 'text-green-400 bg-green-400/10 border-green-400/20',
    on_hold: 'text-red-400 bg-red-400/10 border-red-400/20',
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={14} /> Powrót_Do_Listy
      </Link>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${statusColors[project.status] || ''}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {project.status.toUpperCase()}
            </div>
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
              ID // {project.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white line-clamp-2">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              Start:{' '}
              {project.startDate ? new Date(project.startDate).toLocaleDateString('pl-PL') : 'TBD'}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              Cel:{' '}
              {project.estimatedEndDate
                ? new Date(project.estimatedEndDate).toLocaleDateString('pl-PL')
                : 'TBD'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {project.figmaLink && (
            <a
              href={project.figmaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-3 transition-all group"
            >
              <Figma
                size={20}
                className="text-[#F24E1E] group-hover:scale-110 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">Design_Figma</span>
            </a>
          )}
          {project.stagingLink && (
            <a
              href={project.stagingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-6 bg-primary hover:bg-primary/90 text-white rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-primary/20 group"
            >
              <ExternalLink
                size={20}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">Podgląd_Live</span>
            </a>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PROGRESS CARD */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={160} className="text-primary" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    Status_Realizacji
                  </h2>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em]">
                    Aktualny postęp prac deweloperskich
                  </p>
                </div>
                <span className="text-4xl font-black italic text-primary">
                  {project.progress || 0}%
                </span>
              </div>

              <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-primary shadow-[0_0_20px_#8b5cf6] transition-all duration-1000 ease-out"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[
                  { icon: Layout, label: 'Design UI/UX', val: 'Ukończono' },
                  { icon: Layers, label: 'Architektura', val: 'W trakcie' },
                  { icon: Zap, label: 'Performance', val: 'Oczekiwanie' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                  >
                    <item.icon size={16} className="text-primary" />
                    <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold uppercase">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ACTIVITY LOG */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-black tracking-tighter uppercase">Dziennik_Operacji</h2>
            </div>

            <div className="space-y-4">
              {project.activityLog
                ?.slice()
                .reverse()
                .map((log, i) => (
                  <div
                    key={log.id || i}
                    className="group p-6 rounded-3xl bg-white/2 border border-white/5 hover:border-white/10 transition-all flex items-start gap-6"
                  >
                    <div className="hidden sm:flex flex-col items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="w-px h-12 bg-white/10 group-last:bg-transparent" />
                    </div>
                    <div className="flex-1 space-y-2 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                          {new Date(log.date).toLocaleDateString('pl-PL')} {' // '}
                          {new Date(log.date).toLocaleTimeString('pl-PL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="overflow-x-auto custom-scrollbar pb-2">
                        <p className="text-neutral-300 font-mono text-sm leading-relaxed whitespace-pre sm:whitespace-pre-wrap">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )) || (
                <div className="p-12 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    Log systemowy jest pusty.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR CARDS */}
        <div className="space-y-8">
          <section className="p-8 rounded-[40px] bg-primary/10 border border-primary/20 backdrop-blur-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight">Potrzebujesz Pomocy?</h3>
              <p className="text-[10px] text-primary/70 font-mono uppercase tracking-widest leading-relaxed">
                Masz pytania dotyczące tego projektu? Otwórz zgłoszenie w Centrum Wsparcia.
              </p>
            </div>
            <Link
              href="/tickets/new"
              className="w-full h-12 bg-primary text-white rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <MessageSquare size={14} /> Kontakt_Z_PM
            </Link>
          </section>

          <section className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/10 pb-4">
              Szczegóły_Subskrypcji
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-neutral-500">Plan:</span>
                <span className="text-white font-bold">
                  {typeof project.subscription === 'object'
                    ? project.subscription?.name
                    : 'BASIC_PLAN'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span className="text-neutral-500">Ważność:</span>
                <span className="text-green-500 font-bold">AKTYWNA</span>
              </div>
            </div>
            <form
              action={async () => {
                'use server'
                let url: string | undefined
                try {
                  const result = await getStripeCustomerPortalUrl()
                  url = result.url
                } catch (err) {
                  console.error(err)
                }
                if (url) redirect(url)
              }}
            >
              <button
                type="submit"
                className="w-full h-10 bg-white/5 hover:bg-white/10 text-neutral-400 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all"
              >
                Zarządzaj_Planem
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Szczegóły Projektu | MDKcraft',
  description: 'Podgląd szczegółowy Twojego projektu w MDKcraft.',
}
