'use client'

import { FormError } from '@/components/forms/FormError'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
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
  const [error, setError] = useState<null | string>(null)
  const [isFocused, setIsFocused] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    formState: { errors, isLoading, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const user = await login(data)
        console.log('Login success user:', user)
        if (redirect?.current) router.push(redirect.current)
        else router.push('/dashboard')
      } catch (e) {
        console.error('Login error:', e)
        setError('Błędne dane uwierzytelniające. Spróbuj ponownie. Błąd: ' + String(e))
      }
    },
    [login, router],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6"
          >
            <Message error={error} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <motion.div variants={itemVariants} className="space-y-2 relative group">
          <Label
            htmlFor="email"
            className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 ml-1 mb-1 block transition-colors group-hover:text-neutral-300"
          >
            Identyfikator E-mail
          </Label>
          <div className="relative">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused === 'email' ? 'text-primary' : 'text-neutral-500'}`}
            />
            <Input
              id="email"
              type="email"
              onFocus={() => setIsFocused('email')}
              className="pl-12 bg-white/[0.03] border-white/10 text-white rounded-2xl h-14 focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 backdrop-blur-sm"
              placeholder="example@example.com"
              {...register('email', {
                required: 'Email jest wymagany.',
                onBlur: () => setIsFocused(null),
              })}
            />
          </div>
          {errors.email && <FormError message={errors.email.message} />}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 relative group">
          <div className="flex justify-between items-center mb-1">
            <Label
              htmlFor="password"
              className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 ml-1 transition-colors group-hover:text-neutral-300"
            >
              Klucz Dostępu (Hasło)
            </Label>
            <Link
              href={`/forgot-password${allParams}`}
              className="text-[10px] font-mono uppercase tracking-widest text-primary/70 hover:text-primary transition-colors"
            >
              Resetuj Klucz
            </Link>
          </div>
          <div className="relative">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused === 'password' ? 'text-primary' : 'text-neutral-500'}`}
            />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              onFocus={() => setIsFocused('password')}
              className="pl-12 pr-12 bg-white/[0.03] border-white/10 text-white rounded-2xl h-14 focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 backdrop-blur-sm tracking-widest"
              placeholder="••••••••"
              {...register('password', {
                required: 'Proszę podać hasło.',
                onBlur: () => setIsFocused(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <FormError message={errors.password.message} />}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-2">
        <Button
          className="relative w-full overflow-hidden bg-primary text-white hover:bg-primary/90 
           font-bold h-14 rounded-2xl transition-all duration-500 uppercase tracking-widest text-xs group shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.8)]"
          disabled={isLoading || isSubmitting}
          type="submit"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="flex items-center justify-center gap-2 relative z-10 text-black">
            {isLoading || isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Przetwarzanie...
              </>
            ) : (
              <>
                Autoryzuj Wejście
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </Button>
      </motion.div>
    </motion.form>
  )
}
