import { Button } from '@/components/ui/button'
import { Project } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { CheckCircle2, Clock, ExternalLink, PanelsTopLeft, Plus, Search } from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login?redirect=/projects')
  }

  const where: any = {
    client: {
      equals: user.id,
    },
  }

  if (q) {
    where.title = {
      contains: q,
    }
  }

  if (status) {
    where.status = {
      equals: status,
    }
  }

  const projectsResult = await payload.find({
    collection: 'projects',
    where,
    sort: '-createdAt',
  })

  const projects = projectsResult.docs as Project[]

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <PanelsTopLeft className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Moje Projekty</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Zarządzaj aktywnymi wdrożeniami i historią współpracy.
            </p>
          </div>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus size={14} />
            Nowy Projekt
          </Button>
        </Link>
      </header>

      {/* FILTERS & SEARCH */}
      <form className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="SZUKAJ_PROJEKTU..."
            className="w-full bg-white/5 border-none h-11 pl-12 pr-4 rounded-2xl text-xs font-mono uppercase tracking-widest focus:ring-1 focus:ring-primary/50 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            name="status"
            defaultValue={status}
            className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors text-[10px] uppercase font-mono tracking-widest outline-none appearance-none"
          >
            <option value="">Wszystkie Statusy</option>
            <option value="planning">Planowanie</option>
            <option value="designing">Projektowanie</option>
            <option value="development">Wdrażanie</option>
            <option value="testing">Testowanie</option>
            <option value="completed">Zakończone</option>
          </select>
          <button
            type="submit"
            className="h-11 px-6 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Filtruj_Wyniki
          </button>
        </div>
      </form>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {projects.length === 0 ? (
          <div className="col-span-full p-10 md:p-20 rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-white/5 rounded-full mb-4">
              <PanelsTopLeft size={40} className="text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Brak Aktywnych Projektów</h3>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest max-w-xs leading-relaxed">
              Nie masz jeszcze żadnych przypisanych projektów. Rozpocznij współpracę już teraz.
            </p>
            <Link
              href="/kontakt"
              className="px-8 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Kontakt Z Zespołem
            </Link>
          </div>
        ) : (
          projects.map((project: Project) => (
            <div
              key={project.id}
              className="group p-6 md:p-8 rounded-[30px] md:rounded-[38px] bg-white/5 border border-white/10 backdrop-blur-3xl hover:border-primary/50 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <PanelsTopLeft size={120} className="text-primary" />
              </div>

              <div className="space-y-6 relative z-10 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1 max-w-full">
                    <span className="text-[10px] text-primary font-mono uppercase tracking-[0.2em]">
                      #{project.id.slice(-6)}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight break-words">
                      {project.title}
                    </h3>
                  </div>
                  <div className="shrink-0 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {project.status?.toUpperCase() || 'W TOKU'}
                  </div>
                </div>

                <div className="text-neutral-400 text-xs leading-relaxed font-mono uppercase line-clamp-2 max-w-full">
                  {project.description
                    ? typeof project.description === 'string'
                      ? project.description
                      : 'Opis projektu dostępny w szczegółach.'
                    : 'Brak opisu projektu.'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                      Ostatnia Zmiana
                    </p>
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                      <Clock size={14} className="text-primary" />
                      {new Date(project.updatedAt).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                      Postęp
                    </p>
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                      <CheckCircle2 size={14} className="text-primary" />
                      {project.progress || 0}% Gotowe
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-3 relative z-10">
                <Link
                  href={`/projects/${project.slug || project.id}`}
                  className="flex-1 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Szczegóły
                </Link>
                <button className="h-12 sm:w-12 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center transition-all">
                  <ExternalLink size={18} />
                  <span className="sm:hidden ml-2 text-[10px] font-black uppercase tracking-widest">
                    Podgląd
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zarządzaj swoimi projektami w MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Moje Projekty',
    url: '/projects',
  }),
  title: 'Projekty',
}
