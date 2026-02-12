// src/components/ClientLayoutWrapper.tsx
'use client'

import { AppSidebar } from '@/components/AppSidebar'
import { motion } from 'motion/react'
import { ReactNode, useState } from 'react'

export function ClientLayoutWrapper({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="relative min-h-screen bg-[#020204]">
      {/* Sidebar przekazujemy jako czysty komponent kliencki */}
      <AppSidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <motion.div
        initial={false}
        animate={{ paddingLeft: isSidebarOpen ? '280px' : '80px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col min-h-screen"
      >
        <main className="flex-1 p-6 lg:p-10">{children}</main>
        {/* Footer wstrzyknięty z serwera */}
        {footer}
      </motion.div>
    </div>
  )
}
