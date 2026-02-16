import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectDetailLoading() {
  return (
    <div className="space-y-12">
      {/* Back link */}
      <Skeleton className="h-4 w-36 bg-white/5" />

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full bg-white/5" />
            <Skeleton className="h-4 w-32 bg-white/5" />
          </div>
          <Skeleton className="h-14 w-96 bg-white/5" />
          <div className="flex gap-6">
            <Skeleton className="h-4 w-36 bg-white/5" />
            <Skeleton className="h-4 w-36 bg-white/5" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-14 w-40 rounded-2xl bg-white/5" />
          <Skeleton className="h-14 w-40 rounded-2xl bg-white/5" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          <section className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <Skeleton className="h-7 w-48 bg-white/5" />
                <Skeleton className="h-3 w-64 bg-white/5" />
              </div>
              <Skeleton className="h-10 w-16 bg-white/5" />
            </div>
            <Skeleton className="h-4 w-full rounded-full bg-white/5" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <Skeleton className="h-4 w-4 bg-white/5" />
                  <Skeleton className="h-2 w-20 bg-white/5" />
                  <Skeleton className="h-4 w-24 bg-white/5" />
                </div>
              ))}
            </div>
          </section>

          {/* Activity Log */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-1 rounded-full bg-primary/30" />
              <Skeleton className="h-6 w-44 bg-white/5" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-3xl bg-white/5" />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Skeleton className="h-48 w-full rounded-[40px] bg-primary/5 border border-primary/20" />
          <Skeleton className="h-56 w-full rounded-[40px] bg-white/5 border border-white/10" />
        </div>
      </div>
    </div>
  )
}
