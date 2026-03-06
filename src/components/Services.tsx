import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionValue, type MotionValue } from 'framer-motion';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

// --- Assets & Styles Injection ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    
    :root {
      --font-sans: 'Inter', sans-serif;
      --font-serif: 'Playfair Display', serif;
    }

    body {
      background-color: #050505; /* Un negro ligeramente más cálido/profundo */
      color: #F5F5F0; /* Blanco roto, menos agresivo a la vista */
      margin: 0;
      font-family: var(--font-sans);
      overflow-x: hidden;
      width: 100%;
      cursor: none; 
    }
    
    .font-serif { font-family: var(--font-serif); }
    .font-sans { font-family: var(--font-sans); }
    
    /* Elegant thin lines */
    .hairline { height: 1px; background-color: rgba(255,255,255,0.15); width: 100%; }
  `}</style>
);

// --- Custom Cursor (Minimalist Dot) ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 rounded-full bg-white mix-blend-difference"
      style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
    />
  );
};

// --- Utils ---
const useScrollSkew = (scroll: MotionValue<number>) => {
  const velocity = useVelocity(scroll);
  return useSpring(useTransform(velocity, [-2, 2], [2, -2]), { stiffness: 400, damping: 30 });
};

const MaskedText = ({
  children,
  progress,
  range,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode,
  progress: MotionValue<number>,
  range: [number, number],
  delay?: number,
  className?: string
}) => {
  const [start, end] = range;
  const sectionDuration = end - start;
  const startAdjusted = start + (sectionDuration * delay);
  const endAdjusted = startAdjusted + (sectionDuration * 0.25);

  const y = useTransform(progress, [startAdjusted, endAdjusted], ['100%', '0%'], { clamp: true });
  const opacity = useTransform(progress, [startAdjusted, startAdjusted + (sectionDuration * 0.1)], [0, 1], { clamp: true });

  return (
    <span className={`overflow-hidden block ${className}`}>
      <motion.span style={{ y, opacity }} className="block origin-top-left">
        {children}
      </motion.span>
    </span>
  );
};

// --- Layout Components ---

// LEVEL 1: ESTRATEGIA (Intro)
// Estilo: Portada de revista minimalista.
const CanonLevel1_Intro = ({ progress, range, skew }: { progress: MotionValue<number>, range: [number, number], skew: MotionValue<number> }) => {
  // FIX: Start opacity at 1 so it's visible immediately upon arrival
  const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [1, 1, 1, 0]);
  const yText = useTransform(progress, range, ['0%', '-20%']);

  return (
    <motion.article style={{ opacity }} className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-8 md:px-20 z-20">
      {/* Elegant Header */}
      <div className="absolute top-12 left-0 w-full px-8 md:px-12 flex justify-between items-center opacity-60">
        <span className="font-sans text-xs tracking-[0.2em] uppercase">Private Wealth</span>
        <span className="font-sans text-xs tracking-[0.2em] uppercase">Est. 2026</span>
      </div>

      <motion.div style={{ y: yText, skewY: skew }} className="text-center z-10 w-full max-w-5xl">
        <h1
          className="font-serif text-white tracking-tight leading-[1] md:leading-[0.95]"
          style={{ fontSize: "clamp(2.5rem, 12vw, 9rem)" }}
        >
          <MaskedText progress={progress} range={range} delay={0.0}>
            <span className="italic font-light opacity-80 block md:inline">Diseño de</span>
          </MaskedText>
          <MaskedText progress={progress} range={range} delay={0.05}>
            Estrategia Personal
          </MaskedText>
        </h1>

        <div className="mt-12 flex flex-col items-center">
          <div className="w-[1px] h-16 bg-white/20 mb-8" />
          <MaskedText progress={progress} range={range} delay={0.15}>
            <p className="font-sans text-sm md:text-base text-white/70 max-w-md leading-relaxed tracking-wide">
              Más allá de la gestión de activos. <br />
              Arquitectura financiera para la vida que quieres vivir.
            </p>
          </MaskedText>
        </div>
      </motion.div>
    </motion.article>
  );
};

// LEVEL 2: INVERSIONES (Editorial Spread)
// Estilo: Limpio, imagen grande, tipografía sofisticada a la izquierda.
const CanonLevel2_Investments = ({ progress, range, skew }: { progress: MotionValue<number>, range: [number, number], skew: MotionValue<number> }) => {
  const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [0, 1, 1, 0]);

  return (
    <motion.article style={{ opacity }} className="absolute inset-0 flex items-center pointer-events-none">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">

        {/* Left: Text Content */}
        <div className="flex flex-col justify-center px-4 sm:px-8 md:pl-24 md:pr-12 bg-[#050505]/90 md:bg-[#050505] z-10 h-full">
          <motion.div style={{ skewY: skew }}>
            <span className="font-sans text-[10px] md:text-xs text-stone-400 tracking-[0.2em] uppercase mb-4 md:mb-6 block">01 — Crecimiento</span>

            <h2
              className="font-serif text-white mb-6 md:mb-10 leading-[1] md:leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)" }}
            >
              <MaskedText progress={progress} range={range} delay={0.0}>
                Inteligencia <br className="hidden sm:block" /> <span className="italic text-stone-300">Indexada</span>
              </MaskedText>
            </h2>

            <div className="space-y-8">
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-serif text-lg text-white mb-2">Exposición Global</h3>
                <p className="font-sans text-sm text-white/60 leading-relaxed max-w-sm">
                  Acceso eficiente a los mercados más sólidos del mundo. Sin especulación, con disciplina institucional.
                </p>
              </div>
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-serif text-lg text-white mb-2">Claridad Absoluta</h3>
                <p className="font-sans text-sm text-white/60 leading-relaxed max-w-sm">
                  Reportes transparentes. Entenderás cada movimiento y el valor real que generamos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Image Asset */}
        <motion.div
          style={{
            clipPath: useTransform(progress, [range[0], range[0] + 0.2], ['inset(10% 10% 10% 10%)', 'inset(0 0 0 0)']),
            scale: useTransform(progress, range, [1.1, 1])
          }}
          className="relative h-full w-full overflow-hidden hidden md:block"
        >
          <img
            src="https://ik.imagekit.io/jsaisu64x/A_vertical_architectural_2k_202602051906.jpeg"
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[30%]"
            alt="Investment Architecture"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505]/80" />
        </motion.div>

      </div>
    </motion.article>
  );
};

// LEVEL 3: SEGURIDAD (The New Elegant Layout)
// Estilo: Abierto, etéreo, tipografía central. Nada de cajas ni bordes de hacker.
const CanonLevel3_Security = ({ progress, range, skew }: { progress: MotionValue<number>, range: [number, number], skew: MotionValue<number> }) => {
  const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [0, 1, 1, 0]);

  return (
    <motion.article style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">

      {/* Background Texture/Image (Very subtle) */}
      <motion.div
        style={{
          opacity: useTransform(progress, [range[0], range[0] + 0.2], [0, 0.2]),
          scale: useTransform(progress, range, [1.2, 1])
        }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://ik.imagekit.io/jsaisu64x/A_closeup_interior_2k_202602051907.jpeg"
          className="w-full h-full object-cover grayscale"
          alt="Interior Detail"
        />
      </motion.div>

      {/* Main Content - Centered & Clean */}
      <motion.div style={{ skewY: skew }} className="z-10 text-center max-w-4xl w-full px-4 md:px-0">
        <span className="font-sans text-[10px] md:text-xs text-stone-400 tracking-[0.2em] uppercase mb-6 md:mb-8 block">02 — Preservación</span>

        <h2
          className="font-serif text-white mb-10 md:mb-16 leading-[1] md:leading-[0.9]"
          style={{ fontSize: "clamp(3rem, 15vw, 7rem)" }}
        >
          <MaskedText progress={progress} range={range} delay={0.0}>
            Patrimonio
          </MaskedText>
          <MaskedText progress={progress} range={range} delay={0.05}>
            <span className="italic text-stone-300">Blindado</span>
          </MaskedText>
        </h2>

        {/* The 3 Pillars - No Boxes, Just Elegant Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-white/10 pt-10 text-left md:text-center">
          <motion.div
            style={{ opacity: useTransform(progress, [range[0] + 0.1, range[0] + 0.2], [0, 1]), y: useTransform(progress, [range[0] + 0.1, range[0] + 0.2], [20, 0]) }}
          >
            <h4 className="font-serif text-xl text-white mb-3 italic">Orden</h4>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Saneamiento de pasivos y estructura clara. La paz mental comienza con el orden.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(progress, [range[0] + 0.15, range[0] + 0.25], [0, 1]), y: useTransform(progress, [range[0] + 0.15, range[0] + 0.25], [20, 0]) }}
          >
            <h4 className="font-serif text-xl text-white mb-3 italic">Solidez</h4>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Reservas estratégicas de liquidez. Tu estilo de vida, protegido ante cualquier eventualidad.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(progress, [range[0] + 0.2, range[0] + 0.3], [0, 1]), y: useTransform(progress, [range[0] + 0.2, range[0] + 0.3], [20, 0]) }}
          >
            <h4 className="font-serif text-xl text-white mb-3 italic">Estructura</h4>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Ingeniería legal y fiscal para blindar el legado que has construido.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  );
};

// LEVEL 4: LEGADO (Landscape)
// Estilo: Inspiracional, cierre fuerte, layout asimétrico editorial.
const CanonLevel4_Legacy = ({ progress, range, skew }: { progress: MotionValue<number>, range: [number, number], skew: MotionValue<number> }) => {
  const opacity = useTransform(progress, [range[0], range[0] + 0.1], [0, 1]);

  return (
    <motion.article style={{ opacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">

      {/* Background Image - Full width with gradient fade */}
      <motion.div
        style={{
          scale: useTransform(progress, range, [1.1, 1]),
          opacity: useTransform(progress, [range[0], range[0] + 0.2], [0, 0.4])
        }}
        className="absolute inset-0 w-full h-full overflow-hidden z-0"
      >
        <img
          src="https://ik.imagekit.io/jsaisu64x/A_wide_panoramic_2k_202602051902.jpeg"
          className="w-full h-full object-cover grayscale mix-blend-overlay opacity-60"
          alt="Panoramic Landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
      </motion.div>

      {/* Content - Asymmetric Layout */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 w-full h-full flex flex-col md:flex-row items-center justify-between">

        {/* Left: Massive Headline */}
        <motion.div style={{ skewY: skew }} className="w-full md:w-1/2 flex flex-col justify-center h-1/2 md:h-full pt-16 md:pt-0">
          <span className="font-sans text-[10px] md:text-xs text-stone-500 tracking-[0.3em] uppercase mb-4 md:mb-8 block ml-2">03 — Futuro</span>
          <h2
            className="font-serif text-white tracking-tight leading-[0.8] md:leading-[0.85]"
            style={{ fontSize: "clamp(4rem, 20vw, 11rem)" }}
          >
            <MaskedText progress={progress} range={range} delay={0.0}>
              Legado
            </MaskedText>
            <MaskedText progress={progress} range={range} delay={0.05} className="mt-[-2vw]">
              <span className="font-light text-white/40">&</span>
            </MaskedText>
            <MaskedText progress={progress} range={range} delay={0.1}>
              <span className="italic text-white">Libertad</span>
            </MaskedText>
          </h2>
        </motion.div>

        {/* Right: Editorial Text Block */}
        <motion.div
          style={{
            opacity: useTransform(progress, [range[0] + 0.04, range[0] + 0.10], [0, 1]),
            x: typeof window !== 'undefined' && window.innerWidth >= 768
              ? useTransform(progress, [range[0] + 0.04, range[0] + 0.10], [50, 0])
              : useTransform(progress, [range[0] + 0.04, range[0] + 0.10], [0, 0])
          }}
          className="w-full md:w-[35%] flex flex-col justify-start md:justify-center h-1/2 md:h-full pb-16 md:pb-0 md:pr-12"
        >
          <div className="space-y-6 md:space-y-8 border-l border-white/10 pl-6 md:pl-12 py-2 md:py-4">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white/90 leading-tight">
              "La verdadera riqueza no es solo lo que acumulas, sino la libertad que diseñas."
            </p>
            <p className="font-sans text-xs sm:text-sm md:text-base text-white/60 leading-relaxed max-w-sm">
              Acceso privilegiado a instituciones globales como J.P. Morgan y BlackRock. Un plan a 10 años estructurado no solo para crecer, sino para perdurar.
            </p>

            <div className="pt-2 md:pt-4">
              <span className="font-sans text-[10px] md:text-xs tracking-widest text-white/40 uppercase border-b border-white/20 pb-1">
                Estrategia 2026-2036
              </span>
            </div>

            <div className="pt-10 md:pt-14 pointer-events-auto">
              <MagneticCTA text="Planificar Tu Futuro" className="-ml-4 lg:-ml-8" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
};

// --- Main Scroll Component ---

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Physics: Luxuriously heavy
  const smoothScroll = useSpring(scrollYProgress, {
    damping: 80,    // Increased from 50
    stiffness: 80,  // Decreased from 100
    mass: 3.5,      // Increased from 1.2 greatly for weight
    restDelta: 0.001
  });

  const skew = useScrollSkew(smoothScroll);

  const ranges = {
    level1: [-0.1, 0.25] as [number, number], // Start earlier to be visible initially
    level2: [0.20, 0.55] as [number, number],
    level3: [0.50, 0.85] as [number, number],
    level4: [0.80, 1.0] as [number, number],
  };

  return (
    <div ref={containerRef} className="relative w-full bg-[#050505] z-10" style={{ height: '550vh' }}>
      <FontStyles />
      <CustomCursor />

      {/* Organic Noise Texture (Subtle Grain) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Sticky Viewport */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">

        {/* Background Atmosphere */}
        <motion.div
          style={{ opacity: useTransform(smoothScroll, [0, 0.2], [0.4, 0]) }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
          <video
            className="h-full w-full object-cover grayscale opacity-40"
            autoPlay loop muted playsInline
            src="https://ik.imagekit.io/jsaisu64x/WhatsApp%20Video%202026-02-04%20at%207.19.52%20PM%20(1).mp4?updatedAt=1770325999155"
          />
        </motion.div>

        {/* Levels */}
        <CanonLevel1_Intro progress={smoothScroll} range={ranges.level1} skew={skew} />
        <CanonLevel2_Investments progress={smoothScroll} range={ranges.level2} skew={skew} />
        <CanonLevel3_Security progress={smoothScroll} range={ranges.level3} skew={skew} />
        <CanonLevel4_Legacy progress={smoothScroll} range={ranges.level4} skew={skew} />

        {/* Minimalist Progress Indicator */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-white/20"
              animate={{
                scale: 1,
                backgroundColor: "rgba(255,255,255,0.2)"
              }}
              style={{
                opacity: useTransform(smoothScroll, [i * 0.25, i * 0.25 + 0.1], [0.5, 1]),
                scale: useTransform(smoothScroll, [i * 0.25, (i + 1) * 0.25], [1.5, 1])
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;