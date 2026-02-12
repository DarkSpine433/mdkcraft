'use client'

import { ChevronLeft, ChevronRight, LayoutDashboard, Mail, Settings, Shield } from 'lucide-react'
import { motion } from 'motion/react'
import { AccountNav } from '../AccountNav'

export const AppSidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? '280px' : '80px' }}
      className="fixed left-0 top-0 h-screen bg-[#050507] border-r border-white/5 flex flex-col z-50 overflow-hidden"
    >
      {/* Header / Logo */}
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-black tracking-tighter text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
          >
            MDK_CORE
          </motion.span>
        )}
        <button
          onClick={toggle}
          className="p-2 hover:bg-white/5 rounded-lg text-neutral-400 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {[
          { icon: LayoutDashboard, label: 'Dashboard' },
          { icon: Shield, label: 'Security' },
          { icon: Mail, label: 'Messages' },
          { icon: Settings, label: 'Settings' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors"
          >
            <item.icon size={22} className="text-neutral-400 group-hover:text-primary shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-neutral-300"
              >
                {item.label}
              </motion.span>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <AccountNav className="mt-auto" />
      </div>
    </motion.aside>
  )
}
