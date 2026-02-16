import { Skeleton } from '@/components/ui/skeleton'

export default function TicketsLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-52 mb-2 bg-white/5" />
          <Skeleton className="h-3 w-80 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg bg-white/5" />
      </header>

      {/* Tickets Table */}
      <div className="p-6 md:p-8 rounded-[30px] md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="w-5 h-5 bg-white/5" />
          <Skeleton className="h-6 w-44 bg-white/5" />
        </div>

        <div className="bg-[#0a0a0c]/50 rounded-2xl border border-white/5 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="bg-white/5 px-6 py-4 flex gap-8">
              <Skeleton className="h-3 w-20 bg-white/5" />
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-3 w-20 bg-white/5" />
              <Skeleton className="h-3 w-12 bg-white/5" />
            </div>
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="px-6 py-5 flex items-center gap-8 border-b border-white/5 last:border-0"
              >
                <Skeleton className="h-4 w-48 bg-white/5 flex-1" />
                <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
                <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
                <Skeleton className="h-3 w-24 bg-white/5" />
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-white/5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 space-y-3">
                <Skeleton className="h-4 w-52 bg-white/5" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/5" />
                  <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
                </div>
                <Skeleton className="h-3 w-28 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
