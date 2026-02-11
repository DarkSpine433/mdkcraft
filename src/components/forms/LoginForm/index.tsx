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
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current)
        else router.push('/account/dashboard')
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Message error={error} />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-neutral-500">Email_Address</Label>
          <Input
            id="email"
            type="email"
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all"
            placeholder="node@MDKcraft.pl"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" name="Password" className="text-xs font-mono uppercase tracking-widest text-neutral-500">Access_Key</Label>
          <Input
            id="password"
            type="password"
            className="bg-white/5 border-white/10 rounded-xl focus:border-primary transition-all"
            placeholder="••••••••"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </div>

        <div className="text-[10px] font-mono uppercase tracking-widest">
          <Link href={`/recover-password${allParams}`} className="text-neutral-500 hover:text-primary transition-colors">
            Resetuj_Hasło
          </Link>
        </div>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest" disabled={isLoading} type="submit">
        {isLoading ? 'Przetwarzanie...' : 'Autoryzuj_Wejście'}
      </Button>
    </form>
  )
}
