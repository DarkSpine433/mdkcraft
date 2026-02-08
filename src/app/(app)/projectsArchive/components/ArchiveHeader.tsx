import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const ArchiveHeader = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none">
            <div className="container mx-auto flex justify-between items-start pointer-events-auto">
                <Link href="/" className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <ArrowRight className="rotate-180 size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Back Home</span>
                </Link>
                
                
            </div>
        </header>
    )
}
