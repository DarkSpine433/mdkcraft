import { Skeleton } from '@/components/ui/skeleton'

export default function AccountLoading() {
  return (
    <div className="space-y-12">
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <Skeleton className="h-8 w-56 mb-8 bg-white/5" />

        {/* Form fields skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-32 bg-white/5" />
              <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
            </div>
          ))}
          <div className="pt-4 flex justify-end">
            <Skeleton className="h-12 w-40 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  )
}
