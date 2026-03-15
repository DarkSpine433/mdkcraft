import { cn } from '@/utilities/cn'

const GlowingButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative inline-flex h-fit overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-50',
        className,
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-inherit backdrop-blur-3xl transition-all hover:bg-slate-900 px-[inherit] py-[inherit]">
        <span className="px-10 py-3 block w-full h-full">{children}</span>
      </span>
    </button>
  )
}

export default GlowingButton
