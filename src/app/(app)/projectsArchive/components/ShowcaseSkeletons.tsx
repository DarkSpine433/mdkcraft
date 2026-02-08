'use client'


export const HeroSkeleton = () => (
  <section className="relative h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-[#020408]">
    <div className="absolute inset-0 bg-violet-600/5 animate-pulse" />
    
    <div className="text-center space-y-12 z-10 px-6 max-w-4xl w-full">
      {/* STATUS BADGE SKELETON */}
      <div className="mx-auto w-64 h-10 rounded-full border border-white/5 bg-white/5 animate-pulse" />

      {/* MAIN TITLES SKELETON */}
      <div className="space-y-4 flex flex-col items-center">
        <div className="w-[60%] h-20 md:h-32 bg-white/5 rounded-2xl animate-pulse" />
        <div className="w-[40%] h-20 md:h-32 bg-white/5 rounded-2xl animate-pulse" />
        
        <div className="flex items-center justify-center gap-4 py-4 w-full">
            <div className="h-px w-20 bg-neutral-900" />
            <div className="w-32 h-3 bg-white/5 rounded animate-pulse" />
            <div className="h-px w-20 bg-neutral-900" />
        </div>
      </div>
      
      {/* DESCRIPTION SKELETON */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
        <div className="w-[80%] h-4 bg-white/5 rounded animate-pulse mx-auto" />
      </div>

      {/* TECH TAGS SKELETON */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-32 h-8 rounded-full bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  </section>
)

export const ProjectCardSkeleton = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center py-24 px-6 md:px-20 bg-[#020408] border-b border-white/5">
    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      
      {/* LEFT: VISUALIZER SKELETON */}
      <div className="lg:col-span-7 relative aspect-square lg:aspect-auto lg:h-[70vh] rounded-3xl overflow-hidden bg-white/2 border border-white/5">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent animate-pulse" />
      </div>

      {/* RIGHT: CONTENT SKELETON */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
        <div className="space-y-4">
          <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
          <div className="w-[80%] h-12 bg-white/5 rounded-xl animate-pulse" />
          <div className="w-full h-20 bg-white/5 rounded-xl animate-pulse" />
        </div>

        {/* MILESTONES SKELETON */}
        <div className="space-y-6">
          <div className="w-32 h-3 bg-white/5 rounded animate-pulse" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="size-6 rounded-full bg-white/5 animate-pulse shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
                  <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SPECS GRID SKELETON */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-16 h-2 bg-white/5 rounded animate-pulse" />
              <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)
