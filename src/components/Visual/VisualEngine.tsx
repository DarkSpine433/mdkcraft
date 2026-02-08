"use client";

import { motion, useMotionValue, useSpring } from 'motion/react';
import { memo, useEffect } from 'react';

const GlobalStyles = () => (
<style jsx global>{`
  /* 1. DEFINICJA ANIMACJI KIERESZOWANIA KSZTAŁTU (BLOB) */
  @keyframes blob-morph {
    0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
    25% { border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%; }
    50% { border-radius: 50% 50% 34% 66% / 56% 68% 32% 44%; }
    75% { border-radius: 46% 54% 50% 50% / 35% 61% 39% 65%; }
    100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
  }

  /* 2. BAZOWY STAN KURSORA */
  #cursorBg {
      width: 20px !important; /* Większy, żeby morfing był widoczny */
    height: 20px !important;
    mix-blend-mode: exclusion;
    
    /* Zmiana w białego bloba */
    filter: brightness(1.1) contrast(1.1); /* Blur pomaga ukryć "techniczne" krawędzie */

    /* AKTYWACJA MORFINGU */
    animation: blob-morph 8s linear infinite;

  /* 3. EFEKT "BLOB" NA PRZYCISKU */
  body:has(.buttonDetector:hover) #cursorBg {
    width: 10px !important; /* Większy, żeby morfing był widoczny */
    height: 10px !important;
    opacity: 1 !important;
    mix-blend-mode: exclusion;
    
    /* Zmiana w białego bloba */
    background: white !important;
    filter: brightness(1.1) contrast(1.1); /* Blur pomaga ukryć "techniczne" krawędzie */

    /* AKTYWACJA MORFINGU */
    animation: blob-morph 8s linear infinite;
  }

  /* 4. REAKCJA GŁÓWNEJ KROPKI (Opcjonalnie dla lepszego efektu) */
  body:has(.buttonDetector:hover) #mainCursor {
    transform: translate(-50%, -50%) scale(1.2);
    background: #fff !important;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.6);
  }
`}</style>
)

export const VisualEngine = memo(() => {
const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <GlobalStyles />
      <motion.div
        id="cursorBg"
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center transition-all  rounded-full opacity-20"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.2) 20%, rgba(124, 58, 237, 0.5) 20%, rgba(124, 58, 237, 0) 30%)',
        }}
      />
    </>
  );
});

VisualEngine.displayName = 'VisualEngine';