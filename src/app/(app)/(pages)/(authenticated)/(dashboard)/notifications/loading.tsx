import { Skeleton } from '@/components/ui/skeleton'

export default function NotificationsLoading() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
          <div>
            <Skeleton className="h-10 w-64 mb-2 bg-white/5" />
            <Skeleton className="h-3 w-80 bg-white/5" />
          </div>
        </div>
        <Skeleton className="h-10 w-48 rounded-xl bg-white/5" />
      </header>

      {/* Notification Cards */}
      <section className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4"
          >
            <Skeleton className="w-10 h-10 rounded-lg shrink-0 bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-48 bg-white/5" />
                <Skeleton className="h-4 w-32 bg-white/5" />
              </div>
              <Skeleton className="h-3 w-full bg-white/5" />
              <Skeleton className="h-3 w-3/4 bg-white/5" />
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 pt-8">
        <Skeleton className="w-11 h-11 rounded-xl bg-white/5" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-xl bg-white/5" />
        ))}
        <Skeleton className="w-11 h-11 rounded-xl bg-white/5" />
      </div>
    </div>
  )
}
