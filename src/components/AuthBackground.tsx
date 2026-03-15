'use client'

import { motion } from 'motion/react'

export const AuthBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#060606]">
      {/* Dynamic Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:32px_32px] bg-center bg-repeat opacity-[0.03]" />

      {/* Primary Glow Sphere */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[30%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[160px]"
      />

      {/* Secondary Glow Sphere */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-[20%] -right-[15%] w-[70vw] h-[70vw] rounded-full bg-purple-600/30 blur-[180px]"
      />

      {/* Accent Glow Sphere */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.05, 0.15, 0.05],
          x: [-100, 100, -100],
          y: [50, -50, 50],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-blue-500/20 blur-[140px]"
      />

      {/* Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/80 via-transparent to-[#060606]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#060606_100%)] opacity-80" />
    </div>
  )
}
