import { useRef, useState, useEffect, type MouseEvent } from 'react';
import { Search, Target, Users, type LucideIcon } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useMotionTemplate,
  cubicBezier,
  type MotionValue,
} from 'framer-motion';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

/* ═══════════════════════════════════════════════════════════════════════════
   EASINGS 
   ═══════════════════════════════════════════════════════════════════════════ */
// High-end cinematic curve
const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);
const SILK = cubicBezier(0.25, 0.46, 0.45, 0.94);

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Diagnóstico',
    subtitle: 'Análisis profundo de su situación actual y objetivos específicos',
    spec: '[ PHASE.01 — AUDIT ]',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
    blurredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&blur=150&q=30',
    imagePosition: 'center 45%',
    userActions: [
      'Comparte su situación financiera actual',
      'Define objetivos claros y plazos',
      'Expresa preferencias de riesgo',
    ],
    ourActions: [
      'Auditamos su cartera existente',
      'Identificamos brechas y oportunidades',
      'Diseñamos estrategia personalizada',
    ],
  },
  {
    number: '02',
    icon: Target,
    title: 'Estrategia',
    subtitle: 'Desarrollo de plan de acción adaptado a su perfil y metas',
    spec: '[ PHASE.02 — STRATEGY ]',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=85',
    blurredImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&blur=150&q=30',
    imagePosition: 'center 40%',
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
    subtitle: 'Implementación y seguimiento continuo de resultados',
    spec: '[ PHASE.03 — CONTINUUM ]',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
    blurredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&blur=150&q=30',
    imagePosition: 'center 52%',
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

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES & MATERIALS 
   ═══════════════════════════════════════════════════════════════════════════ */

const MaskReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      variants={{
        hidden: { y: '112%', rotateX: 10, transformOrigin: 'top center' },
        visible: { y: '0%', rotateX: 0, transition: { duration: 1.05, delay, ease: EXPO_OUT } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-12%' }}
      className="will-change-transform block"
    >
      {children}
    </motion.div>
  </div>
);

const TimelineNode = ({ icon: Icon, isActive }: { icon: LucideIcon; isActive: boolean; }) => (
  <div className="relative flex items-center justify-center">
    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border transition-all duration-700 ${isActive ? 'bg-white/10 border-white/20 scale-100' : 'bg-transparent border-white/5 opacity-50 scale-90'}`}>
      <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-700 ${isActive ? 'text-white' : 'text-white/40'}`} strokeWidth={1.5} />
    </div>
  </div>
);

/** 
 * Obsidian Contour Card: "Luz de Contorno Táctil"
 * A pure black 40% card with a localized magnetic radial light revealing a 1px border.
 */
const ObsidianEcosystemCard = ({ step }: { step: StepData }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const borderMaskOverlay = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, white, transparent 60%)`;

  return (
    <div
      className="relative rounded-[1.25rem] bg-[#00000066] border border-transparent backdrop-blur-none group overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 
        Hover Light Gradient for the border: strictly encapsulated and avoids DOM repaints globally,
        using 1px mask padding technique. No slow filter blurs around edges.
      */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out will-change-transform"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          maskImage: borderMaskOverlay,
        }}
        aria-hidden="true"
      />

      {/* Fallback subtle static border for when not hovering */}
      <div className="absolute inset-0 pointer-events-none rounded-[1.25rem] border border-white/5 z-0" />

      {/* Content wrapper */}
      <div className="p-6 md:p-8 relative z-10 w-full flex flex-col justify-between">
        <div className="flex items-center gap-4 mb-5 md:mb-6">
          <TimelineNode icon={step.icon} isActive />
          <h4 className="font-mono text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/60">
            {step.spec}
          </h4>
        </div>

        <div className="mb-6 md:mb-8">
          <p className="font-luxury text-xl md:text-2xl leading-[1.25] text-white tracking-[-0.01em]">
            {step.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 relative">
          <div className="pr-4">
            <h5 className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-white/40 mb-3 block">Cliente</h5>
            <ul className="space-y-3">
              {step.userActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[6px] md:mt-[7px] w-1.5 h-1.5 bg-white/50 flex-shrink-0 rounded-full" />
                  <span className="font-elegant text-xs md:text-sm text-white/70 leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="pl-0 sm:pl-6 pt-5 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <h5 className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#d9b46b] mb-3 block">Nosotros</h5>
            <ul className="space-y-3">
              {step.ourActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[6px] md:mt-[7px] w-1.5 h-1.5 bg-[#d9b46b]/80 flex-shrink-0 rounded-full" />
                  <span className="font-elegant text-xs md:text-sm text-white/90 leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SPATIAL PANEL (VOLUMETRIC ORCHESTRATOR)
   ═══════════════════════════════════════════════════════════════════════════ */
const SpatialPanel = ({ step, index, totalSteps, scrollProgress, smoothVel }: { step: StepData; index: number; totalSteps: number; scrollProgress: MotionValue<number>; smoothVel: MotionValue<number> }) => {
  // ── 1. Hero Compensation (Scroll Mapping Offset) ──
  // Container logic: 400vh total. Viewport: 100vh. Scroll distance = 300vh.
  const heroOffset = 0.25;
  const usableScroll = 0.75;
  const segLen = usableScroll / totalSteps;

  const panelStart = heroOffset + (index * segLen);
  const panelEnd = panelStart + segLen;

  const isLast = index === totalSteps - 1;

  // ── 2. Strict Dead Zones & Last Panel Immortality ──
  // Fade in takes 25% of the panel's active window. Fade out takes the last 25%.
  const enterEnd = panelStart + (segLen * 0.25);
  const baseExitStart = panelEnd - (segLen * 0.25);
  const baseAbsoluteExit = panelEnd - 0.02;

  // If this is the last panel, we lock its exit transitions far beyond 1.0.
  // This physically locks the panel in its active state (opacity 1, block) forever.
  const exitStart = isLast ? 1.5 : baseExitStart;
  const absoluteExit = isLast ? 1.5 : baseAbsoluteExit;

  // Track if this panel is somewhat inside viewport to toggle will-change and pointer-events
  // Ensure we add the extra buffer so that it catches properly, but derived states will do the heavy lifting
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    return scrollProgress.on('change', (v) => {
      // Tight buffer specifically around our active timeline to reclaim GPU layout
      const buffer = 0.01;
      const isInside = v >= (panelStart - buffer) && v <= (absoluteExit + buffer);
      setIsActive(isInside);
    });
  }, [scrollProgress, panelStart, absoluteExit]);

  // ──────────────────────────────────────────────
  // Z-Space Routing (Túnel Volumétrico) & Opacity
  // ──────────────────────────────────────────────
  const panelAlpha = useTransform(
    scrollProgress,
    [panelStart - 0.001, panelStart, enterEnd, exitStart, absoluteExit, absoluteExit + 0.001],
    [0, 0, 1, 1, 0, 0]
  );

  // Replaces textScale/imgScale with a unified Z-Axis volumetric route
  const tunnelZ = useTransform(
    scrollProgress,
    [panelStart, enterEnd, exitStart, absoluteExit],
    [800, 0, 0, -800] // COMES FROM BEHIND (+800), SINKS INTO SCREEN (-800)
  );

  const textOpacity = panelAlpha;

  // ──────────────────────────────────────────────
  // Optical Compositing (GPU friendly Rack Focus)
  // No realtime blur filters. Instead, fading in a pre-blurred image asset.
  // ──────────────────────────────────────────────
  const blurLayerOpacity = useTransform(
    scrollProgress,
    [exitStart, absoluteExit],
    [0, 1]
  );

  const sharpLayerOpacity = useTransform(
    scrollProgress,
    [exitStart, absoluteExit],
    [1, 0.4]
  );

  const internalImgScale = useTransform(
    scrollProgress,
    [panelStart, enterEnd],
    [1.4, 1]
  );

  const imgClipPath = useTransform(
    scrollProgress,
    [panelStart, enterEnd],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );

  // ──────────────────────────────────────────────
  // 3D Liquid Inertia Rotation based on Velocity
  // ──────────────────────────────────────────────
  const rotateX = useTransform(smoothVel, [-2, 2], [-8, 8]);
  const rotateY = useTransform(smoothVel, [-2, 2], [8, -8]);
  const skewY = useTransform(smoothVel, [-2, 2], [3, -3]);

  // ──────────────────────────────────────────────
  // Kinetic Depth (Fuerza G / Inercia)
  // ──────────────────────────────────────────────
  // Maps absolute extreme velocity to a recessed scale for the whole container
  const kineticScale = useTransform(smoothVel, [-2, 0, 2], [0.95, 1, 0.95]);

  // ──────────────────────────────────────────────
  // Clean UI Drop without expensive filters
  // ──────────────────────────────────────────────
  const uiDropY = useTransform(scrollProgress, [exitStart, absoluteExit], [0, 120]);
  const uiOpacity = panelAlpha;

  // Deep continuous parallax for Macro-Text
  const bgTextY = useTransform(scrollProgress, [panelStart, panelEnd], ['10%', '-40%']);

  // Strictly bind pointer events and global opacity to the active lifecycle window
  // "Destrucción de Stack Contextual Fantasma": None blocks interaction when dead.
  const pointerState = useTransform(scrollProgress, (p) => (p >= panelStart && p <= absoluteExit) ? 'auto' : 'none');
  const displayState = useTransform(scrollProgress, (p) => (p >= panelStart - 0.01 && p <= absoluteExit + 0.01) ? 'block' : 'none');
  const panelOpacity = useTransform(scrollProgress, [panelStart - 0.001, panelStart, absoluteExit, absoluteExit + 0.001], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 w-full h-full transform-gpu"
      style={{
        zIndex: 10 + index,
        opacity: panelOpacity,
        display: displayState as any,
        pointerEvents: pointerState as any,
        perspective: '1200px', // Required for realistic Z-Axis translation and rotation
        scale: kineticScale, // Extreme Immersion G-Force
      }}
    >
      {/* ── Macro-Text (Asymmetric Deep Background Z-0) ── */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isActive ? 'will-change-transform' : ''}`}
        style={{ y: bgTextY, opacity: textOpacity, zIndex: 0 }}
      >
        <span
          className="font-luxury text-[25vw] sm:text-[22vw] md:text-[20vw] lg:text-[24vw] leading-[0.85] tracking-[-0.03em] text-white/[0.03] whitespace-nowrap"
          style={{ transform: 'translate3d(0,0,0)' }} // Enforces subpixel text rendering
        >
          {step.number}
        </span>
      </motion.div>

      {/* ── Text Centerpiece Z-Axis Levitation (Left Positioned Z-10) ── */}
      <motion.div
        className={`absolute left-[6%] md:left-[8%] lg:left-[10%] top-[15%] sm:top-[20%] md:top-[28%] lg:top-[35%] z-10 max-w-sm md:max-w-xl pointer-events-none transform-gpu ${isActive ? 'will-change-transform' : ''}`}
        style={{
          opacity: textOpacity,
          z: tunnelZ,
          transformOrigin: '50% 100%'
        }}
      >
        <span className="block font-mono text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-white/50 mb-4 md:mb-6">
          {step.spec}
        </span>
        <h3 className="font-luxury text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] leading-[0.85] tracking-[-0.03em] text-white">
          {step.title}
        </h3>
        <p className="font-elegant text-sm sm:text-base md:text-lg lg:text-xl leading-[1.6] text-white/80 mt-5 md:mt-6 lg:mt-8 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          {step.subtitle}
        </p>
      </motion.div>

      {/* ── Floating Artifact: Optical Compositing & Liquid Inertia (Z-20) ── */}
      <motion.div
        className={`absolute right-[5%] md:right-[8%] lg:right-[10%] top-[8%] sm:top-[12%] md:top-[15%] lg:top-[12%] w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[32vw] aspect-[4/5] sm:aspect-[1/1] md:aspect-[3/4] z-20 pointer-events-none transform-gpu ${isActive ? 'will-change-transform' : ''}`}
        style={{
          z: tunnelZ,
          rotateX,
          rotateY,
          skewY,
          clipPath: imgClipPath,
        }}
      >
        {/* Micro-border inside the artifact */}
        <div className="absolute inset-0 rounded-[1.25rem] border border-white/10 z-30 pointer-events-none mix-blend-overlay" />

        {/* 
          Optical Compositing System 
          Avoids filter: blur() animation. Renders sharp and pre-blurred images overlaid, fading opacity.
        */}
        <div className="w-full h-full rounded-[1.25rem] overflow-hidden bg-[#040810] relative transform-gpu">

          {/* Layer 1: Sharp Image */}
          <motion.img
            src={step.image}
            alt={step.title}
            className="absolute inset-0 w-full h-full object-cover z-10"
            style={{
              scale: internalImgScale,
              objectPosition: step.imagePosition,
              filter: 'saturate(1.1) contrast(1.05)',
              opacity: sharpLayerOpacity,
            }}
          />

          {/* Layer 2: Top Pre-blurred layer (Fades in over sharp image during scroll out) */}
          <motion.img
            src={step.blurredImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-20"
            style={{
              scale: internalImgScale,
              objectPosition: step.imagePosition,
              opacity: blurLayerOpacity,
              mixBlendMode: 'lighten'
            }}
            aria-hidden="true"
          />

          {/* Static Ambient Base Gradients for occlusion and realistic shadow embedding */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050d]/80 via-transparent to-transparent pointer-events-none z-30" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_0%,rgba(2,5,13,0.30)_100%)] z-30" />
        </div>
      </motion.div>

      {/* ── Magnetic Contour UI Intersecting Bottom Left Quadrant (Z-30) ── */}
      <motion.div
        className={`absolute bottom-[2%] sm:bottom-[5%] md:bottom-[10%] lg:bottom-[12%] left-[5%] md:left-[35%] lg:left-[45%] xl:left-[50%] z-30 w-[90vw] md:w-[480px] lg:w-[500px] pointer-events-auto transform-gpu ${isActive ? 'will-change-transform' : ''}`}
        style={{
          opacity: uiOpacity,
          y: uiDropY,
          z: tunnelZ
        }}
      >
        <ObsidianEcosystemCard step={step} />
      </motion.div>

    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT 
   ═══════════════════════════════════════════════════════════════════════════ */
const Process = () => {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Superior smooth engine enforcing 60fps pacing through spring interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.8,
  });

  // Use localized spring for velocity physics mapped in the panels
  const scrollVel = useVelocity(smoothProgress);
  const smoothVel = useSpring(scrollVel, { damping: 40, stiffness: 200, mass: 0.5 });

  // Luminous spine timeline parameters
  const spineScaleY = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const emitterTop = useTransform(smoothProgress, [0, 0.3], ['0%', '100%']);
  const spineOpacity = useTransform(smoothProgress, [0, 0.03], [0, 1]);
  const glowPulse = useTransform(smoothProgress, [0, 1], [0.35, 1]);

  return (
    <section
      ref={containerRef}
      id="proceso-meticuloso"
      className="relative isolate bg-[#02050d]"
    >
      {/* Extreme dark aesthetic ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,rgba(33,67,118,0.1)_0%,rgba(3,10,20,0.85)_58%,rgba(2,6,12,0.98)_100%)] z-0"
        aria-hidden="true"
      />

      {/* ── Hero Entry ── */}
      <header className="relative h-screen min-h-[800px] flex flex-col items-center justify-center overflow-hidden px-6 z-10">
        <div className="relative z-10 text-center max-w-5xl flex flex-col items-center">
          <motion.span
            className="inline-block font-mono text-[11px] tracking-[0.48em] uppercase text-white/70 mb-8 will-change-transform"
            initial={{ opacity: 0, letterSpacing: '0.7em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.48em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: SILK }}
          >
            - Metodología -
          </motion.span>

          <div className="flex flex-col items-center space-y-2 md:space-y-4">
            <MaskReveal>
              <h2 className="font-luxury text-6xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] leading-[0.9] tracking-[-0.034em] text-white">
                Proceso
              </h2>
            </MaskReveal>
            <MaskReveal delay={0.08}>
              <h2
                className="font-luxury text-6xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] leading-[0.9] tracking-[-0.034em] text-white"
                style={{ fontStyle: 'italic' }}
              >
                Meticuloso
              </h2>
            </MaskReveal>
          </div>


          <motion.p
            className="font-elegant text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-[1.7] text-white/85 will-change-transform"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.15 }}
          >
            Cada decisión financiera exige precisión quirúrgica.
            <br className="hidden sm:block" />
            Convertimos complejidad en una ruta clara, medible y elegante.
          </motion.p>

          <motion.div
            className="w-24 h-px mx-auto mt-10 will-change-transform"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(217,180,107,0.92), rgba(255,255,255,0.35), transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.9, ease: SILK }}
          />
        </div>
      </header>

      {/* ── Cinematic Deep Viewport ── */}
      <div className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* ── Background Ambiance Deep ── */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,rgba(33,67,118,0.22)_0%,rgba(3,10,20,0.8)_58%,rgba(2,6,12,0.95)_100%)] z-0" />

          {/* ── Left Luminous Spine ── */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-7 xl:left-12 w-[2px] z-50 pointer-events-none mix-blend-screen"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-white/10" />
            <motion.div
              className="absolute top-0 left-0 h-full w-full origin-top will-change-transform"
              style={{
                scaleY: spineScaleY,
                opacity: spineOpacity,
                background: 'linear-gradient(to bottom, rgba(217,180,107,0.95), rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.2) 75%, transparent)',
              }}
            />
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 will-change-transform"
              style={{ top: emitterTop, opacity: spineOpacity }}
            >
              <motion.div className="relative will-change-transform" style={{ opacity: glowPulse }}>
                <div className="w-2 h-2 rounded-full bg-white border border-[#d9b46b]/85" />
                <div className="absolute -inset-1.5 rounded-full bg-white/70 blur-[5px]" />
                <div className="absolute -inset-4 rounded-full bg-[#d9b46b]/50 blur-md" />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Sequence Panels (Spatial Composition) ── */}
          {steps.map((step, index) => (
            <SpatialPanel
              key={step.number}
              step={step}
              index={index}
              totalSteps={steps.length}
              scrollProgress={smoothProgress}
              smoothVel={smoothVel}
            />
          ))}

        </div>
      </div>

      {/* ── Magnetic CTA (Cierre) ── */}
      <div className="relative h-[45vh] flex flex-col items-center justify-center bg-[#02050d] z-20 overflow-hidden">
        {/* Línea de luz límite superior */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Glow subyacente sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-lg aspect-square rounded-full pointer-events-none mix-blend-screen opacity-10 blur-[80px]" style={{ background: 'radial-gradient(circle, #D9B46B 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 1.4, ease: EXPO_OUT }}
        >
          <MagneticCTA text="Diagnóstico Inicial" />
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
