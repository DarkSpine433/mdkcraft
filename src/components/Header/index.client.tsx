'use client'

import { Header, User } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { icon: <></>, name: 'O nas', href: '/#about' },
    { icon: <></>, name: 'Oferta', href: '/#services' },
    { icon: <></>, name: 'Realizacje', href: '/#projects' },
    { icon: <></>, name: 'Opinie', href: '/#testimonials' },
    { icon: <></>, name: 'Cennik', href: '/pricing' },
  ]

  const contactButton = (
    <Link href={user ? '/dashboard' : '/create-account'}>
      <GlowingButton className="h-10 px-6">{user ? 'Panel' : 'Konto'}</GlowingButton>
    </Link>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        scrolled ? 'bg-background/60 backdrop-blur-md border-white/10 py-4' : 'bg-transparent py-6',
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
          className={`hiddena transition-all md:flex items-center justify-center  rounded-full  ${scrolled ? '' : 'shadow-2xl shadow-black border-white/10 bg-white/5 border'}`}
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap border border-transparent ${scrolled ? '' : 'hover:border-white/10 hover:bg-white/15'} px-5 py-2 ${i === 0 ? 'rounded-l-full' : i === navLinks.length - 1 ? 'rounded-r-full' : ''}`}
            >
              <div className="flex items-center gap-2">
                {link.icon} {link.name}
              </div>
            </Link>
          ))}
        </div>

        {/* PRAWA STRONA: Przycisk i Mobile Toggle */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden md:block">{contactButton}</div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background absolute top-full left-0 w-full overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-2xl font-bold hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">{contactButton}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
