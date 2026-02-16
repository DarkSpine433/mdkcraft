import { Skeleton } from '@/components/ui/skeleton'

export default function AddressesLoading() {
  return (
    <div>
      <div className="border p-8 rounded-lg bg-primary-foreground">
        <Skeleton className="h-8 w-40 mb-8 bg-white/5" />

        {/* Address cards */}
        <div className="mb-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <Skeleton className="h-4 w-48 bg-white/5" />
              <Skeleton className="h-3 w-64 bg-white/5" />
              <Skeleton className="h-3 w-40 bg-white/5" />
            </div>
          ))}
        </div>

        <Skeleton className="h-10 w-48 rounded-lg bg-white/5" />
      </div>
    </div>
  )
}
