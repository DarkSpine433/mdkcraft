import { verifyEmailAction } from '@/app/actions/auth'
import { AuthBackground } from '@/components/AuthBackground'
import { Button } from '@/components/ui/button'
import { Command, ShieldAlert, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { RedirectCountdown } from './redirect-counter'

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params
  const result = await verifyEmailAction({ token })

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 overflow-hidden">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
          <Link
            href="/"
            className="inline-flex items-center justify-center p-4 bg-white/2 border border-white/10 rounded-4xl shadow-2xl backdrop-blur-xl mb-6 hover:bg-white/4 transition-all duration-500 group"
          >
            <Command className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-500" />
            <span className="ml-3 text-2xl font-black tracking-tighter text-white">MDKcraft</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Weryfikacja</h1>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0A0A0A]/60 border border-white/5 backdrop-blur-[60px] shadow-[0_0_80px_-20px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {result.isSuccess ? (
              <>
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <ShieldCheck className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-white text-xl font-bold mb-2">System Autoryzowany</h2>
                <p className="text-neutral-400 text-sm mb-8">
                  Twoja tożsamość została pomyślnie potwierdzona w systemie MDKcraft.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <ShieldAlert className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-white text-xl font-bold mb-2">Błąd Autoryzacji</h2>
                <p className="text-neutral-400 text-sm mb-8">
                  {result.message || 'Token weryfikacyjny jest nieprawidłowy lub wygasł.'}
                </p>
              </>
            )}

            <Button
              asChild
              className="w-full bg-white text-black hover:bg-neutral-200 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
            >
              <Link href="/login">Przejdź do logowania</Link>
            </Button>

            <div className="mt-6">
              <RedirectCountdown />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
