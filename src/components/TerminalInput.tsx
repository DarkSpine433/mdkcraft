'use client'

import { cn } from '@/utilities/cn'
import { motion } from 'motion/react'
import React, { useState } from 'react'

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  label,
  error,
  className,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-2 w-full group">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">
          {label}
        </label>
        {error && (
          <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest animate-pulse">
            Error: {error}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
          {'>'}
        </div>
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          placeholder={placeholder}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-sm font-mono text-white placeholder:text-neutral-700 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all',
            error && 'border-red-500/50 bg-red-500/5',
            className,
          )}
        />
        {isFocused && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'stepStart' }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-4 bg-primary/50 pointer-events-none"
          />
        )}
      </div>
    </div>
  )
}

interface TerminalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TerminalTextarea: React.FC<TerminalTextareaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-2 w-full group">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">
          {label}
        </label>
        {error && (
          <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest animate-pulse">
            Error: {error}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-6 text-primary font-mono text-sm pointer-events-none">
          {'>'}
        </div>
        <textarea
          {...props}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-sm font-mono text-white placeholder:text-neutral-700 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all min-h-[120px] resize-none',
            error && 'border-red-500/50 bg-red-500/5',
            className,
          )}
        />
        {isFocused && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'stepStart' }}
            className="absolute bottom-6 right-4 w-2 h-4 bg-primary/50 pointer-events-none"
          />
        )}
      </div>
    </div>
  )
}
