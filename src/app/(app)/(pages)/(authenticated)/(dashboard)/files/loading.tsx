import { Skeleton } from '@/components/ui/skeleton'

export default function FilesLoading() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl bg-white/5" />
          <div>
            <Skeleton className="h-10 w-72 mb-2 bg-white/5" />
            <Skeleton className="h-3 w-96 bg-white/5" />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <Skeleton className="h-[76px] w-full rounded-3xl bg-white/5" />

      {/* File Table */}
      <section className="rounded-[30px] md:rounded-[40px] bg-white/5 border border-white/10 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block">
          {/* Table Header */}
          <div className="border-b border-white/5 bg-white/5 px-8 py-5 flex gap-8">
            <Skeleton className="h-3 w-24 bg-white/5" />
            <Skeleton className="h-3 w-16 bg-white/5" />
            <Skeleton className="h-3 w-28 bg-white/5" />
            <Skeleton className="h-3 w-12 bg-white/5 ml-auto" />
          </div>
          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="px-8 py-6 flex items-center gap-8 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="w-10 h-10 rounded-xl bg-white/5" />
                <div>
                  <Skeleton className="h-4 w-44 mb-1 bg-white/5" />
                  <Skeleton className="h-2 w-16 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-3 w-24 bg-white/5" />
              <div className="flex gap-2 ml-auto">
                <Skeleton className="w-9 h-9 rounded-lg bg-white/5" />
                <Skeleton className="w-9 h-9 rounded-lg bg-white/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl bg-white/5" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1 bg-white/5" />
                  <Skeleton className="h-2 w-24 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-10 w-28 rounded-lg bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
