import { useRef, useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  useSpring,
  animate,
  type MotionValue,
} from 'framer-motion';

/* ═══════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════ */
const SILK: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ═══════════════════════════════════════════════
   useMediaQuery — clean responsive hook (SSR-safe)
   ═══════════════════════════════════════════════ */
const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    [query]
  );
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

/* ═══════════════════════════════════════════════
   Noise — cinemática grain via inline SVG
   ═══════════════════════════════════════════════ */
const NOISE_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <filter id='n' x='0' y='0'>
    <feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/>
    <feColorMatrix type='saturate' values='0'/>
  </filter>
  <rect width='300' height='300' filter='url(#n)' opacity='1'/>
</svg>`;
const noiseDataUri = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

/* ═══════════════════════════════════════════════
   AnimatedCounter
   ═══════════════════════════════════════════════ */
const AnimatedCounter = ({
  target,
  suffix = '',
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, target, {
      duration,
      ease: SILK,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target, duration, motionVal]);

  return (
    <span ref={ref} className="font-luxury text-5xl md:text-7xl tabular-nums not-italic bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
      {display}
      {suffix && <span className="text-primary">{suffix}</span>}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   TitleReveal — clip-path "blind" reveal
   ═══════════════════════════════════════════════ */
const TitleReveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      initial={{ y: '110%' }}
      whileInView={{ y: '0%' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EXPO_OUT }}
    >
      {children}
    </motion.div>
  </div>
);

/* ═══════════════════════════════════════════════
   WordStagger — elegant per-word reveal
   ═══════════════════════════════════════════════ */
const WordStagger = ({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) => {
  const words = text.split(' ');
  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.025 } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: { duration: 0.5, ease: EXPO_OUT },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
};

/* ═══════════════════════════════════════════════
   SpotlightCard — frosted glass + mouse light
   ═══════════════════════════════════════════════ */
const SpotlightCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotX = useMotionValue(0.5);
  const spotY = useMotionValue(0.5);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      spotX.set((e.clientX - rect.left) / rect.width);
      spotY.set((e.clientY - rect.top) / rect.height);
    },
    [spotX, spotY]
  );

  const handleLeave = useCallback(() => {
    spotX.set(0.5);
    spotY.set(0.5);
  }, [spotX, spotY]);

  /* Build the radial gradient string reactively */
  const spotlightBg = useTransform<number, string>(
    [spotX, spotY],
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.07), transparent 60%)`
  );

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{
        y: -5,
        borderColor: 'rgba(255,255,255,0.14)',
        boxShadow:
          '0 24px 80px hsl(220 100% 50% / 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Spotlight layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{ background: spotlightBg }}
      />
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   Narrative Sections data
   ═══════════════════════════════════════════════ */
const SECTIONS = [
  {
    id: 'trayectoria',
    stat: { value: 24, suffix: '+', label: 'Años de Trayectoria' },
    body: 'Amanda Cruz es una asesora financiera con más de 24 años de experiencia, especializada en la planeación de portafolios e inversiones internacionales. Desde Bogotá, y como parte de AXIA, ha acompañado a profesionales, empresarios y familias a transformar la manera en que protegen y hacen crecer su patrimonio.',
  },
  {
    id: 'impacto',
    stat: { value: 150, suffix: '+', label: 'Profesionales y Familias' },
    body: 'A lo largo de su carrera, ha guiado a más de 150 profesionales y familias a fortalecer su patrimonio, mediante estrategias personalizadas que combinan diversificación global, optimización del riesgo y un acompañamiento cercano en cada etapa.',
  },
  {
    id: 'reconocimiento',
    isAward: true,
    body: 'En 2024 fue nombrada "Mejor Asesor Financiero del Año" por United Financial Consultants (UFC), reconocimiento que consolida más de dos décadas de resultados concretos y confianza construida cliente a cliente.',
  },
  {
    id: 'filosofia',
    body: 'Su filosofía es inquebrantable: cada cliente merece un plan financiero diseñado con precisión quirúrgica, visión global y resultados que se traduzcan en seguridad y crecimiento sostenible a largo plazo.',
  },
] as const;

/* Text gradient utility class */
const GRADIENT_TEXT = 'bg-gradient-to-b from-white via-white/90 to-white/65 bg-clip-text text-transparent';

/* ═══════════════════════════════════════════════
   NarrativeBlock — scroll-driven highlighting
   ═══════════════════════════════════════════════ */
const NarrativeBlock = ({
  section,
  progress,
  rangeStart,
  rangeEnd,
}: {
  section: (typeof SECTIONS)[number];
  progress: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
}) => {
  const opacity = useTransform(
    progress,
    [
      Math.max(0, rangeStart - 0.08),
      rangeStart,
      rangeEnd,
      Math.min(1, rangeEnd + 0.08),
    ],
    [0.12, 1, 1, 0.12]
  );
  const scale = useTransform(
    progress,
    [
      Math.max(0, rangeStart - 0.08),
      rangeStart,
      rangeEnd,
      Math.min(1, rangeEnd + 0.08),
    ],
    [0.98, 1.02, 1.02, 0.98]
  );
  const translateX = useTransform(
    progress,
    [
      Math.max(0, rangeStart - 0.08),
      rangeStart,
      rangeEnd,
      Math.min(1, rangeEnd + 0.08),
    ],
    [-6, 0, 0, -6]
  );

  const hasStat = 'stat' in section && section.stat;

  return (
    <motion.div
      style={{ opacity, scale, x: translateX }}
      className="py-10 md:py-16 will-change-transform"
    >
      {/* Stat counter */}
      {hasStat && (
        <div className="mb-6">
          <AnimatedCounter
            target={section.stat.value}
            suffix={section.stat.suffix}
            duration={2.2}
          />
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/30 font-elegant">
            {section.stat.label}
          </p>
        </div>
      )}

      {/* Award glassmorphism card with spotlight */}
      {'isAward' in section && section.isAward ? (
        <SpotlightCard className="px-8 py-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-2xl shadow-2xl">
          {/* Breathing glow orb */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.06, 0.14, 0.06],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(circle, hsl(220 100% 60% / 0.2), transparent 70%)',
            }}
          />
          <p className="relative z-20 text-xs uppercase tracking-[0.3em] text-primary/60 font-elegant mb-3">
            Reconocimiento 2024
          </p>
          <div className="relative z-20">
            <WordStagger
              text={section.body}
              className={`font-elegant text-lg leading-[1.8] ${GRADIENT_TEXT}`}
            />
          </div>
        </SpotlightCard>
      ) : (
        <WordStagger
          text={section.body}
          className={`font-elegant text-lg md:text-xl leading-[1.85] ${GRADIENT_TEXT}`}
        />
      )}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   useMouseParallax — 3D tilt on hover (desktop)
   ═══════════════════════════════════════════════ */
const useMouseParallax = (enabled: boolean) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = (e.clientX - cx) / (rect.width / 2);
      const py = (e.clientY - cy) / (rect.height / 2);
      rotateY.set(px * 4);
      rotateX.set(-py * 3);
    },
    [enabled, rotateX, rotateY]
  );

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { springX, springY, handleMouse, handleLeave };
};

