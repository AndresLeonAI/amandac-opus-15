import { useRef, useState, useEffect, useLayoutEffect, useCallback, type MouseEvent } from 'react';
import { Search, Target, Users, type LucideIcon } from 'lucide-react';
import { MagneticCTA } from '@/components/ui/MagneticCTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

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
    image: 'https://ik.imagekit.io/jsaisu64x/A_vertical_architectural_2k_202602051906.jpeg',
    blurredImage: 'https://ik.imagekit.io/jsaisu64x/A_vertical_architectural_2k_202602051906.jpeg?tr=bl-30',
    imagePosition: 'center',
    userActions: [
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
    image: 'https://ik.imagekit.io/jsaisu64x/A_wide_panoramic_2k_202602051902.jpeg',
    blurredImage: 'https://ik.imagekit.io/jsaisu64x/A_wide_panoramic_2k_202602051902.jpeg?tr=bl-30',
    imagePosition: 'center',
    userActions: [
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
    image: 'https://ik.imagekit.io/jsaisu64x/A_closeup_interior_2k_202602051907.jpeg',
    blurredImage: 'https://ik.imagekit.io/jsaisu64x/A_closeup_interior_2k_202602051907.jpeg?tr=bl-30',
    imagePosition: 'center',
    userActions: [
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

const MaskReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      y: '112%', rotateX: 10, transformOrigin: 'top center',
      duration: 1.05, delay, ease: 'expo.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: ref });

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={ref} className="will-change-transform block">
        {children}
      </div>
    </div>
  );
};

const TimelineNode = ({ icon: Icon, isActive }: { icon: LucideIcon; isActive: boolean; }) => (
  <div className="relative flex items-center justify-center">
    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border transition-all duration-700 ${isActive ? 'bg-white/10 border-white/20 scale-100' : 'bg-transparent border-white/5 opacity-50 scale-90'}`}>
      <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-700 ${isActive ? 'text-white' : 'text-white/40'}`} strokeWidth={1.5} />
    </div>
  </div>
);

/** 
 * Obsidian Contour Card — CSS-based border glow replacing useMotionTemplate
 */
const ObsidianEcosystemCard = ({ step }: { step: StepData }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative rounded-[1.25rem] bg-[#00000066] border border-transparent backdrop-blur-none group overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ '--mx': '200px', '--my': '200px' } as React.CSSProperties}
    >
      {/* Hover Light Gradient — CSS custom properties replace useMotionTemplate */}
      <div
        className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem] p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out will-change-transform"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          maskImage: `radial-gradient(400px circle at var(--mx) var(--my), white, transparent 60%)`,
        } as React.CSSProperties}
        aria-hidden="true"
      />

      <div className="absolute inset-0 pointer-events-none rounded-[1.25rem] border border-white/5 z-0" />

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
   SPATIAL PANEL → GSAP ScrollTrigger scrub
   ═══════════════════════════════════════════════════════════════════════════ */
