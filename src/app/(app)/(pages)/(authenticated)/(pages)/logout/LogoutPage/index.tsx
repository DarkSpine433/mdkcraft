'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Wylogowano pomyślnie.')
      } catch (_) {
        setError('Jesteś już wylogowany.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl mb-4">
          <Link href="/">
            <span className="text-2xl font-black tracking-tighter text-white">MDKcraft</span>
          </Link>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase">Sesja_Zakończona</h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
          {error || success}
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center">
        <p className="text-neutral-300 mb-6">Co chcesz teraz zrobić?</p>
        <div className="flex flex-col gap-3 ">
          <Link href="/" className="w-full ">
            <Button className="w-full py-6 px-4">Wróć do strony głównej</Button>
          </Link>
          <Link href="/login">
            <Button className="w-full py-6 px-4" variant={`outline`}>
              Zaloguj się ponownie
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
