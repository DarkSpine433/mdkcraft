import { HeroSkeleton, ProjectCardSkeleton } from './components/ShowcaseSkeletons'

export default function Loading() {
  return (
    <main className="relative min-h-screen text-white bg-[#020408]">
      {/* 1. HERO SKELETON */}
      <HeroSkeleton />

      {/* 2. FILTER BAR PLACEHOLDER */}
      <div className="sticky top-[88%] z-50 py-3 pointer-events-none">
        <div className="px-6 md:px-10 mx-auto flex pointer-events-auto">
          <div className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl flex gap-2 max-w-4xl shadow-2xl mx-auto items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-24 h-8 rounded-full bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* 3. PROJECT CARDS SKELETONS */}
      <div className="relative z-10">
        {[1, 2].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
