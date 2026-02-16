import { Skeleton } from '@/components/ui/skeleton'

export default function PrivacyLoading() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
          <div>
            <Skeleton className="h-10 w-56 mb-2 bg-white/5" />
            <Skeleton className="h-3 w-80 bg-white/5" />
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <Skeleton className="w-10 h-10 rounded-xl bg-white/5" />
            <Skeleton className="h-5 w-44 bg-white/5" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-2/3 bg-white/5" />
            <Skeleton className="h-6 w-28 rounded-full bg-white/5" />
          </div>
        ))}
      </div>

      {/* Sessions Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <Skeleton className="h-6 w-56 bg-white/5" />
          <Skeleton className="h-3 w-32 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-44 bg-white/5" />
                  <Skeleton className="h-3 w-64 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Info / Actions */}
      <section className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
        <div className="flex items-start gap-4">
          <Skeleton className="w-5 h-5 shrink-0 bg-white/5" />
          <div className="space-y-4 max-w-2xl">
            <Skeleton className="h-6 w-48 bg-white/5" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-3/4 bg-white/5" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40 rounded-lg bg-white/5" />
          <Skeleton className="h-10 w-40 rounded-lg bg-white/5" />
        </div>
      </section>
    </div>
  )
}
