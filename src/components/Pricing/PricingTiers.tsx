'use client'
import { Check, Terminal } from 'lucide-react'
import GlowingButton from '../landingpage/GlowingButton'

// Zakładamy, że typy pochodzą z Twojego Payload (SubscriptionPlan)
type Props = {
  plans: any[]
}

const PricingTiers = ({ plans }: Props) => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <div
            key={plan.id}
            className="group relative flex flex-col p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:bg-white/[0.04]"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  Package_ID: {plan.id.slice(0, 8)}
                </span>
                {plan.name === 'Pro' && (
                  <span className="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-400 font-bold uppercase tracking-tighter">
                    Zalecane
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price} PLN</span>
                <span className="text-xs text-neutral-500 font-mono">
                  / {plan.billingCycle === 'monthly' ? 'msc' : 'rok'}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="flex-grow space-y-4 mb-8">
              {plan.features?.map((f: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 group/item">
                  <Check size={14} className="mt-1 text-violet-500 shrink-0" />
                  <span className="text-sm text-neutral-400 group-hover/item:text-neutral-200 transition-colors">
                    {f.feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Action */}
            <GlowingButton className="w-full justify-center py-6 text-xs uppercase tracking-widest font-bold">
              Inicjuj Projekt
            </GlowingButton>

            {/* Bottom Decor */}
            <div className="absolute bottom-2 right-2 opacity-10">
              <Terminal size={40} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PricingTiers
