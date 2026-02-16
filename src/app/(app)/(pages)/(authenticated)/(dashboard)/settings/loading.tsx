import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
          <div>
            <Skeleton className="h-10 w-64 mb-2 bg-white/5" />
            <Skeleton className="h-3 w-80 bg-white/5" />
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Skeleton className="h-3 w-40 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
              <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
              <Skeleton className="h-6 w-40 bg-white/5" />
              <Skeleton className="h-3 w-full bg-white/5" />
              <Skeleton className="h-3 w-2/3 bg-white/5" />
              <Skeleton className="h-11 w-full rounded-xl bg-white/5" />
            </div>
          ))}
        </div>
      </section>

      {/* Settings Form Card */}
      <section className="p-10 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
        <header className="mb-12">
          <Skeleton className="h-7 w-56 mb-2 bg-white/5" />
          <Skeleton className="h-3 w-72 bg-white/5" />
        </header>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-36 bg-white/5" />
              <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
            </div>
          ))}
          <div className="pt-4 flex justify-end">
            <Skeleton className="h-12 w-40 rounded-xl bg-white/5" />
          </div>
        </div>
      </section>
    </div>
  )
}