/* ═══════════════════════════════════════════════
   AboutAmanda — Editorial Dark Mode (Final Polish)
   ═══════════════════════════════════════════════ */
const AboutAmanda = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* Progress line fill — direct bind */
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /* Progress DOT — spring-driven for organic inertia */
  const dotProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });
  const dotTop = useTransform(dotProgress, [0, 1], ['0%', '100%']);

  /* Image parallax */
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);

  /* Mouse 3D tilt — only on desktop */
  const { springX, springY, handleMouse, handleLeave } = useMouseParallax(isDesktop);

  /* Section ranges */
  const sectionRanges = SECTIONS.map((_, i) => ({
    start: i * 0.25,
    end: (i + 1) * 0.25,
  }));

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative"
      style={{ minHeight: '300vh' }}
    >
      {/* ── Layer 1: Radial depth background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 40%, hsl(220 100% 50% / 0.07), transparent 70%),
            radial-gradient(ellipse 50% 50% at 20% 80%, hsl(220 80% 40% / 0.05), transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 20%, hsl(210 60% 30% / 0.03), transparent 50%)
          `,
        }}
      />

      {/* ── Layer 2: Noise overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: noiseDataUri,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          mixBlendMode: 'overlay',
          opacity: 0.04,
        }}
      />

      {/* ── Main layout ── */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">

          {/* ── LEFT: Scrolling narrative ── */}
          <div className="order-2 lg:order-1 pt-24 lg:pt-32 pb-24 relative">

            {/* ── Progress line (visual anchor) ── */}
            {isDesktop && (
              <div className="absolute left-0 top-32 bottom-24 w-px">
                {/* Track */}
                <div className="absolute inset-0 bg-white/[0.05] rounded-full" />
                {/* Fill — linear, instant */}
                <motion.div
                  className="absolute top-0 left-0 w-full rounded-full"
                  style={{
                    height: progressHeight,
                    background:
                      'linear-gradient(to bottom, hsl(220 100% 55% / 0.5), hsl(220 100% 65% / 0.15))',
                    boxShadow: '0 0 10px hsl(220 100% 55% / 0.2)',
                  }}
                />
                {/* Glow dot — spring-driven, organic inertia */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full"
                  style={{
                    top: dotTop,
                    background:
                      'radial-gradient(circle, hsl(220 100% 70%) 30%, hsl(220 100% 55%) 100%)',
                    boxShadow: `
                      0 0 8px hsl(220 100% 60% / 0.6),
                      0 0 20px hsl(220 100% 55% / 0.25),
                      0 0 40px hsl(220 100% 55% / 0.1)
                    `,
                  }}
                />
              </div>
            )}

            {/* Content (offset for progress line on desktop) */}
            <div className="lg:pl-8">
              {/* Title — mask reveal with gradient text */}
              <TitleReveal className="mb-1">
                <h2 className={`font-luxury text-4xl md:text-5xl lg:text-6xl leading-[1.08] ${GRADIENT_TEXT}`}>
                  Estrategia Global.
                </h2>
              </TitleReveal>
              <TitleReveal delay={0.12} className="mb-5">
                <h2 className="font-luxury text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.08]">
                  Seguridad Patrimonial.
                </h2>
              </TitleReveal>

              {/* Accent line */}
              <motion.div
                className="w-16 h-px mb-14"
                style={{
                  background:
                    'linear-gradient(to right, hsl(220 100% 55% / 0.6), transparent)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: SILK }}
              />

              {/* Narrative blocks */}
              {SECTIONS.map((section, i) => (
                <NarrativeBlock
                  key={section.id}
                  section={section}
                  progress={scrollYProgress}
                  rangeStart={sectionRanges[i].start}
                  rangeEnd={sectionRanges[i].end}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Sticky image with 3D tilt ── */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start lg:h-fit pt-24 lg:pt-32">
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: SILK }}
              onMouseMove={handleMouse}
              onMouseLeave={handleLeave}
              style={{
                perspective: isDesktop ? 1200 : undefined,
              }}
            >
              {/* 3D tilt wrapper */}
              <motion.div
                className="will-change-transform"
                style={{
                  rotateX: isDesktop ? springX : 0,
                  rotateY: isDesktop ? springY : 0,
                  transformStyle: isDesktop ? 'preserve-3d' : undefined,
                }}
              >
                {/* Image with parallax + fade-reveal on load */}
                <motion.div
                  className="relative will-change-transform"
                  style={{ y: imageY }}
                  initial={{ opacity: 0, scale: 1.06 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: SILK, delay: 0.15 }}
                >
                  <img
                    src="/lovable-uploads/5ce75e4d-ecd2-4490-8c38-8289c7e3a6e9.png"
                    alt="Amanda Cruz, asesora financiera especializada en inversiones internacionales"
                    className="w-full h-auto object-cover rounded-2xl"
                    loading="lazy"
                    style={{
                      maskImage: `
                        radial-gradient(ellipse 120% 90% at 50% 40%, black 50%, transparent 90%),
                        linear-gradient(to bottom, black 55%, transparent 100%)
                      `,
                      WebkitMaskImage: `
                        radial-gradient(ellipse 120% 90% at 50% 40%, black 50%, transparent 90%),
                        linear-gradient(to bottom, black 55%, transparent 100%)
                      `,
                      maskComposite: 'intersect',
                      WebkitMaskComposite: 'source-in' as unknown as string,
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* ── Breathing volumetric glow ── */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.25, 0.45, 0.25],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background:
                    'radial-gradient(ellipse 70% 60% at 50% 35%, hsl(220 100% 55% / 0.2), transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Secondary warm accent glow */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-2xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2,
                }}
                style={{
                  background:
                    'radial-gradient(ellipse 50% 50% at 60% 70%, hsl(200 80% 50% / 0.1), transparent 60%)',
                  filter: 'blur(50px)',
                }}
              />
            </motion.div>

            {/* Name badge */}
            <motion.div
              className="mt-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7, ease: SILK }}
            >
              <p className={`font-luxury text-2xl ${GRADIENT_TEXT}`}>Amanda Cruz</p>
              <p className="text-sm text-white/30 font-elegant tracking-[0.2em] uppercase mt-1">
                Senior Financial Advisor · AXIA
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAmanda;