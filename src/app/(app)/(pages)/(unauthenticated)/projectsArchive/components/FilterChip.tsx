import { cn } from '@/utilities/cn'

export const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 border w-max text-nowrap whitespace-nowrap",
            active 
                ? "bg-violet-600 text-white border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                : "bg-white/5 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white"
        )}
    >
        {label}
    </button>
)
