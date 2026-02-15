'use client'

import { getUnreadNotificationsCount } from '@/app/actions/dashboard'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FolderOpenDotIcon,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  LucideIcon,
  PanelsTopLeftIcon,
  Settings,
  User,
} from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '../Logo/Logo'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export const AppSidebar = ({
  isOpen,
  toggle,
  breadcrumbs = [],
}: {
  isOpen: boolean
  toggle: () => void
  breadcrumbs?: string[]
}) => {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getUnreadNotificationsCount()
        setUnreadCount(count)
      } catch (_error) {
        console.error('Failed to fetch unread count')
      }
    }
    fetchCount()

    const handleUpdate = () => {
      fetchCount()
    }

    window.addEventListener('notificationsUpdated', handleUpdate)

    // Refresh periodically every minute
    const interval = setInterval(fetchCount, 60000)
    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const navItems = [
    { icon: LayoutDashboard, label: 'Pulpit', href: '/dashboard' },
    { icon: PanelsTopLeftIcon, label: 'Projekty', href: '/projects' },
    { icon: FolderOpenDotIcon, label: 'Pliki', href: '/files' },
    { icon: LifeBuoy, label: 'Zgłoszenia', href: '/tickets' },
    { icon: User, label: 'Mój Profil', href: '/account' },
    { icon: Bell, label: 'Powiadomienia', href: '/notifications', badge: unreadCount },
    { icon: Settings, label: 'Ustawienia', href: '/settings' },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? '240px' : '80px' }}
      className="fixed left-0 top-0 h-screen bg-[#050507] border-r border-white/5 hidden lg:flex flex-col z-50 overflow-hidden"
    >
      {/* Header / Logo */}
      <div className="p-5 flex items-center justify-between">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="font-black tracking-tighter text-xl bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2 justify-center "
          >
            <Logo />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="ml-2 "
            >
              MDKcraft
            </motion.span>
          </motion.span>
        )}
        <button
          onClick={toggle}
          className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 transition-colors cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <div className="px-6 flex items-center justify-between">
        {!isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-black tracking-tighter text-xl bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2 justify-center flex-wrap"
          >
            <Logo />
          </motion.span>
        )}
      </div>
      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item, i) => (
          <SidebarItem
            key={i}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isOpen={isOpen}
            breadcrumbs={breadcrumbs}
            badge={item.badge}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <SidebarItem
          icon={LogOut}
          label="Wyloguj się"
          href="/logout"
          isOpen={isOpen}
          breadcrumbs={breadcrumbs}
        />
        {isOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-neutral-600  text-nowrap break-keep"
          >
            MDKcraft &copy; {new Date().getFullYear()} Wszelkie prawa
            <br />
            zastrzeżone.
          </motion.p>
        )}
      </div>
    </motion.aside>
  )
}

export const MobileSidebarContent = ({
  breadcrumbs = [],
  onItemClick,
}: {
  breadcrumbs?: string[]
  onItemClick?: () => void
}) => {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getUnreadNotificationsCount()
        setUnreadCount(count)
      } catch (_error) {
        console.error('Failed to fetch unread count')
      }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 60000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { icon: LayoutDashboard, label: 'Pulpit', href: '/dashboard' },
    { icon: PanelsTopLeftIcon, label: 'Projekty', href: '/projects' },
    { icon: FolderOpenDotIcon, label: 'Pliki', href: '/files' },
    { icon: LifeBuoy, label: 'Zgłoszenia', href: '/tickets' },
    { icon: User, label: 'Mój Profil', href: '/account' },
    { icon: Bell, label: 'Powiadomienia', href: '/notifications', badge: unreadCount },
    { icon: Settings, label: 'Ustawienia', href: '/settings' },
  ]

  return (
    <div className="flex flex-col h-full bg-[#050507]/80 backdrop-blur-xl">
      <div className="p-6">
        <span className="font-black tracking-tighter text-2xl bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
          <Logo /> MDKcraft
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item, i) => (
          <div key={i} onClick={onItemClick}>
            <SidebarItem
              icon={item.icon}
              label={item.label}
              href={item.href}
              isOpen={true}
              breadcrumbs={breadcrumbs}
              badge={item.badge}
            />
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div onClick={onItemClick}>
          <SidebarItem
            icon={LogOut}
            label="Wyloguj się"
            href="/logout"
            isOpen={true}
            breadcrumbs={breadcrumbs}
          />
        </div>
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">
          MDKcraft &copy; {new Date().getFullYear()} // SYSTEM_ONLINE
        </p>
      </div>
    </div>
  )
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isOpen,
  breadcrumbs = [],
  badge = 0,
}: {
  icon: LucideIcon
  label: string
  href: string
  isOpen: boolean
  breadcrumbs?: string[]
  badge?: number
}) => {
  const pathname = usePathname()
  const currentSection = breadcrumbs?.[0] ? `/${breadcrumbs[0]}` : ''
  const isActive = pathname === href || currentSection === href

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 ${isOpen ? 'p-3' : 'p-0'} hover:bg-white/5 rounded-xl cursor-pointer group transition-colors ${
        isActive && isOpen ? 'bg-white/5' : ''
      }`}
    >
      {!isOpen ? (
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <div
              className={`cursor-pointer p-3 flex items-center justify-center w-full relative ${
                isActive ? 'text-primary' : ''
              }`}
            >
              <Icon
                size={22}
                className={`text-neutral-500 group-hover:text-primary shrink-0 transition-colors ${
                  isActive ? 'text-primary' : ''
                }`}
              />
              {badge > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-[#050507] animate-pulse" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={15}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
              {badge > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full font-black">
                  {badge}
                </span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      ) : (
        <>
          <div className="relative">
            <Icon
              size={22}
              className={`text-neutral-500 group-hover:text-primary shrink-0 transition-colors ${
                isActive ? 'text-primary' : ''
              }`}
            />
            {badge > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#050507] animate-pulse" />
            )}
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-medium transition-colors ${
              isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
            } text-nowrap break-keep flex items-center justify-between flex-1`}
          >
            {label}
            {badge > 0 && (
              <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black border border-primary/20">
                {badge}
              </span>
            )}
          </motion.span>
        </>
      )}
    </Link>
  )
}
