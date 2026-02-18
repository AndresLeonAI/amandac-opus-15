import { useRef, useCallback } from 'react';
import { Search, Target, Users, type LucideIcon } from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  type MotionValue,
  type Variants,
} from 'framer-motion';

/* ═══════════════════════════════════════════════
   Constants & Curves
   ═══════════════════════════════════════════════ */
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SILK: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/* Noise — cinemática grain */
const NOISE_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/>
    <feColorMatrix type='saturate' values='0'/>
  </filter>
  <rect width='300' height='300' filter='url(#n)' opacity='1'/>
</svg>`;
const noiseDataUri = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

/* Typography tokens */
const GRADIENT_TEXT =
  'bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent';
const GRADIENT_TEXT_MUTED =
  'bg-gradient-to-b from-white/80 via-white/60 to-white/40 bg-clip-text text-transparent';

/* ═══════════════════════════════════════════════
   DATA — 3 editorial steps
   ═══════════════════════════════════════════════ */
const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Diagnóstico',
    subtitle:
      'Análisis profundo de su situación actual y objetivos específicos',
    spec: '[ PHASE.01 — AUDIT ]',
    atmosphere: {
      primary: 'radial-gradient(ellipse 80% 70% at 30% 40%, hsl(225 80% 20% / 0.5), transparent 70%)',
      secondary: 'radial-gradient(ellipse 60% 50% at 70% 60%, hsl(240 60% 15% / 0.3), transparent 60%)',
      accent: 'radial-gradient(ellipse 40% 40% at 50% 30%, hsl(220 100% 50% / 0.06), transparent 50%)',
    },
    userActions: [
      'Comparte su situación financiera actual',
      'Define objetivos claros y plazos',
      'Expresa preferencias de riesgo',
    ],
    ourActions: [
      'Auditamos su cartera existente',
      'Identificamos gaps y oportunidades',
      'Diseñamos estrategia personalizada',
    ],
  },
  {
    number: '02',
    icon: Target,
    title: 'Estrategia',
    subtitle:
      'Desarrollo de plan de acción adaptado a su perfil y metas',
    spec: '[ PHASE.02 — STRATEGY ]',
    atmosphere: {
      primary: 'radial-gradient(ellipse 70% 60% at 60% 35%, hsl(210 70% 18% / 0.5), transparent 65%)',
      secondary: 'radial-gradient(ellipse 50% 50% at 30% 70%, hsl(195 60% 15% / 0.35), transparent 55%)',
      accent: 'radial-gradient(ellipse 45% 35% at 55% 40%, hsl(200 100% 45% / 0.05), transparent 45%)',
    },
    userActions: [
      'Revisa la propuesta estratégica',
      'Pregunta y ajusta detalles',
      'Aprueba el plan de implementación',
    ],
    ourActions: [
      'Estructuramos la cartera objetivo',
      'Seleccionamos instrumentos óptimos',
      'Establecemos cronograma de ejecución',
    ],
  },
  {
    number: '03',
    icon: Users,
    title: 'Acompañamiento',
    subtitle:
      'Implementación y seguimiento continuo de resultados',
    spec: '[ PHASE.03 — CONTINUUM ]',
    atmosphere: {
      primary: 'radial-gradient(ellipse 75% 65% at 50% 45%, hsl(215 60% 16% / 0.45), transparent 65%)',
      secondary: 'radial-gradient(ellipse 55% 45% at 25% 55%, hsl(30 40% 20% / 0.15), transparent 50%)',
      accent: 'radial-gradient(ellipse 35% 30% at 70% 30%, hsl(35 80% 50% / 0.04), transparent 40%)',
    },
    userActions: [
      'Recibe reportes periódicos',
      'Participa en revisiones trimestrales',
      'Comunica cambios en objetivos',
    ],
    ourActions: [
      'Ejecutamos la estrategia acordada',
      'Monitoreamos y rebalanceamos',
      'Adaptamos según condiciones de mercado',
    ],
  },
] as const;

type StepData = (typeof steps)[number];

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════ */
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EXPO_OUT, delay: 0.2 },
  },
};

const cardSlideVariants = (fromLeft: boolean): Variants => ({
  hidden: {
    opacity: 0,
    x: fromLeft ? -60 : 60,
    filter: 'blur(10px)',
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

const listStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: SILK },
  },
};

/* ═══════════════════════════════════════════════
   MaskReveal — "Persiana" blind-up reveal
   ═══════════════════════════════════════════════ */
const MaskReveal = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      variants={{
        hidden: { y: '110%' },
        visible: {
          y: '0%',
          transition: { duration: 1, delay, ease: [0.33, 1, 0.68, 1] },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  </div>
);

/* ═══════════════════════════════════════════════
   SpotlightCard — frosted glass + mouse tracking
   ═══════════════════════════════════════════════ */
const SpotlightCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const spotX = useMotionValue(0.5);
  const spotY = useMotionValue(0.5);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      spotX.set((e.clientX - rect.left) / rect.width);
      spotY.set((e.clientY - rect.top) / rect.height);
    },
    [spotX, spotY],
  );

  const handleLeave = useCallback(() => {
    spotX.set(0.5);
    spotY.set(0.5);
  }, [spotX, spotY]);

  const spotlightBg = useTransform<number, string>(
    [spotX, spotY],
    ([x, y]: number[]) =>
      `radial-gradient(500px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.06), transparent 55%)`,
  );

  const borderGlow = useTransform<number, string>(
    [spotX, spotY],
    ([x, y]: number[]) =>
      `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 40%, transparent 70%)`,
  );

  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      {/* Border glow layer */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none z-0
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: borderGlow }}
      />

      {/* Card body */}
      <div
        className="relative z-10 rounded-2xl overflow-hidden
          bg-white/[0.02] backdrop-blur-xl
          border border-white/[0.06]
          group-hover:border-white/[0.1]
          transition-[border-color] duration-500"
      >
        {/* Spotlight follow */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-2xl
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{
            backgroundImage: noiseDataUri,
            backgroundRepeat: 'repeat',
            opacity: 0.025,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Content */}
        <div className="relative z-30">{children}</div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   TimelineNode — pulsing icon on the spine
   ═══════════════════════════════════════════════ */
const TimelineNode = ({
  icon: Icon,
  isActive,
}: {
  icon: LucideIcon;
  isActive: boolean;
}) => (
  <div className="relative flex items-center justify-center">
    {/* Ripple */}
    <motion.div
      className="absolute inset-[-4px] rounded-full border border-white/20"
      initial={false}
      animate={
        isActive
          ? { scale: [1, 2.4, 2.8], opacity: [0.4, 0.1, 0] }
          : { scale: 1, opacity: 0 }
      }
      transition={{
        duration: 1.6,
        repeat: isActive ? Infinity : 0,
        repeatDelay: 2,
        ease: 'easeOut',
      }}
    />

    {/* Outer halo */}
    <motion.div
      className="absolute inset-[-8px] rounded-full pointer-events-none"
      animate={
        isActive
          ? {
            boxShadow: [
              '0 0 0px 0px rgba(255,255,255,0)',
              '0 0 24px 6px rgba(255,255,255,0.15)',
              '0 0 12px 3px rgba(255,255,255,0.08)',
            ],
          }
          : { boxShadow: '0 0 0px 0px rgba(255,255,255,0)' }
      }
      transition={{
        duration: 2.4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    />

    {/* Node body */}
    <motion.div
      className={`
        relative w-11 h-11 rounded-full flex items-center justify-center
        border backdrop-blur-md transition-colors duration-600
        ${isActive
          ? 'bg-white/[0.08] border-white/20'
          : 'bg-slate-900/80 border-white/[0.06]'
        }
      `}
      animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon
        className={`w-[18px] h-[18px] transition-colors duration-500
                    ${isActive ? 'text-white/70' : 'text-white/20'}`}
        strokeWidth={1.2}
      />
    </motion.div>
  </div>
);

/* ═══════════════════════════════════════════════
   EcosystemCard — Client | Team split
   ═══════════════════════════════════════════════ */
const EcosystemCard = ({
  step,
  fromLeft,
}: {
  step: StepData;
  fromLeft: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      className="relative will-change-transform"
      variants={cardSlideVariants(fromLeft)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <SpotlightCard>
        <div className="p-8 lg:p-10 relative">
          {/* Watermark number */}
          <span
            className="absolute -top-8 -right-3 font-luxury text-[10rem] lg:text-[12rem] leading-none
                        select-none pointer-events-none"
            style={{
              color: 'rgba(255,255,255,0.02)',
              mixBlendMode: 'overlay',
            }}
            aria-hidden="true"
          >
            {step.number}
          </span>

          {/* Two-column split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 relative">

            {/* Client */}
            <div className="pr-0 sm:pr-8 pb-6 sm:pb-0">
              <h4
                className="font-mono text-[9px] tracking-[0.3em] uppercase
                           text-white/25 mb-5 flex items-center gap-2.5"
              >
                <span className="w-5 h-px bg-white/15" />
                Cliente
              </h4>
              <motion.ul
                className="space-y-3.5"
                variants={listStagger}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {step.userActions.map((action, i) => (
                  <motion.li
                    key={i}
                    variants={listItemVariants}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                    <span className="font-elegant text-[13px] leading-relaxed bg-gradient-to-b from-white/80 to-white/50 bg-clip-text text-transparent">
                      {action}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Vertical divider */}
            <div
              className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px
                          bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"
              aria-hidden="true"
            />

            {/* Team */}
            <div className="pl-0 sm:pl-8 pt-6 sm:pt-0 border-t sm:border-t-0 border-white/[0.03]">
              <h4
                className="font-mono text-[9px] tracking-[0.3em] uppercase
                           text-white/25 mb-5 flex items-center gap-2.5"
              >
                <span className="w-5 h-px bg-white/10" />
                Nosotros
              </h4>
              <motion.ul
                className="space-y-3.5"
                variants={listStagger}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {step.ourActions.map((action, i) => (
                  <motion.li
                    key={i}
                    variants={listItemVariants}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-white/10 flex-shrink-0" />
                    <span className="font-elegant text-[13px] leading-relaxed bg-gradient-to-b from-white/60 to-white/35 bg-clip-text text-transparent">
                      {action}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* Bottom accent */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px
                        bg-gradient-to-r from-transparent via-white/10 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            aria-hidden="true"
          />
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   ProcessPanel — Full-viewport sticky editorial panel
   ═══════════════════════════════════════════════ */
const ProcessPanel = ({
  step,
  index,
  totalSteps,
  scrollProgress,
}: {
  step: StepData;
  index: number;
  totalSteps: number;
  scrollProgress: MotionValue<number>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-35% 0px -35% 0px' });
  const isEven = index % 2 === 0;

  /* Per-panel scroll ranges */
  const panelStart = index / totalSteps;
  const panelEnd = (index + 1) / totalSteps;

  /* Panel content opacity — fades in/out per range */
  const contentOpacity = useTransform(
    scrollProgress,
    [
      Math.max(0, panelStart - 0.05),
      panelStart + 0.02,
      panelEnd - 0.05,
      Math.min(1, panelEnd),
    ],
    [0, 1, 1, index === totalSteps - 1 ? 1 : 0],
  );

  /* Subtle vertical parallax for the title text */
  const titleY = useTransform(
    scrollProgress,
    [panelStart, panelEnd],
    [30, -20],
  );

  return (
    <div
      ref={ref}
      style={{ height: `${100 / totalSteps * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport panel */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* ── Atmospheric gradient background (unique per step) ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: contentOpacity }}
        >
          <div
            className="absolute inset-0"
            style={{ background: step.atmosphere.primary }}
          />
          <div
            className="absolute inset-0"
            style={{ background: step.atmosphere.secondary }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ background: step.atmosphere.accent }}
          />
        </motion.div>

        {/* ── Content container ── */}
        <motion.div
          className="container mx-auto px-6 relative z-10 max-w-7xl"
          style={{ opacity: contentOpacity }}
        >
          {/* ── Top: Giant editorial title area ── */}
          <div className="mb-16 lg:mb-20">
            {/* Spec label */}
            <motion.span
              className="block font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-6"
              variants={subtitleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {step.spec}
            </motion.span>

            {/* Giant step number + title lockup */}
            <div className="relative">
              {/* Massive watermark number — background */}
              <motion.span
                className="absolute -top-16 lg:-top-28 -left-4 lg:-left-8 font-luxury
                           text-[8rem] md:text-[12rem] lg:text-[18rem] leading-none
                           select-none pointer-events-none"
                style={{
                  color: 'rgba(255,255,255,0.018)',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: SILK }}
                aria-hidden="true"
              >
                {step.number}
              </motion.span>

              {/* Title — enormous serif with gradient lighting */}
              <motion.div style={{ y: titleY }} className="relative z-10">
                <MaskReveal>
                  <h3
                    className={`font-luxury text-5xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem]
                                leading-[0.95] tracking-[-0.02em] ${GRADIENT_TEXT}`}
                  >
                    {step.title}
                  </h3>
                </MaskReveal>

                {/* Subtitle */}
                <motion.p
                  className={`font-elegant text-base lg:text-lg leading-relaxed max-w-lg mt-5 lg:mt-7 ${GRADIENT_TEXT_MUTED}`}
                  variants={subtitleVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {step.subtitle}
                </motion.p>

                {/* Decorative line */}
                <motion.div
                  className="w-16 h-px mt-7"
                  style={{
                    background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)',
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: SILK }}
                />
              </motion.div>
            </div>
          </div>

          {/* ── Bottom: Two ecosystem cards side by side ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <EcosystemCard step={step} fromLeft={true} />
            {/* Right card gets slight delay by being a separate InView trigger */}
            <div className="lg:mt-8">
              {/* Phase indicator between cards on mobile */}
              <div className="flex items-center justify-center lg:hidden mb-6">
                <TimelineNode icon={step.icon} isActive={isInView} />
              </div>
              {/* Second card mirrors the first with opposite slide direction */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, ease: EXPO_OUT, delay: 0.15 }}
              >
                <SpotlightCard>
                  <div className="p-8 lg:p-10 relative">
                    {/* CTA-style summary */}
                    <h4 className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 mb-5 flex items-center gap-2.5">
                      <span className="w-5 h-px bg-white/10" />
                      Resultado
                    </h4>
                    <p className={`font-luxury text-2xl lg:text-3xl leading-[1.2] tracking-[-0.01em] ${GRADIENT_TEXT} mb-4`}>
                      {step.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-6">
                      <TimelineNode icon={step.icon} isActive={isInView} />
                      <span className="font-elegant text-xs uppercase tracking-[0.25em] text-white/25">
                        {step.spec}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PROCESS — Root "The Luminous Path"
   ═══════════════════════════════════════════════ */
const Process = () => {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* Spring-smoothed progress */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 1,
  });

  /* Spine metrics */
  const spineScaleY = useTransform(smoothProgress, [0, 1], [0, 1]);
  const emitterTop = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const spineOpacity = useTransform(smoothProgress, [0, 0.02], [0, 1]);

  return (
    <section
      ref={containerRef}
      id="proceso-meticuloso"
      className="relative overflow-hidden bg-transparent"
    >
      {/* ── Noise grain (scoped to section) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: noiseDataUri,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.02,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />

      {/* ── Section Header — first viewport ── */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 45%, hsl(220 60% 12% / 0.4), transparent 65%),
              radial-gradient(ellipse 40% 40% at 30% 30%, hsl(225 80% 20% / 0.2), transparent 50%)
            `,
          }}
        />

        <div className="text-center relative z-10 px-6">
          {/* Micro-label */}
          <motion.span
            className="inline-block font-mono text-[10px] tracking-[0.45em] uppercase
                        text-white/20 mb-8"
            initial={{ opacity: 0, letterSpacing: '0.7em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.45em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.1 }}
          >
            — Metodología —
          </motion.span>

          {/* Enormous serif title */}
          <MaskReveal className="mb-3">
            <h2
              className={`font-luxury text-5xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem]
                          leading-[0.92] tracking-[-0.03em] ${GRADIENT_TEXT}`}
            >
              Proceso
            </h2>
          </MaskReveal>
          <MaskReveal delay={0.1} className="mb-8">
            <h2
              className={`font-luxury text-5xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem]
                          leading-[0.92] tracking-[-0.03em] italic ${GRADIENT_TEXT}`}
              style={{ fontStyle: 'italic' }}
            >
              Meticuloso
            </h2>
          </MaskReveal>

          {/* Subtitle */}
          <motion.p
            className={`font-elegant text-base lg:text-lg max-w-xl mx-auto leading-[1.8] ${GRADIENT_TEXT_MUTED}`}
            variants={subtitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Cada decisión financiera requiere precisión quirúrgica.
            <br className="hidden sm:block" />
            Nuestro método garantiza resultados excepcionales.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="w-16 h-px mx-auto mt-10"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: SILK }}
          />

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-white/15">
              Scroll
            </span>
            <motion.div
              className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
              animate={{ scaleY: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top' }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Timeline spine (desktop only) ── */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 left-8 xl:left-12 w-px z-[2] pointer-events-none"
        aria-hidden="true"
      >
        {/* Track */}
        <div className="absolute inset-0 bg-white/[0.03]" />

        {/* Laser beam */}
        <motion.div
          className="absolute top-0 left-0 w-full origin-top will-change-transform"
          style={{
            scaleY: spineScaleY,
            opacity: spineOpacity,
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1) 50%, transparent)',
          }}
        />

        {/* Emitter dot */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 will-change-transform"
          style={{ top: emitterTop }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 relative">
            <div className="absolute -inset-1 rounded-full bg-white/30 blur-[3px]" />
            <div className="absolute -inset-3 rounded-full bg-white/10 blur-md" />
          </div>
        </motion.div>
      </div>

      {/* ── Scrollytelling panels ── */}
      <div className="relative">
        {steps.map((step, index) => (
          <ProcessPanel
            key={step.number}
            step={step}
            index={index}
            totalSteps={steps.length}
            scrollProgress={smoothProgress}
          />
        ))}
      </div>

      {/* Terminal mark */}
      <div className="relative h-32 flex items-center justify-center">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-white/10 border border-white/[0.06]"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default Process;