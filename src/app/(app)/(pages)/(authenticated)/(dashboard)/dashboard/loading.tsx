import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-80 mb-2 bg-white/5" />
          <Skeleton className="h-4 w-96 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg bg-white/5" />
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <Skeleton className="w-11 h-11 rounded-xl mb-4 bg-white/5" />
            <Skeleton className="h-3 w-24 mb-2 bg-white/5" />
            <Skeleton className="h-6 w-36 bg-white/5" />
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-1 rounded-full bg-primary/30" />
            <Skeleton className="h-6 w-48 bg-white/5" />
          </div>
          <Skeleton className="h-4 w-32 bg-white/5" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl bg-white/5" />
          ))}
        </div>
      </section>

      {/* Files Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-1 rounded-full bg-primary/30" />
            <Skeleton className="h-6 w-44 bg-white/5" />
          </div>
          <Skeleton className="h-4 w-28 bg-white/5" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-1 rounded-full bg-primary/30" />
            <Skeleton className="h-6 w-52 bg-white/5" />
          </div>
          <Skeleton className="h-4 w-40 bg-white/5" />
        </div>
        <div className="bg-[#0a0a0c]/80 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div className="hidden md:block p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg bg-white/5" />
            ))}
          </div>
          <div className="md:hidden p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
