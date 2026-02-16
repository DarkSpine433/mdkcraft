import { Skeleton } from '@/components/ui/skeleton'

export default function UnauthenticatedLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020204] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Logo area */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-3 w-32 bg-white/5" />
          <Skeleton className="h-2 w-48 bg-white/5" />
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-primary/60 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

        <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.3em] animate-pulse">
          Ładowanie systemu...
        </p>
      </div>
    </div>
  )
}
