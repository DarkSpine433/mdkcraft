import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import {
  ChevronRight,
  Clock,
  Database,
  Eye,
  Globe,
  Info,
  History as LucideHistory,
  Monitor,
  Shield,
  Smartphone,
} from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export default async function PrivacyPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const sessionsResult = await payload.find({
    collection: 'user-sessions',
    where: {
      userId: {
        equals: user?.id,
      },
    },
    sort: '-sessionStart',
    limit: 5,
  })

  const sessions = sessionsResult.docs

  const privacySpecs = [
    {
      icon: Eye,
      title: 'Prywatność Wizualna',
      desc: 'Szyfrowanie danych w locie i maskowanie wrażliwych informacji.',
      status: 'Aktywne',
    },
    {
      icon: Database,
      title: 'Przechowywanie Danych',
      desc: 'Zgodność z RODO i lokalnymi standardami bezpieczeństwa.',
      status: 'Bezpieczne',
    },
    {
      icon: LucideHistory,
      title: 'Historia Sesji',
      desc: 'Logi aktywności i autoryzowane urządzenia.',
      status: sessions.length > 0 ? 'Monitorowane' : 'Brak Danych',
    },
  ]

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Centrum_Prywatności</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Zarządzaj swoimi danymi i parametrami bezpieczeństwa.
            </p>
          </div>
        </div>
      </header>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {privacySpecs.map((spec, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              <spec.icon size={20} className="text-neutral-400 group-hover:text-primary" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">{spec.title}</h3>
            <p className="text-neutral-500 text-[11px] leading-relaxed mb-6 font-mono uppercase">
              {spec.desc}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              {spec.status}
            </div>
          </div>
        ))}
      </div>

      {/* RECENT SESSIONS */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Ostatnie_Sesje_Logowania
          </h2>
          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
            Wykryte Urządzenia
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sessions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
              <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
                Brak zarejestrowanych aktywnych sesji.
              </p>
            </div>
          ) : (
            sessions.map((session: any) => (
              <div
                key={session.id}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    {session.deviceType === 'mobile' ? (
                      <Smartphone size={20} className="text-neutral-400 group-hover:text-primary" />
                    ) : (
                      <Monitor size={20} className="text-neutral-400 group-hover:text-primary" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold uppercase tracking-tight">
                        {session.browserName || 'Terminal'} {session.browserVersion}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        {session.os}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Globe size={10} /> {session.ipAddress || 'Zamaskowane'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />{' '}
                        {format(new Date(session.sessionStart), 'HH:mm • dd.MM.yyyy', {
                          locale: pl,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {session.id === sessions[0].id && (
                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                      Bieżąca
                    </span>
                  )}
                  <ChevronRight
                    size={16}
                    className="text-neutral-600 group-hover:text-white transition-colors"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Shield size={200} className="text-primary" />
        </div>

        <div className="flex items-start gap-4 mb-8">
          <Info className="text-primary shrink-0" size={20} />
          <div className="space-y-4 max-w-2xl relative z-10">
            <h2 className="text-xl font-black uppercase tracking-tighter">Twoje_Prawa_Danych</h2>
            <div className="text-neutral-400 font-mono text-xs leading-relaxed space-y-4">
              <p>
                W MDKcraft traktujemy prywatność jako fundamentalną cechę systemu, a nie dodatek.
                Wszystkie Twoje dane są przechowywane na bezpiecznych serwerach z ograniczonym
                dostępem.
              </p>
              <p>
                Masz prawo do: eksportu swoich danych, ich modyfikacji oraz całkowitego usunięcia z
                naszych systemów. W celu realizacji tych praw, skontaktuj się z naszym inspektorem
                ochrony danych przez zakładkę wsparcia.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5 relative z-10">
          <button className="h-11 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest">
            Eksportuj_Dane (JSON)
          </button>
          <button className="h-11 px-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest">
            Usuń_Prywatne_Informacje
          </button>
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Centrum prywatności i zarządzania danymi użytkownika.',
  openGraph: mergeOpenGraph({
    title: 'Prywatność',
    url: '/settings/privacy',
  }),
  title: 'Prywatność',
}
