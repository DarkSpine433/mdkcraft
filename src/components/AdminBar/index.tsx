'use client'

import type { PayloadAdminBarProps } from '@payloadcms/admin-bar'

import { User } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { ChevronUp } from 'lucide-react'
import { motion } from 'motion/react'
import { useSelectedLayoutSegments } from 'next/navigation'
import React, { useState } from 'react'

const collectionLabels: Record<string, { plural: string; singular: string }> = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const collection =
    segments?.[1] && collectionLabels[segments[1]]
      ? (segments[1] as keyof typeof collectionLabels)
      : 'pages'

  const onAuthChange = React.useCallback((user: User | null) => {
    const canSeeAdmin = user?.roles && Array.isArray(user?.roles) && user?.roles?.includes('admin')
    setShow(Boolean(canSeeAdmin))
  }, [])

  return (
    <div
      className={cn('fixed top-0 left-0 right-0 z-100 pointer-events-none', {
        block: show,
        hidden: !show,
      })}
    >
      <motion.div
        initial={false}
        animate={{ y: isCollapsed ? -80 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-black/95 backdrop-blur-md text-white border-b border-white/10 pointer-events-auto shadow-2xl"
      >
        <div className="container relative py-1">
          <PayloadAdminBar
            {...adminBarProps}
            className="text-white"
            classNames={{
              controls: 'font-medium text-white',
              logo: 'text-white',
              user: 'text-white',
            }}
            cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
            collectionLabels={{
              plural: collectionLabels[collection]?.plural || 'Pages',
              singular: collectionLabels[collection]?.singular || 'Page',
            }}
            logo={<Title />}
            onAuthChange={onAuthChange as any}
            style={{
              backgroundColor: 'transparent',
              padding: 0,
              position: 'relative',
              zIndex: 'unset',
            }}
          />
        </div>
      </motion.div>

      {/* Toggle Button */}
      <div className="container relative pointer-events-none">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'absolute right-4 p-2 bg-black/90 backdrop-blur-md border border-t-0 border-white/10 rounded-b-xl text-primary hover:text-white transition-all duration-300 pointer-events-auto shadow-2xl flex items-center justify-center group',
          )}
          style={{
            transform: isCollapsed ? 'translateY(1px)' : 'translateY(0)',
            top: isCollapsed ? '-30px' : '0',
            marginTop: isCollapsed ? '0' : '0',
          }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <ChevronUp size={16} />
          </motion.div>
        </button>
      </div>
    </div>
  )
}
