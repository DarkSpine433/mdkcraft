import type { Metadata } from 'next'

import { SettingsForm } from '@/components/forms/SettingsForm'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Palette, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
  const settingsCategories = [
    {
      icon: ShieldCheck,
      title: 'Prywatność i Sesje',
      description: 'Zarządzaj ciasteczkami i historią logowań.',
      href: '/settings/privacy',
      label: 'Zarządzaj',
    },
  ]

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <SlidersHorizontal className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Panel_Konfiguracyjny</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Zarządzaj pełnym zakresem swojego ekosystemu MDKcraft.
            </p>
          </div>
        </div>
      </header>

      {/* QUICK LINKS GRID */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
            Kategorie Ustawień
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between group hover:border-primary/50 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <item.icon
                    size={24}
                    className="text-neutral-400 group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="text-xl font-black tracking-tight uppercase mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-8 uppercase font-mono tracking-wider">
                  {item.description}
                </p>
              </div>

              <Link
                href={item.href}
                className="inline-flex items-center justify-center w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED SETTINGS FORM */}
      <section className="p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Palette size={200} className="text-primary" />
        </div>

        <header className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">
            Preferencje Systemowe
          </h2>
          <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
            Dostosuj zachowanie i wygląd platformy
          </p>
        </header>

        <SettingsForm />
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zarządzaj ustawieniami swojego profilu w terminalu MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Ustawienia',
    url: '/settings',
  }),
  title: 'Ustawienia',
}
