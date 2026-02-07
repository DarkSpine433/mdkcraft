'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Award,
  Quote,
  Sparkles,
  Star,
  TrendingUp,
  Users
} from 'lucide-react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from 'motion/react'
import React, { useRef } from 'react'

// -----------------------------------------------------------------------------
// DATA
// -----------------------------------------------------------------------------

const OPINIONS = [
  {
    id: "01",
    name: 'Piotr Wójcik',
    role: 'CEO TechFlow',
    text: 'Zespół MDKCraft jest niezwykle profesjonalny. Zaprojektowali dla nas stronę, która przekroczyła oczekiwania. Ich zrozumienie potrzeb biznesowych jest unikalne na rynku.',
    stars: 5,
    img: '/img/clients/client-1.png',
    accent: '#8b5cf6'
  },
  {
    id: "02",
    name: 'Karolina Lewandowska',
    role: 'Marketing Manager',
    text: 'Innowacyjne rozwiązania i pełna elastyczność. Efekt końcowy sprawił, że nasza marka zyskała zupełnie nową, profesjonalną tożsamość online.',
    stars: 5,
    img: '/img/clients/client-3.png',
    accent: '#ffffff'
  },
  {
    id: "03",
    name: 'Michał Kaczmarek',
    role: 'Founder of Pulse',
    text: 'Zdecydowanie najlepszy wybór. Ich podejście do architektury systemów i czystość kodu to standard enterprise, którego szukaliśmy.',
    stars: 4,
    img: '/img/clients/client-2.png',
    accent: '#8b5cf6'
  },
  {
    id: "04",
    name: 'Anna Zielińska',
    role: 'E-commerce Specialist',
    text: 'Współpraca przebiegła błyskawicznie. System sprzedaży zoptymalizował nasze zyski o 40% w pierwszym kwartale. Polecam każdemu!',
    stars: 5,
    img: '/img/clients/client-4.png',
    accent: '#ffffff'
  },
  {
    id: "05",
    name: 'Tomasz Nowak',
    role: 'Software Architect',
    text: 'Doceniam czystość architektury. To nie tylko nowoczesny design, ale przede wszystkim solidny i bezpieczny fundament pod skalowalny biznes.',
    stars: 5,
    img: '/img/clients/client-5.png',
    accent: '#8b5cf6'
  },
  {
    id: "06",
    name: 'Marta Kowalczyk',
    role: 'Art Director',
    text: 'Design, który czuje markę. Zespół MDKCraft od razu uchwycił minimalistyczny vibe premium, na którym mi zależało. Perfekcja w każdym pikselu.',
    stars: 5,
    img: '/img/clients/client-6.png',
    accent: '#ffffff'
  },
  {
    id: "07",
    name: 'Jakub Mazur',
    role: 'CTO FinNet',
    text: 'Szybkość działania i dbałość o detale to wizytówka MDKCraft. Nasza nowa aplikacja bankowa zbiera świetne opinie od użytkowników.',
    stars: 5,
    img: '/img/clients/client-1.png',
    accent: '#8b5cf6'
  },
  {
    id: "08",
    name: 'Patrycja Szymańska',
    role: 'Founder of Bloom',
    text: 'Niesamowita atmosfera współpracy. MDKCraft to partner, który słucha i doradza, a nie tylko wykonuje zlecenia. Efekt zapiera dech.',
    stars: 5,
    img: '/img/clients/client-3.png',
    accent: '#ffffff'
  },
  {
    id: "09",
    name: 'Robert Kłos',
    role: 'Director of Logistics',
    text: 'Optymalizacja procesów przez dedykowane narzędzia stworzone przez MDKCraft skróciła czas operacyjny o połowę. Genialna robota.',
    stars: 5,
    img: '/img/clients/client-2.png',
    accent: '#8b5cf6'
  },
  {
    id: "10",
    name: 'Alicja Bąk',
    role: 'UX Researcher',
    text: 'Z perspektywy UX, MDKCraft dostarcza rozwiązania, które są nie tylko piękne, ale przede wszystkim intuicyjne i dostępne dla każdego.',
    stars: 4,
    img: '/img/clients/client-4.png',
    accent: '#ffffff'
  },
  {
    id: "11",
    name: 'Sebastian Dudek',
    role: 'E-gaming Enthusiast',
    text: 'Portal społecznościowy dla graczy, który zbudowali, wytrzymuje ogromne obciążenia bez najmniejszego laga. To jest ta jakość.',
    stars: 5,
    img: '/img/clients/client-5.png',
    accent: '#8b5cf6'
  },
  {
    id: "12",
    name: 'Magdalena Król',
    role: 'Marketing Lead',
    text: 'Praca z MDKCraft to czysta przyjemność. Profesjonalizm w każdym calu i terminowość, która na tym rynku jest rzadkością.',
    stars: 5,
    img: '/img/clients/client-6.png',
    accent: '#ffffff'
  },
  {
    id: "13",
    name: 'Paweł Wiśniewski',
    role: 'Product Owner',
    text: 'MDKCraft dowozi projekty, które po prostu zarabiają. Nasz ROI wzrósł o 25% w miesiąc po rebrandingu i wdrożeniu nowej strony.',
    stars: 5,
    img: '/img/clients/client-1.png',
    accent: '#8b5cf6'
  },
  {
    id: "14",
    name: 'Natalia Woźniak',
    role: 'Creative Director',
    text: 'Minimalizm z klasą. MDKCraft rozumie estetykę nowoczesnego internetu jak nikt inny. Polecam każdemu domowi mody.',
    stars: 5,
    img: '/img/clients/client-3.png',
    accent: '#ffffff'
  },
];

