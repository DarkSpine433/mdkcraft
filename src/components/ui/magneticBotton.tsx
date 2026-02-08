"use client"

import { cn } from '@/utilities/cn'
import { ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import React, { memo, useCallback, useRef } from 'react'

const GlobalButtonStyle = memo(() => (
  <style jsx global>{`
    /* BAZOWY STAN KURSORA (Kiedy NIE jest nad przyciskiem) */
    #cursorBg {
      /* To zapewnia płynny powrót do pierwotnego stanu */
      transition: 
        width 0.5s cubic-bezier(0.19, 1, 0.22, 1),
        height 0.5s cubic-bezier(0.19, 1, 0.22, 1),
        opacity 0.4s ease,
        background 0.4s ease,
        filter 0.4s ease,
        mix-blend-mode 0.4s ease;
      
      /* Domyślne wartości (zmień jeśli Twój kursor bazowy jest inny) */
      opacity: 0.4; 
      mix-blend-mode: normal;
    }

    /* EFEKT WIDOWISKOWY NA HOVER (Kiedy myszka jest nad przyciskiem) */
    body:has(.buttonDetector:hover) #cursorBg {
      mix-blend-mode: exclusion;
      filter: brightness(1.5) contrast(1.5);
      opacity: 1;
      
      background: white !important;
      width: 220px !important;
      height: 220px !important;
      border-radius: 50%;
    }

    /* Opcjonalnie: wyłączenie kursora systemowego dla profesjonalnego looku */
    body:has(.buttonDetector:hover) {
      cursor: none;
    }
  `}</style>
))
GlobalButtonStyle.displayName = 'GlobalButtonStyle'

const MagneticButton = memo(({
children,
className,
icon,
onClick,
variant = 'primary',
margin = 'mx-auto',
}: {
children: React.ReactNode
className?: string
icon?: React.ReactNode
onClick?: () => void
variant?: 'primary' | 'outline'
margin?: 'mx-auto' | 'mx-0'
}) => {
const ref = useRef<HTMLDivElement>(null)
const rectRef = useRef<DOMRect | null>(null)

const x = useMotionValue(0)
const y = useMotionValue(0)
const xText = useMotionValue(0)
const yText = useMotionValue(0)

const springX = useSpring(x, { stiffness: 150, damping: 15 })
const springY = useSpring(y, { stiffness: 150, damping: 15 })
const springXtext = useSpring(xText, { stiffness: 90, damping: 10 })
const springYtext = useSpring(yText, { stiffness: 90, damping: 10 })

const handleMouseEnter = useCallback(() => {
  if (ref.current) {
    rectRef.current = ref.current.getBoundingClientRect()
  }
}, [])

const onMouseMove = useCallback((e: React.MouseEvent) => {
if (!rectRef.current) return

const { clientX, clientY } = e
const { left, top, width, height } = rectRef.current

const centerX = left + width / 2
const centerY = top + height / 2

x.set((clientX - centerX) * 0.2)
y.set((clientY - centerY) * 0.2)
xText.set((clientX - centerX) * 0.1)
yText.set((clientY - centerY) * 0.1)
}, [x, y, xText, yText])

const onMouseLeave = useCallback(() => {
x.set(0)
y.set(0)
xText.set(0)
yText.set(0)
rectRef.current = null
}, [x, y, xText, yText])

return (<>
<GlobalButtonStyle />
<motion.div
ref={ref}
onMouseEnter={handleMouseEnter}
onMouseMove={onMouseMove}
onMouseLeave={onMouseLeave}
style={{ x: springX, y: springY }}
className={`relative z-10 w-fit ${margin} will-change-transform`}
>
<motion.button
onClick={onClick}
className={cn(
'buttonDetector h-16 px-10 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer',
variant === 'primary'
? 'bg-primary text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
: 'bg-transparent border border-white/10 text-gray-400 hover:border-primary hover:text-white',
className,
)}
>
{/* TREŚĆ PRZYCISKU */}
        <motion.span
          className="relative z-10 flex items-center justify-center"
          style={{ x: springXtext, y: springYtext }} 
        >
          <span>{children}</span>
          <div className="relative flex items-center">
            {icon ? icon : <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
          </div>
        </motion.span>
</motion.button>
</motion.div>
</>)
})

MagneticButton.displayName = 'MagneticButton'

export default MagneticButton 