const SpatialPanel = ({ step, index, totalSteps }: { step: StepData; index: number; totalSteps: number }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      className="process-spatial-panel absolute inset-0 w-full h-full transform-gpu"
      data-index={index}
      style={{
        zIndex: 10 + index,
        opacity: 0,
        display: 'none',
        perspective: '1200px',
      }}
    >
      {/* Macro-Text (Deep Background Z-0) */}
      <div className="process-panel-bgtext absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
        <span
          className="font-luxury text-[25vw] sm:text-[22vw] md:text-[20vw] lg:text-[24vw] leading-[0.85] tracking-[-0.03em] text-white/[0.03] whitespace-nowrap"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {step.number}
        </span>
      </div>

      {/* Text Centerpiece (Left Z-10) */}
      <div className="process-panel-text absolute left-[6%] md:left-[8%] lg:left-[10%] top-[15%] sm:top-[20%] md:top-[28%] lg:top-[35%] z-10 max-w-sm md:max-w-xl pointer-events-none transform-gpu" style={{ opacity: 0, transform: 'translateZ(800px)' }}>
        <span className="block font-mono text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-white/50 mb-4 md:mb-6">
          {step.spec}
        </span>
        <h3 className="font-luxury text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] leading-[0.85] tracking-[-0.03em] text-white">
          {step.title}
        </h3>
        <p className="font-elegant text-sm sm:text-base md:text-lg lg:text-xl leading-[1.6] text-white/80 mt-5 md:mt-6 lg:mt-8 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          {step.subtitle}
        </p>
      </div>

      {/* Floating Artifact: Image (Z-20) */}
      <div className="process-panel-image absolute right-[5%] md:right-[8%] lg:right-[10%] top-[8%] sm:top-[12%] md:top-[15%] lg:top-[12%] w-[85%] sm:w-[60%] md:w-[45%] lg:w-[32%] max-w-none aspect-[4/5] sm:aspect-[1/1] md:aspect-[3/4] z-20 pointer-events-none transform-gpu" style={{ clipPath: 'inset(100% 0% 0% 0%)' }}>
        <div className="absolute inset-0 rounded-[1.25rem] border border-white/10 z-30 pointer-events-none mix-blend-overlay" />
        <div className="w-full h-full rounded-[1.25rem] overflow-hidden bg-[#040810] relative transform-gpu">
          <img
            src={step.image}
            alt={step.title}
            className="process-panel-img-sharp absolute inset-0 w-full h-full object-cover z-10"
            style={{ objectPosition: step.imagePosition, filter: 'saturate(1.1) contrast(1.05)', transform: 'scale(1.4)' }}
          />
          <img
            src={step.blurredImage}
            alt=""
            className="process-panel-img-blur absolute inset-0 w-full h-full object-cover z-20"
            style={{ objectPosition: step.imagePosition, opacity: 0, mixBlendMode: 'lighten' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050d]/80 via-transparent to-transparent pointer-events-none z-30" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_0%,rgba(2,5,13,0.30)_100%)] z-30" />
        </div>
      </div>

      {/* Obsidian Card (Z-30) */}
      <div className="process-panel-card absolute bottom-[2%] sm:bottom-[5%] md:bottom-[10%] lg:bottom-[12%] left-[5%] md:left-[35%] lg:left-[45%] xl:left-[50%] z-30 w-[90%] md:w-[480px] lg:w-[500px] pointer-events-auto transform-gpu" style={{ opacity: 0, transform: 'translateY(120px)' }}>
        <ObsidianEcosystemCard step={step} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT 
   ═══════════════════════════════════════════════════════════════════════════ */
const Process = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Hero reveals
  useGSAP(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    gsap.from(el.querySelector('.hero-eyebrow'), {
      opacity: 0, letterSpacing: '0.7em', duration: 1.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from(el.querySelector('.hero-subtitle'), {
      opacity: 0, y: 26, duration: 0.9, delay: 0.15, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from(el.querySelector('.hero-line'), {
      scaleX: 0, opacity: 0, duration: 0.9, delay: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
    });
  }, { scope: heroRef });

  // CTA reveal
  useGSAP(() => {
    if (!ctaRef.current) return;
    gsap.from(ctaRef.current.querySelector('.cta-inner'), {
      opacity: 0, scale: 0.9, y: 20, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: ctaRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
  }, { scope: ctaRef });

  // Main scroll-driven panels (replaces entire framer MotionValue chain)
  useLayoutEffect(() => {
    if (!stickyRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = stickyRef.current!.querySelectorAll('.process-spatial-panel');
      const spineTrack = stickyRef.current!.querySelector('.spine-track') as HTMLElement;
      const spineEmitter = stickyRef.current!.querySelector('.spine-emitter') as HTMLElement;

      const totalSteps = panels.length;
      const heroOffset = 0.25;
      const usableScroll = 0.75;
      const segLen = usableScroll / totalSteps;

      // Create the master ScrollTrigger
      ScrollTrigger.create({
        trigger: stickyRef.current!.closest('[data-process-container]'),
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5, // Smooth like spring physics
        onUpdate: (self) => {
          const progress = self.progress;

          // Spine animation
          if (spineTrack) {
            const spineScale = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.3, 0, 1, progress));
            const spineOpacity = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.03, 0, 1, progress));
            spineTrack.style.transform = `scaleY(${spineScale})`;
            spineTrack.style.opacity = String(spineOpacity);
          }
          if (spineEmitter) {
            const top = gsap.utils.clamp(0, 100, gsap.utils.mapRange(0, 0.3, 0, 100, progress));
            const spineOpacity = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.03, 0, 1, progress));
            spineEmitter.style.top = `${top}%`;
            spineEmitter.style.opacity = String(spineOpacity);
          }

          // Per-panel animations
          panels.forEach((panel, index) => {
            const el = panel as HTMLElement;
            const panelStart = heroOffset + (index * segLen);
            const panelEnd = panelStart + segLen;
            const isLast = index === totalSteps - 1;
            const enterEnd = panelStart + (segLen * 0.25);
            const exitStart = isLast ? 1.5 : panelEnd - (segLen * 0.25);
            const absoluteExit = isLast ? 1.5 : panelEnd - 0.02;

            // Visibility
            const isInRange = progress >= panelStart - 0.01 && progress <= absoluteExit + 0.01;
            el.style.display = isInRange ? 'block' : 'none';

            if (!isInRange) return;

            // Opacity fade in/out
            let alpha = 0;
            if (progress >= panelStart && progress <= enterEnd) {
              alpha = gsap.utils.mapRange(panelStart, enterEnd, 0, 1, progress);
            } else if (progress > enterEnd && progress < exitStart) {
              alpha = 1;
            } else if (progress >= exitStart && progress <= absoluteExit) {
              alpha = gsap.utils.mapRange(exitStart, absoluteExit, 1, 0, progress);
            }
            el.style.opacity = String(gsap.utils.clamp(0, 1, alpha));
            el.style.pointerEvents = (progress >= panelStart && progress <= absoluteExit) ? 'auto' : 'none';

            // Z-tunnel
            const tunnelZ = gsap.utils.interpolate(
              [800, 0, 0, -800],
              gsap.utils.mapRange(panelStart, absoluteExit, 0, 1, progress)
            );

            // Text
            const textEl = el.querySelector('.process-panel-text') as HTMLElement;
            if (textEl) {
              textEl.style.opacity = String(gsap.utils.clamp(0, 1, alpha));
              textEl.style.transform = `translateZ(${tunnelZ}px)`;
            }

            // Background text parallax
            const bgText = el.querySelector('.process-panel-bgtext') as HTMLElement;
            if (bgText) {
              const bgY = gsap.utils.mapRange(panelStart, panelEnd, 10, -40, progress);
              bgText.style.opacity = String(gsap.utils.clamp(0, 1, alpha));
              bgText.style.transform = `translateY(${bgY}%)`;
            }

            // Image clip + scale
            const imgContainer = el.querySelector('.process-panel-image') as HTMLElement;
            if (imgContainer) {
              const clipProgress = gsap.utils.clamp(0, 1, gsap.utils.mapRange(panelStart, enterEnd, 0, 1, progress));
              const insetTop = gsap.utils.interpolate(100, 0, clipProgress);
              imgContainer.style.clipPath = `inset(${insetTop}% 0% 0% 0%)`;
              imgContainer.style.transform = `translateZ(${tunnelZ}px)`;
            }

            // Sharp image scale
            const imgSharp = el.querySelector('.process-panel-img-sharp') as HTMLElement;
            if (imgSharp) {
              const imgScale = gsap.utils.interpolate(1.4, 1, gsap.utils.clamp(0, 1, gsap.utils.mapRange(panelStart, enterEnd, 0, 1, progress)));
              imgSharp.style.transform = `scale(${imgScale})`;

              const sharpOp = gsap.utils.interpolate(1, 0.4, gsap.utils.clamp(0, 1, gsap.utils.mapRange(exitStart, absoluteExit, 0, 1, progress)));
              imgSharp.style.opacity = String(sharpOp);
            }

            // Blur layer
            const imgBlur = el.querySelector('.process-panel-img-blur') as HTMLElement;
            if (imgBlur) {
              const blurOp = gsap.utils.clamp(0, 1, gsap.utils.mapRange(exitStart, absoluteExit, 0, 1, progress));
              imgBlur.style.opacity = String(blurOp);
            }

            // Card UI drop
            const card = el.querySelector('.process-panel-card') as HTMLElement;
            if (card) {
              const cardY = gsap.utils.interpolate(0, 120, gsap.utils.clamp(0, 1, gsap.utils.mapRange(exitStart, absoluteExit, 0, 1, progress)));
              card.style.opacity = String(gsap.utils.clamp(0, 1, alpha));
              card.style.transform = `translateY(${cardY}px) translateZ(${tunnelZ}px)`;
            }
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="proceso-meticuloso"
      className="relative isolate bg-[#02050d]"
      data-process-container
    >
      {/* Ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,rgba(33,67,118,0.1)_0%,rgba(3,10,20,0.85)_58%,rgba(2,6,12,0.98)_100%)] z-0"
        aria-hidden="true"
      />

      {/* Hero Entry */}
      <header ref={heroRef} className="relative h-[100dvh] min-h-[800px] flex flex-col items-center justify-center overflow-hidden px-6 z-10">
        <div className="relative z-10 text-center max-w-5xl flex flex-col items-center">
          <span className="hero-eyebrow inline-block font-mono text-[11px] tracking-[0.48em] uppercase text-white/70 mb-8 will-change-transform">
            - Metodología -
          </span>

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

          <p className="hero-subtitle font-elegant text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-[1.7] text-white/85 will-change-transform">
            Cada decisión financiera exige precisión quirúrgica.
            <br className="hidden sm:block" />
            Convertimos complejidad en una ruta clara, medible y elegante.
          </p>

          <div
            className="hero-line w-24 h-px mx-auto mt-10 will-change-transform"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(217,180,107,0.92), rgba(255,255,255,0.35), transparent)',
            }}
          />
        </div>
      </header>

      {/* Cinematic Deep Viewport */}
      <div className="relative h-[300vh]">
        <div ref={stickyRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden">

          {/* Background Ambiance */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_60%_at_50%_50%,rgba(33,67,118,0.22)_0%,rgba(3,10,20,0.8)_58%,rgba(2,6,12,0.95)_100%)] z-0" />

          {/* Left Luminous Spine */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-7 xl:left-12 w-[2px] z-50 pointer-events-none mix-blend-screen"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-white/10" />
            <div
              className="spine-track absolute top-0 left-0 h-full w-full origin-top will-change-transform"
              style={{
                transform: 'scaleY(0)',
                opacity: 0,
                background: 'linear-gradient(to bottom, rgba(217,180,107,0.95), rgba(255,255,255,0.82) 42%, rgba(255,255,255,0.2) 75%, transparent)',
              }}
            />
            <div className="spine-emitter absolute left-1/2 -translate-x-1/2 will-change-transform" style={{ top: '0%', opacity: 0 }}>
              <div className="relative will-change-transform">
                <div className="w-2 h-2 rounded-full bg-white border border-[#d9b46b]/85" />
                <div className="absolute -inset-1.5 rounded-full bg-white/70 blur-[5px]" />
                <div className="absolute -inset-4 rounded-full bg-[#d9b46b]/50 blur-md" />
              </div>
            </div>
          </div>

          {/* Spatial Panels */}
          {steps.map((step, index) => (
            <SpatialPanel
              key={step.number}
              step={step}
              index={index}
              totalSteps={steps.length}
            />
          ))}

        </div>
      </div>

      {/* Magnetic CTA */}
      <div ref={ctaRef} className="relative h-[45vh] flex flex-col items-center justify-center bg-[#02050d] z-20 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-lg aspect-square rounded-full pointer-events-none mix-blend-screen opacity-10 blur-[80px]" style={{ background: 'radial-gradient(circle, #D9B46B 0%, transparent 60%)' }} />

        <div className="cta-inner">
          <MagneticCTA text="Diagnóstico Inicial" />
        </div>
      </div>
    </section>
  );
};

export default Process;
