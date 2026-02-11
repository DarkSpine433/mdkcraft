import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { CheckCircle2, Circle, Clock, Vote } from 'lucide-react'
import type { Roadmap } from '@/payload-types'

export default async function RoadmapPage() {
  const payload = await getPayload({ config: configPromise })

  const roadmapItems = await payload.find({
    collection: 'roadmap',
    limit: 100,
    sort: '-priority',
  })

  const items = roadmapItems.docs as Roadmap[]

  return (
    <div className="relative min-h-screen bg-[#020204] text-white pt-32 pb-20 px-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Roadmap_MDKcraft</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.3em]">System Evolution & Feature Pipeline</p>
        </header>

        <div className="grid gap-8">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-8 items-start">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  {item.status === 'completed' ? <CheckCircle2 size={32} /> :
                   item.status === 'in_progress' ? <Clock size={32} className="animate-pulse" /> :
                   <Circle size={32} />}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-1 bg-white/5 rounded border border-white/10 text-neutral-400">{item.status}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-1 bg-white/5 rounded border border-white/10 text-primary">{item.priority} priority</span>
                        {item.expectedRelease && <span className="text-[10px] font-mono uppercase px-2 py-1 bg-primary/20 rounded border border-primary/30 text-primary">{item.expectedRelease}</span>}
                      </div>
                    </div>

                    <button className="flex flex-col items-center gap-1 group">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all">
                        <Vote size={16} className="text-neutral-500 group-hover:text-primary" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{item.votes || 0}</span>
                    </button>
                  </div>

                  <p className="text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center border border-dashed border-white/10 rounded-3xl text-neutral-500 italic">
              Roadmap jest obecnie pusta. Wkrótce pojawią się tu nowe funkcje!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Roadmap | MDKcraft',
  description: 'Sprawdź co planujemy wdrożyć w najbliższym czasie w MDKcraft.',
}
