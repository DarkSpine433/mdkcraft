'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { Lock, ShieldCheck, Unlock, UserCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type AccountInfoData = {
  name: string
  surname: string
  phone?: string
  company?: string
}

type PasswordFormData = {
  password?: string
  passwordConfirm?: string
}

export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const router = useRouter()

  // Lock states for account info fields
  const [unlocked, setUnlocked] = useState({
    name: false,
    surname: false,
    phone: false,
    company: false,
  })

  // Form 1: Account Info
  const infoForm = useForm<AccountInfoData>()
  const {
    formState: { errors: infoErrors, isSubmitting: infoSubmitting, isDirty: infoDirty },
    handleSubmit: handleInfoSubmit,
    reset: resetInfo,
    register: registerInfo,
  } = infoForm

  // Form 2: Password
  const passwordForm = useForm<PasswordFormData>()
  const {
    formState: { errors: passErrors, isSubmitting: passSubmitting, isDirty: passDirty },
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    register: registerPass,
    watch: watchPass,
  } = passwordForm

  const watchNewPassword = watchPass('password', '')

  const onInfoSubmit = useCallback(
    async (data: AccountInfoData) => {
      if (user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
            {
              body: JSON.stringify(data),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
            },
          )

          if (response.ok) {
            const json = await response.json()
            setUser(json.doc)
            toast.success('Dane osobowe zostały zaktualizowane.')
            setUnlocked({
              name: false,
              surname: false,
              phone: false,
              company: false,
            })
            resetInfo({
              name: json.doc.name,
              surname: json.doc.surname,
              phone: json.doc.phone,
              company: json.doc.company,
            })
          } else {
            toast.error('Wystąpił problem podczas aktualizacji danych.')
          }
        } catch (_error) {
          toast.error('Błąd połączenia z serwerem.')
        }
      }
    },
    [user, setUser, resetInfo],
  )

  const onPassSubmit = useCallback(
    async (data: PasswordFormData) => {
      if (user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
            {
              body: JSON.stringify({ password: data.password }),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
            },
          )

          if (response.ok) {
            toast.success('Hasło zostało zmienione.')
            resetPass({
              password: '',
              passwordConfirm: '',
            })
          } else {
            toast.error('Nie udało się zmienić hasła.')
          }
        } catch (_error) {
          toast.error('Błąd połączenia z serwerem.')
        }
      }
    },
    [user, resetPass],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          'Musisz być zalogowany, aby zobaczyć tę stronę.',
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    if (user) {
      const u = user as User
      resetInfo({
        name: u.name ?? '',
        surname: u.surname ?? '',
        phone: u.phone ?? '',
        company: u.company ?? '',
      })
    }
  }, [user, router, resetInfo])

  const toggleLock = (field: keyof typeof unlocked) => {
    setUnlocked((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SECTION 1: PERSONAL INFO */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCircle2 className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter uppercase">Dane_Osobowe</h2>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                Tożsamość użytkownika
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem>
              <div className="flex justify-between items-center mb-2">
                <Label
                  htmlFor="info-name"
                  className="text-[10px] font-mono uppercase tracking-widest text-neutral-500"
                >
                  Imię
                </Label>
                <button
                  type="button"
                  onClick={() => toggleLock('name')}
                  className="text-[10px] font-mono uppercase text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  {unlocked.name ? <Unlock size={10} /> : <Lock size={10} />}
                  {unlocked.name ? 'Zablokuj' : 'Odblokuj'}
                </button>
              </div>
              <Input
                id="info-name"
                disabled={!unlocked.name}
                {...registerInfo('name', { required: 'Proszę podać imię.' })}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {infoErrors.name && <FormError message={infoErrors.name.message} />}
            </FormItem>

            <FormItem>
              <div className="flex justify-between items-center mb-2">
                <Label
                  htmlFor="info-surname"
                  className="text-[10px] font-mono uppercase tracking-widest text-neutral-500"
                >
                  Nazwisko
                </Label>
                <button
                  type="button"
                  onClick={() => toggleLock('surname')}
                  className="text-[10px] font-mono uppercase text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  {unlocked.surname ? <Unlock size={10} /> : <Lock size={10} />}
                  {unlocked.surname ? 'Zablokuj' : 'Odblokuj'}
                </button>
              </div>
              <Input
                id="info-surname"
                disabled={!unlocked.surname}
                {...registerInfo('surname', { required: 'Proszę podać nazwisko.' })}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {infoErrors.surname && <FormError message={infoErrors.surname.message} />}
            </FormItem>
          </div>

          <FormItem>
            <div className="flex justify-between items-center mb-2">
              <Label
                htmlFor="info-phone"
                className="text-[10px] font-mono uppercase tracking-widest text-neutral-500"
              >
                Numer telefonu
              </Label>
              <button
                type="button"
                onClick={() => toggleLock('phone')}
                className="text-[10px] font-mono uppercase text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                {unlocked.phone ? <Unlock size={10} /> : <Lock size={10} />}
                {unlocked.phone ? 'Zablokuj' : 'Odblokuj'}
              </button>
            </div>
            <Input
              id="info-phone"
              disabled={!unlocked.phone}
              {...registerInfo('phone')}
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="+48 000 000 000"
            />
          </FormItem>

          <FormItem>
            <div className="flex justify-between items-center mb-2">
              <Label
                htmlFor="info-company"
                className="text-[10px] font-mono uppercase tracking-widest text-neutral-500"
              >
                Firma / Organizacja
              </Label>
              <button
                type="button"
                onClick={() => toggleLock('company')}
                className="text-[10px] font-mono uppercase text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                {unlocked.company ? <Unlock size={10} /> : <Lock size={10} />}
                {unlocked.company ? 'Zablokuj' : 'Odblokuj'}
              </button>
            </div>
            <Input
              id="info-company"
              disabled={!unlocked.company}
              {...registerInfo('company')}
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Nazwa Twojej firmy"
            />
          </FormItem>

          <Button
            disabled={infoSubmitting || !infoDirty}
            type="submit"
            className="w-full md:w-auto h-12 px-10 bg-primary hover:bg-primary/90  font-black rounded-xl transition-all disabled:opacity-30 uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
          >
            {infoSubmitting ? 'Przetwarzanie...' : 'Zapisz Zmiany'}
          </Button>
        </form>
      </section>

      {/* SECTION 2: SECURITY */}
      <section className="space-y-8 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShieldCheck className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter uppercase">Bezpieczeństwo</h2>
            <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
              Zmiana zabezpieczeń konta
            </p>
          </div>
        </div>

        <form onSubmit={handlePassSubmit(onPassSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <Label
                htmlFor="pass-new"
                className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block"
              >
                Nowe hasło
              </Label>
              <Input
                id="pass-new"
                {...registerPass('password', { required: 'Podaj nowe hasło.' })}
                type="password"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all"
                placeholder="••••••••"
              />
              {passErrors.password && <FormError message={passErrors.password.message} />}
            </FormItem>

            <FormItem>
              <Label
                htmlFor="pass-confirm"
                className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block"
              >
                Potwierdź hasło
              </Label>
              <Input
                id="pass-confirm"
                {...registerPass('passwordConfirm', {
                  required: 'Potwierdź hasło.',
                  validate: (value) => value === watchNewPassword || 'Hasła nie są identyczne',
                })}
                type="password"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all"
                placeholder="••••••••"
              />
              {passErrors.passwordConfirm && (
                <FormError message={passErrors.passwordConfirm.message} />
              )}
            </FormItem>
          </div>

          <Button
            disabled={passSubmitting || !passDirty}
            type="submit"
            className="w-full md:w-auto h-12 px-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl transition-all disabled:opacity-30 uppercase tracking-widest text-xs"
          >
            {passSubmitting ? 'Zmienianie...' : 'Zmień_Hasło'}
          </Button>
        </form>
      </section>
    </div>
  )
}
