'use client'

import { FormError } from '@/components/forms/FormError'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { forgotPassword } = useAuth()

  const {
    formState: { errors, isLoading, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await forgotPassword({ email: data.email })
        setSuccess(true)
        setError('')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Błąd połączenia z serwerem centralnym.')
      }
    },
    [forgotPassword],
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

  const isWorking = isLoading || isSubmitting

  return (
    <Fragment>
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="form"
            initial="show"
            animate="show"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            variants={containerVariants}
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <Message error={error} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="space-y-2 relative group">
              <Label
                htmlFor="email"
                className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 ml-1 mb-1 block transition-colors group-hover:text-neutral-300"
              >
                Identyfikator E-mail Podatny_Na_Reset
              </Label>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-neutral-500'}`}
                />
                <Input
                  id="email"
                  {...register('email', {
                    required: 'Adres email jest niezbędny do weryfikacji tożsamości.',
                    onBlur: () => setIsFocused(false),
                  })}
                  type="email"
                  onFocus={() => setIsFocused(true)}
                  className="pl-12 bg-white/[0.03] border-white/10 text-white rounded-2xl h-14 focus:border-primary/50 focus:bg-primary/[0.02] transition-all duration-300 backdrop-blur-sm tracking-wide"
                  placeholder="example@example.com"
                />
              </div>
              {errors.email && <FormError message={errors.email.message} />}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <Button
                disabled={isWorking}
                type="submit"
                className="relative w-full overflow-hidden bg-primary text-white hover:bg-primary/90 font-bold h-14 rounded-2xl transition-all duration-500 uppercase tracking-widest text-xs group shadow-[0_0_40px_-10px_rgba(var(--primary),0.4)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="flex items-center justify-center gap-2 relative z-10 text-black">
                  {isWorking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Weryfikacja...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Inicjuj Reset Klucza
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)] relative"
            >
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-[20px] animate-pulse" />
              <CheckCircle2 className="w-12 h-12 relative z-10" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-black tracking-tighter uppercase mb-4 text-white"
            >
              Wniosek Przyjęty
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-400 font-mono text-xs uppercase tracking-widest leading-relaxed p-4 bg-white/[0.02] border border-white/5 rounded-2xl"
            >
              Sprawdź swoją skrzynkę odbiorczą. Przesłaliśmy protokół, który pozwoli Ci bezpiecznie
              odzyskać kontrolę nad terminalem. Pamiętaj, że token zdezaktualizuje się po upływie
              limitu czasu.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  )
}
