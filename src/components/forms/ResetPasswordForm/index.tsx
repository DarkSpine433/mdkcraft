'use client'

import { FormError } from '@/components/forms/FormError'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  password: string
  passwordConfirm: string
}

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const { resetPassword } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)
  const [isFocused, setIsFocused] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      setError(null)
      try {
        await resetPassword({
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          token,
        })
        router.push(
          '/dashboard?success=' + encodeURIComponent('Hasło zostało pomyślnie zmienione.'),
        )
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas resetowania hasła.')
      } finally {
        setLoading(false)
      }
    },
    [resetPassword, router, token],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
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
            htmlFor="password"
            className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 ml-1 mb-1 block transition-colors group-hover:text-neutral-300"
          >
            Nowy Klucz Dostępu
          </Label>
          <div className="relative">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused === 'password' ? 'text-primary' : 'text-neutral-500'}`}
            />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              onFocus={() => setIsFocused('password')}
              className="pl-12 pr-12 bg-white/3 border-white/10 text-white rounded-2xl h-14 focus:border-primary/50 focus:bg-primary/2 transition-all duration-300 backdrop-blur-sm"
              placeholder="••••••••"
              {...register('password', {
                required: 'Proszę podać nowe hasło.',
                minLength: { value: 8, message: 'Hasło musi mieć co najmniej 8 znaków.' },
                onBlur: () => setIsFocused(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <FormError message={errors.password.message} />}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2 relative group">
          <Label
            htmlFor="passwordConfirm"
            className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 ml-1 mb-1 block transition-colors group-hover:text-neutral-300"
          >
            Potwierdź Nowy Klucz
          </Label>
          <div className="relative">
            <ShieldCheck
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused === 'passwordConfirm' ? 'text-primary' : 'text-neutral-500'}`}
            />
            <Input
              id="passwordConfirm"
              type={showPasswordConfirm ? 'text' : 'password'}
              onFocus={() => setIsFocused('passwordConfirm')}
              className="pl-12 pr-12 bg-white/3 border-white/10 text-white rounded-2xl h-14 focus:border-primary/50 focus:bg-primary/2 transition-all duration-300 backdrop-blur-sm"
              placeholder="••••••••"
              {...register('passwordConfirm', {
                required: 'Proszę potwierdzić hasło.',
                validate: (value) => value === password.current || 'Hasła nie są identyczne.',
                onBlur: () => setIsFocused(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
            >
              {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-2">
        <Button
          className="relative w-full overflow-hidden bg-primary text-black hover:bg-primary/90 
           font-bold h-14 rounded-2xl transition-all duration-500 uppercase tracking-widest text-xs group shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)]"
          disabled={loading}
          type="submit"
        >
          <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="flex items-center justify-center gap-2 relative z-10">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Aktualizacja...
              </>
            ) : (
              <>Zresetuj Klucz Dostępu</>
            )}
          </span>
        </Button>
      </motion.div>
    </motion.form>
  )
}
