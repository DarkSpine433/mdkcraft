"use client";

import { cn } from "@/utilities/cn";
import { ArrowRight, Globe, Layers, MousePointer2, Sparkles } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform
} from "motion/react";
import Link from "next/link";
import {
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import MagneticButton from "../ui/magneticBotton";

// --- GLOBALNE TYPY I UTILS (wklej to do utils.ts jeśli wolisz, tu dla wygody) ---

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
}

// --- KOMPONENT 1: TŁO CZĄSTECZKOWE (PARTICLES) ---
// Tworzy interaktywną sieć połączeń w tle
const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setSize({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size.w;
    canvas.height = size.h;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }[] = [];
    const particleCount = Math.floor(size.w / 15); // Responsywna ilość

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * size.w,
        y: Math.random() * size.h,
        vx: (Math.random() - 0.5) * 0.3, // Wolniejszy ruch dla elegancji
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.fillStyle = "rgba(100, 100, 100, 0.3)"; // Kolor gwiazd

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = size.w;
        if (p.x > size.w) p.x = 0;
        if (p.y < 0) p.y = size.h;
        if (p.y > size.h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Rysowanie linii połączeń
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(var(--primary-rgb, 120, 119, 198), ${
              0.1 - dist / 1000
            })`; // Używa koloru primary
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [size]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-40"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

// --- KOMPONENT 3: GLOWING ORB (SPOTLIGHT) ---
// Efekt światła podążający za myszką w tle
const BackgroundSpotlight = () => {
  const { x, y } = useMousePosition();
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(var(--primary-rgb), 0.15), transparent 40%)`,
      }}
    />
  );
};

// --- KOMPONENT 4: TEXT REVEAL & SWITCHER (Serce komponentu TitleHero) ---
const TextSwitcher = () => {
  const words = [
    "Development",
    "UI/UX Design",
    "Strategy",
    "E-Commerce",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-12 md:h-20 w-full overflow-hidden flex justify-center items-center mt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="absolute text-center"
        >
          <span className="text-3xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-primary/80 to-white bg-clip-text text-transparent drop-shadow-sm">
            {words[index].split("").map((char, i) => (
              <span
                key={i}
                className="inline-block transition-transform hover:-translate-y-2 cursor-default"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- KOMPONENT 5: GŁÓWNY TITLE HERO (Naprawiony i ulepszony) ---
const ModernTitleHero = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center z-20 perspective-1000">
      {/* GLOW EFFECT BEHIND TITLE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      {/* STATIC TOP TITLE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 via-neutral-300 to-neutral-500">
            Modern
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary ml-4">
            Web
          </span>
        </h1>
      </motion.div>

      {/* DECORATIVE LINE */}
      <div className="relative w-full max-w-2xl mx-auto my-6 md:my-10 flex items-center justify-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-20 h-1 bg-primary blur-lg animate-pulse" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full blur-[1px]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full blur-[1px]" />
      </div>

      {/* DYNAMIC TEXT SWITCHER */}
      <TextSwitcher />
    </div>
  );
};

// --- KOMPONENT 6: 3D FLOATING CARDS (Ozdobniki) ---
const FloatingCard = ({
  icon,
  className,
  delay = 0,
}: {
  icon: ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn(
        "absolute p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl hidden lg:block",
        className
      )}
    >
      <div className="bg-primary/20 p-3 rounded-full text-white">{icon}</div>
    </motion.div>
  );
};

// --- GŁÓWNA SEKCJA HERO (Złożenie wszystkiego w całość) ---
const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background text-foreground"
    >
      {/* 1. TŁO */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>
      <ParticlesBackground />
      <BackgroundSpotlight />

      {/* 2. ELEMENTY PŁYWAJĄCE (Dekoracje) */}
      <FloatingCard
        icon={<Globe size={24} />}
        className="top-[20%] left-[10%] rotate-[-6deg]"
        delay={0}
      />
      <FloatingCard
        icon={<Layers size={24} />}
        className="bottom-[30%] right-[10%] rotate-[6deg]"
        delay={1.5}
      />
      <FloatingCard
        icon={<Sparkles size={24} />}
        className="top-[30%] right-[15%] rotate-[-3deg] scale-75 blur-[1px]"
        delay={0.5}
      />

      {/* 3. GŁÓWNA ZAWARTOŚĆ (Parallax) */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 flex flex-col items-center gap-6 md:gap-10 px-4 md:px-6 w-full max-w-[100vw]"
      >
        {/* Odznaka "New" */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-xl text-xs font-medium text-primary mb-4 cursor-pointer hover:bg-primary/20 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Dostępne nowe terminy na Q3 2024
        </motion.div>

        {/* TYTUŁ */}
        <ModernTitleHero />

        {/* PODTYTUŁ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-2xl mt-4 md:mt-10 text-center text-neutral-400 max-w-2xl px-4 leading-relaxed"
        >
          <p>
            Wykreuj profesjonalną wizytówkę w sieci dzięki naszym niezrównanym
            rozwiązaniom.
          </p>
          <p className="mt-4">
            <span className="group relative cursor-pointer inline-block">
              <strong className="text-white relative z-10 transition-colors group-hover:text-primary duration-300">
                Zyskaj przewagę w sieci!
              </strong>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </span>
            &nbsp;Sprawdź naszą ofertę już teraz.
          </p>
        </motion.div>

        {/* PRZYCISKI CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 mt-8 w-full justify-center items-center"
        >
          <MagneticButton margin='mx-0' icon={<ArrowRight className="w-4 h-4" />} variant="primary" className="w-fit text-background">
            Rozpocznij Projekt 
          </MagneticButton>

          <Link href="#about">
            <MagneticButton margin='mx-0' icon={<MousePointer2 className="w-4 h-4 ml-2 opacity-50" />} variant="outline" className="w-fit">
              Więcej o Nas 
            </MagneticButton>
          </Link>
        </motion.div>
      </motion.div>

      {/* 4. SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scrolluj</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      </motion.div>
   <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
      {/* 1. Podstawa linii (ciemniejsza, nadaje strukturę) */}
      <div className="absolute inset-0 bg-white/5" />

      {/* 2. Animowany promień (The Beam) */}
      <motion.div
        initial={{ x: '-300%' }}
        animate={{ x: '300%' }}
        transition={{
          duration: 3,           // Czas przejścia przez całą szerokość
          repeat: Infinity,      // Nieskończoność
          ease: "linear",
          repeatDelay: 0.5       // Krótka przerwa przed kolejnym impulsem
        }}
        className="absolute inset-y-0 w-1/3 z-10"
        style={{
          background: `linear-gradient(90deg, transparent, var(--color-primary), transparent)`,
        }}
      />

      {/* 3. Dodatkowy efekt "Glow" (rozmycie, które wykracza poza linię) */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.5
        }}
        className="absolute inset-y-0 w-1/4 blur-[4px] z-0 opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, var(--color-primary), transparent)`,
        }}
      />

      {/* 4. Statyczna poświata punktowa na środku (opcjonalnie, dla głębi) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </div>
    </section>
  );
};

export default HeroSection;

// --- POMOCNICZE UTILS (Jeśli nie masz pliku @/lib/utils) ---
// Jeśli masz plik utils.ts w projekcie, usuń ten fragment i zaimportuj 'cn' normalnie.
/*
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
*/