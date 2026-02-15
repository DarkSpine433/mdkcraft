'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'Wystąpił problem podczas próby wysłania wiadomości e-mail z resetowaniem hasła. Spróbuj ponownie.',
      )
    }
  }, [])

  return (
    <Fragment>
      {!success && (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Message className="mb-8" error={error} />

          <FormItem>
            <Label
              htmlFor="email"
              className="text-sm font-mono uppercase tracking-widest text-neutral-500 mb-2 block"
            >
              Adres E-mail
            </Label>
            <Input
              id="email"
              {...register('email', { required: 'Proszę podać adres e-mail.' })}
              type="email"
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono"
              placeholder="operator@mdkcraft.pl"
            />
            {errors.email && <FormError message={errors.email.message} />}
          </FormItem>

          <Button
            type="submit"
            className="w-full h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all"
          >
            Wyślij link do resetowania
          </Button>
        </form>
      )}
      {success && (
        <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <h2 className="text-xl font-black tracking-tighter uppercase mb-2">Wniosek_Wysłany</h2>
          <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Sprawdź swoją skrzynkę odbiorczą. Przesłaliśmy link, który pozwoli Ci bezpiecznie
            zresetować hasło.
          </p>
        </div>
      )}
    </Fragment>
  )
}
