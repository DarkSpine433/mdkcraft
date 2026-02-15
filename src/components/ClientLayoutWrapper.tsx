// src/components/ClientLayoutWrapper.tsx
'use client'

import { AppSidebar, MobileSidebarContent } from '@/components/AppSidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ChevronLeft, Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { Button } from './ui/button'

const SIDEBAR_WIDTH_OPEN = '240px'
const SIDEBAR_WIDTH_CLOSED = '80px'

export function ClientLayoutWrapper({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .filter((part) => !part.endsWith('.js.map'))
    .map((part) => {
      if (part.includes('-id-')) {
        return part.split('-id-')[0]
      }
      if (part.includes('id')) {
        return part.split('id')[0].replace(/-$/, '')
      }
      return part
    })

  console.log(breadcrumbs)
  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      const parentPath = '/' + breadcrumbs.slice(0, -1).join('/')
      router.push(parentPath)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#020204]">
      {/* Sidebar przekazujemy jako czysty komponent kliencki */}
      <AppSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        breadcrumbs={breadcrumbs}
      />

      <motion.div
        initial={false}
        animate={{
          paddingLeft: isLargeScreen
            ? isSidebarOpen
              ? SIDEBAR_WIDTH_OPEN
              : SIDEBAR_WIDTH_CLOSED
            : '0px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col min-h-screen"
      >
        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#020204]/80 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Mobile Menu Trigger */}
              <div className="lg:hidden mr-2">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-white"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="p-0 border-r border-primary/40 bg-transparent shadow-[10px_0_30px_-10px_rgba(124,58,237,0.3)]"
                  >
                    <MobileSidebarContent
                      breadcrumbs={breadcrumbs}
                      onItemClick={() => setIsMobileOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                {breadcrumbs.length > 1 && (
                  <motion.div
                    key="back-button-container"
                    initial={{ opacity: 0, x: -10, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                    exit={{ opacity: 0, x: -10, width: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className="flex items-center overflow-hidden"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      className="group h-9 gap-2 px-3 hover:bg-white/5 text-neutral-400 hover:text-white transition-all duration-300 mr-2"
                    >
                      <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      <span className="text-xs">Wróć</span>
                    </Button>
                    <div className="h-4 w-px bg-white/10 mx-2 " />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout transition={{ type: 'spring', stiffness: 400, damping: 35 }}>
                <Breadcrumb className="">
                  <BreadcrumbList>
                    <BreadcrumbItem key="link-home">
                      <BreadcrumbLink asChild>
                        <Link href="/dashboard" className="hover:text-primary transition-colors">
                          MDKcraft
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.length > 0 && <BreadcrumbSeparator key="sep-home" />}
                    {breadcrumbs.flatMap((breadcrumb, index) => {
                      const href = `/${breadcrumbs.slice(0, index + 1).join('/')}`
                      const isLast = index === breadcrumbs.length - 1
                      const label =
                        breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1).replace(/-/g, ' ')

                      const items = [
                        <BreadcrumbItem key={`item-${href}`}>
                          <BreadcrumbLink asChild>
                            <Link
                              href={href}
                              className={`transition-colors ${
                                isLast
                                  ? 'text-white font-medium cursor-default pointer-events-none'
                                  : 'hover:text-primary'
                              }`}
                            >
                              {label}
                            </Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>,
                      ]

                      if (!isLast) {
                        items.push(<BreadcrumbSeparator key={`sep-${href}`} />)
                      }

                      return items
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              {/* Optional header actions can go here */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 container">{children}</main>

        {/* Footer wstrzyknięty z serwera */}
        <div className="border-t border-white/5 bg-[#050507]/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8">{footer}</div>
        </div>
      </motion.div>
    </div>
  )
}
