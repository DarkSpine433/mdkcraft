'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (redirect) router.push(redirect)
        else
          router.push(
            `/account/dashboard?success=${encodeURIComponent('Account created successfully')}`,
          )
      } catch (_) {
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Email_Address
          </Label>
          <Input
            id="email"
            {...register('email', { required: 'Email is required.' })}
            type="email"
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all"
            placeholder="node@mdkcraft.pl"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" title="Password" className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Nowe_Hasło
          </Label>
          <Input
            id="password"
            {...register('password', { required: 'Password is required.' })}
            type="password"
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all"
            placeholder="••••••••"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirm" className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Potwierdź_Hasło
          </Label>
          <Input
            id="passwordConfirm"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
            type="password"
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all"
            placeholder="••••••••"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </div>
      </div>

      <Button
        disabled={loading}
        type="submit"
        className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
      >
        {loading ? 'Inicjalizacja...' : 'Utwórz_Konto'}
      </Button>
    </form>
  )
}
