import { Skeleton } from '@/components/ui/skeleton'

export default function AuthenticatedPagesLoading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Loader */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-3 w-28 bg-white/5" />
          <Skeleton className="h-2 w-44 bg-white/5" />
        </div>

        {/* Progress bar */}
        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-primary/60 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

        <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.3em] animate-pulse">
          Wczytywanie...
        </p>
      </div>
    </div>
  )
}
