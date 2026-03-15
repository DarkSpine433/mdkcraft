const PricingHero = () => {
  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-violet-500/50" />
          <span className="text-[10px]  text-violet-400 uppercase tracking-[0.3em]">
            Protokół_Cenowy_v2.0.6
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase italic">
          WYBIERZ SWÓJ{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
            POZIOM MOCY
          </span>
        </h1>

        <p className="max-w-2xl text-neutral-400 text-sm md:text-base  leading-relaxed border-l-2 border-violet-500/30 pl-6">
          Transparentne plany subskrypcyjne i opcje konfiguracji dostosowane do skali Twojej
          operacji. Wybierz fundament, na którym zbudujemy Twoją cyfrową obecność.
        </p>
      </div>
    </section>
  )
}

export default PricingHero