const METRICS = [
  { label: 'Client Satisfaction', value: '98%', icon: TrendingUp },
  { label: 'Projects Completed', value: '150+', icon: Award },
  { label: 'Active Partnerships', value: '45+', icon: Users },
];

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

const PixelGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pixel-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pixel-pattern)" />
    </svg>
  </div>
);

const FloatingCard = ({ opinion, index }: { opinion: typeof OPINIONS[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [20, -20]));
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-20, 20]));

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [50 * (index % 3 + 1), -50 * (index % 3 + 1)]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ y: translateY, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      initial={{  scale: 0.9 }}
      whileInView={{  scale: 1 }}
    
    
      className="relative group p-8 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/8 hover:border-violet-500/30 transition-all duration-500"
    >
      <Quote className="absolute -top-4 -right-4 size-20 text-white/3 group-hover:text-violet-500/10 transition-colors" />
      
      <div className="relative z-10 space-y-6" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border border-violet-500/30 p-1">
            <AvatarImage src={opinion.img} className="rounded-full object-cover" />
            <AvatarFallback className="bg-violet-500/20">{opinion.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-white font-bold">{opinion.name}</h4>
            <p className="text-violet-400 font-mono text-[10px] uppercase tracking-widest">{opinion.role}</p>
          </div>
        </div>

        <div className="flex gap-1">
          {[...Array(opinion.stars)].map((_, i) => (
            <Star key={i} size={14} className="fill-violet-500 text-violet-500" />
          ))}
        </div>

        <p className="text-slate-400 text-lg leading-relaxed italic">
          &quot;{opinion.text}&quot;
        </p>

        <div className="pt-4 flex items-center gap-2">
          <div className="h-px w-8 bg-violet-500/50" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Verified Client Engagement</span>
        </div>
      </div>
    </motion.div>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

const Opinions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const half = Math.ceil(OPINIONS.length / 2);

  return (
    <section id='testimonials' ref={containerRef} className="relative bg-[#050505] min-h-[350vh] py-[15vh] overflow-hidden border-y border-violet-500/20">
      <PixelGrid />



      <div className="container mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <div className="max-w-4xl mx-auto text-center mb-[20vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-mono tracking-widest uppercase mb-12"
          >
            <Sparkles size={14} className="animate-pulse" />
            Social Proof & Trust
          </motion.div>

          <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-none">
            VOICES OF <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-slate-400 to-white">
              SUCCESS
            </span>
          </h2>

          <div className="h-1 w-40 bg-linear-to-r from-transparent via-violet-500 to-transparent mx-auto mb-12" />

          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Nie budujemy tylko oprogramowania. Budujemy <span className="text-white font-semibold">trwałe fundamenty sukcesu</span> naszych partnerów biznesowych.
          </p>
        </div>

        {/* --- METRICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-[20vh]">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-4xl bg-white/2 border border-white/5 text-center group hover:bg-white/5 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <metric.icon className="text-violet-500" size={32} />
              </div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">{metric.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-[0.3em] font-bold">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* --- OPINIONS WALL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          <div className="space-y-[15vh]">
            {OPINIONS.slice(0, half).map((opinion, i) => (
              <FloatingCard key={opinion.id} opinion={opinion} index={i} />
            ))}
          </div>
          <div className="space-y-[15vh] pt-[15vh]">
            {OPINIONS.slice(half).map((opinion, i) => (
              <FloatingCard key={opinion.id} opinion={opinion} index={i + half} />
            ))}
          </div>
        </div>

  
      </div>

     
    </section>
  );
};

export default Opinions;
