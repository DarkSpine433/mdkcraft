import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsLoading() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
          <div>
            <Skeleton className="h-10 w-56 mb-2 bg-white/5" />
            <Skeleton className="h-3 w-80 bg-white/5" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-lg bg-white/5" />
      </header>

      {/* Filter Bar */}
      <Skeleton className="h-[76px] w-full rounded-3xl bg-white/5" />

      {/* Project Cards Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 md:p-8 rounded-[30px] md:rounded-[38px] bg-white/5 border border-white/10 space-y-6"
          >
            {/* Title area */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-7 w-3/4 bg-white/5" />
            </div>

            {/* Description */}
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-2/3 bg-white/5" />

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <Skeleton className="h-2 w-24 bg-white/5" />
                <Skeleton className="h-4 w-28 bg-white/5" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <Skeleton className="h-2 w-16 bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/5" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex gap-3">
              <Skeleton className="flex-1 h-12 rounded-xl bg-white/5" />
              <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
