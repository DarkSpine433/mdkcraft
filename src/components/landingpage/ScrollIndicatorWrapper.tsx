'use client'
import {
    motion,
    useScroll
} from 'motion/react';
import { useRef } from 'react';
type Props = {
    children: React.ReactNode
}

const ScrollIndicatorWrapper = ({ children }: Props) => {  
      const containerRef = useRef<HTMLDivElement>(null);
      const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
      });

  return (
    <main  className="bg-[#020408] " ref={containerRef}>
      <motion.div 
        className="fixed right-8 top-1/2 -translate-y-1/2 h-40 w-1 hidden lg:flex flex-col items-center gap-2 z-50"
      >
        <div className="flex-grow w-px bg-white/10 relative overflow-hidden">
          <motion.div 
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
            className="absolute inset-0 bg-primary"
          />
        </div>
        <div className="text-[10px] mt-5 font-mono text-white/50 rotate-90 whitespace-nowrap translate-y-8">
          SCROLL TO NAVIGATE
        </div>
      </motion.div>
      {children}
    </main>
  )
}

export default ScrollIndicatorWrapper