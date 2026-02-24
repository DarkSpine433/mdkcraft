import PricingHero from '@/components/Pricing/PricingHero'
import PricingTiers from '@/components/Pricing/PricingTiers'
import config from '@/payload.config'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

export default async function PricingPage() {
  const payload = await getPayload({ config })

  // Pobieramy plany subskrypcyjne
  const { docs: plans } = await payload.find({
    collection: 'subscription-plans',
    sort: 'price',
  })

  // Pobieramy dodatki (opcjonalnie do wyświetlenia pod planami)
  const { docs: addons } = await payload.find({
    collection: 'subscription-addons',
  })

  return (
    <main className="min-h-screen bg-black selection:bg-violet-500/30">
      <PricingHero />

      <div className="max-w-7xl mx-auto pb-24">
        <PricingTiers plans={plans} />

        {/* Sekcja Dodatków (Addons) */}
        <div className="mt-24 px-6">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xl font-mono text-white uppercase tracking-tighter">
              Dostępne Moduły Dodatkowe
            </h2>
            <div className="h-[1px] flex-grow bg-white/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              >
                <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] mb-1">
                  {addon.type === 'recurring' ? 'Miesięcznie' : 'Jednorazowo'}
                </div>
                <div className="text-sm font-bold text-white mb-1">{addon.name}</div>
                <div className="text-xs text-violet-400 font-mono">+{addon.price} PLN</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  description: 'Poznaj nasze plany cenowe i wybierz idealne rozwiązanie dla swojego projektu.',
  openGraph: mergeOpenGraph({
    title: 'Cennik | MDKcraft',
    url: '/pricing',
  }),
  title: 'Cennik',
}
