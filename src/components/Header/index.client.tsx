'use client'

import { Header, User } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '../Logo/Logo'
import GlowingButton from '../landingpage/GlowingButton'

type Props = {
  header: Header
  user: User | null
}

export function HeaderClient({ header: _header, user }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenu])

  const navLinks = [
    { icon: <></>, name: 'O nas', href: '/#about' },
    { icon: <></>, name: 'Oferta', href: '/#services' },
    { icon: <></>, name: 'Realizacje', href: '/#projects' },
    { icon: <></>, name: 'Opinie', href: '/#testimonials' },
    { icon: <></>, name: 'Cennik', href: '/pricing' },
  ]

  const renderContactButton = (className?: string) => (
    <Link onClick={() => setMobileMenu(false)} href={user ? '/dashboard' : '/create-account'}>
      <GlowingButton className={cn('font-extrabold transition-all', className)}>
        {user ? 'Panel' : 'Konto'}
      </GlowingButton>
    </Link>
  )

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-100 transition-all duration-500 border-b',
          scrolled || mobileMenu
            ? 'bg-background/80 backdrop-blur-xl border-white/10 py-4'
            : 'bg-transparent py-6 border-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* LEWA STRONA: Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter flex items-center gap-2 group"
            >
              <Logo />
              <span className="group-hover:text-violet-400 transition-colors hidden sm:block">
                MDKcraft
              </span>
            </Link>
          </div>

          {/* ŚRODEK: Desktop Menu */}
          <div
            className={cn(
              'hidden transition-all md:flex items-center justify-center rounded-full border border-white/5 bg-white/5 backdrop-blur-md',
              scrolled ? 'bg-transparent border-transparent' : 'shadow-2xl shadow-black/50',
            )}
          >
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-all whitespace-nowrap px-5 py-2.5 relative group/link',

                    i === 0 ? 'rounded-l-full ' : '',
                    i === navLinks.length - 1 ? 'rounded-r-full' : '',
                  )}
                >
                  <div className="relative z-10 flex items-center gap-2">{link.name}</div>

                  <div
                    className={`absolute inset-0 bg-white/5 opacity-0 group-hover/link:opacity-100 transition-opacity border-x border-white/5  z-0 ${i === 0 ? 'rounded-l-full' : ''} ${i === navLinks.length - 1 ? 'rounded-r-full' : ''}`}
                  />
                </Link>
              )
            })}
          </div>

          {/* PRAWA STRONA: Przycisk i Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:block">
              {renderContactButton(
                'w-full  text-xs tracking-[0.2em] uppercase font-black shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] active:scale-95',
              )}
            </div>

            {/* Mobile Toggle - Custom Animated Hamburger */}
            <button
              className="md:hidden relative z-101 w-12 h-12 flex items-center justify-center text-white p-2 hover:bg-white/5 rounded-full transition-colors"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span
                  animate={{
                    rotate: mobileMenu ? 45 : 0,
                    y: mobileMenu ? 9 : 0,
                  }}
                  className="w-full h-0.5 bg-white rounded-full origin-left"
                />
                <motion.span
                  animate={{
                    opacity: mobileMenu ? 0 : 1,
                    x: mobileMenu ? 10 : 0,
                  }}
                  className="w-full h-0.5 bg-white rounded-full"
                />
                <motion.span
                  animate={{
                    rotate: mobileMenu ? -45 : 0,
                    y: mobileMenu ? -9 : 0,
                  }}
                  className="w-full h-0.5 bg-white rounded-full origin-left"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - MOVED OUTSIDE FOR PROPER FIXED POSITIONING */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 bg-[#020204]/98 backdrop-blur-3xl z-90 flex flex-col pt-24 overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-50" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] opacity-30" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[32px_32px]" />

              {/* Decorative SVG Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start px-8 relative z-10 overflow-y-auto">
              <nav className="flex flex-col gap-4 w-full max-w-sm">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, type: 'spring', damping: 20 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenu(false)}
                        className={cn(
                          'group flex items-center justify-between  py-5 border-b border-white/5 transition-all',
                        )}
                      >
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              'text-4xl font-black uppercase tracking-tighter transition-all group-hover:pl-2 group-hover:text-primary',
                            )}
                          >
                            {link.name}
                          </span>
                        </div>
                        <motion.div
                          initial={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="bg-primary/10 p-3 rounded-full border border-primary/20 text-primary"
                        >
                          <svg
                            className="w-5 h-5 fill-none stroke-current stroke-2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full mx-auto flex justify-center border-t border-white/5 py-10 bg-black/40 backdrop-blur-xl mt-auto"
            >
              <div className="w-full max-w-xs px-6">
                {renderContactButton(
                  'w-full  text-2xl tracking-[0.2em] uppercase font-black shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] active:scale-95',
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
