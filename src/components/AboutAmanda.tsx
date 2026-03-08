import { useRef, useState, useEffect, useCallback, useSyncExternalStore, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

gsap.registerPlugin(ScrollTrigger);

const SILK: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback((cb: () => void) => { const mql = window.matchMedia(query); mql.addEventListener('change', cb); return () => mql.removeEventListener('change', cb); }, [query]);
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='300' height='300' filter='url(#n)' opacity='1'/></svg>`;
const noiseDataUri = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

/* ── AnimatedCounter (GSAP) ── */
const AnimatedCounter = ({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useGSAP(() => {
    if (!ref.current) return;
    const proxy = { val: 0 };
    gsap.to(proxy, { val: target, duration, ease: 'power2.out', onUpdate: () => setDisplay(Math.round(proxy.val)), scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } });
  }, { scope: ref });
  return (
    <span ref={ref} className="font-luxury text-5xl md:text-7xl tabular-nums not-italic bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
      {display}{suffix && <span className="text-primary">{suffix}</span>}
    </span>
  );
};

/* ── TitleReveal (GSAP ScrollTrigger) ── */
const TitleReveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { y: '110%', duration: 0.9, delay, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } });
  }, { scope: ref });
  return <div className={`overflow-hidden ${className}`}><div ref={ref}>{children}</div></div>;
};

/* ── WordStagger (GSAP ScrollTrigger) ── */
const WordStagger = ({ text, className = '' }: { text: string; className?: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');
  useGSAP(() => {
    if (!ref.current) return;
    const spans = ref.current.querySelectorAll('.word-inner');
    gsap.from(spans, { y: '100%', opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.025, scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } });
  }, { scope: ref });
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (<span key={i} className="inline-block overflow-hidden mr-[0.3em]"><span className="word-inner inline-block">{word}</span></span>))}
    </p>
  );
};

/* ── SpotlightCard (CSS custom properties replace useMotionValue) ── */
const SpotlightCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--spot-x', `${x}%`);
    cardRef.current.style.setProperty('--spot-y', `${y}%`);
  }, []);
  const handleLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--spot-x', '50%');
    cardRef.current.style.setProperty('--spot-y', '50%');
  }, []);

  return (
    <div ref={cardRef} className={`relative overflow-hidden hover:-translate-y-[5px] transition-all duration-300 ${className}`}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ '--spot-x': '50%', '--spot-y': '50%', borderColor: 'rgba(255,255,255,0.07)' } as React.CSSProperties}>
      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl" style={{ background: `radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(255,255,255,0.07), transparent 60%)` }} />
      {children}
    </div>
  );
};

/* ── Section data ── */
const SECTIONS = [
  { id: 'trayectoria', stat: { value: 24, suffix: '+', label: 'Años de Trayectoria' }, body: 'Amanda Cruz es una asesora financiera con más de 24 años de experiencia, especializada en la planeación de portafolios e inversiones internacionales. Desde Bogotá, y como parte de AXIA, ha acompañado a profesionales, empresarios y familias a transformar la manera en que protegen y hacen crecer su patrimonio.' },
  { id: 'impacto', stat: { value: 150, suffix: '+', label: 'Profesionales y Familias' }, body: 'A lo largo de su carrera, ha guiado a más de 150 profesionales y familias a fortalecer su patrimonio, mediante estrategias personalizadas que combinan diversificación global, optimización del riesgo y un acompañamiento cercano en cada etapa.' },
  { id: 'reconocimiento', isAward: true, body: 'En 2024 fue nombrada "Mejor Asesor Financiero del Año" por United Financial Consultants (UFC), reconocimiento que consolida más de dos décadas de resultados concretos y confianza construida cliente a cliente.' },
  { id: 'filosofia', body: 'Su filosofía es inquebrantable: cada cliente merece un plan financiero diseñado con precisión quirúrgica, visión global y resultados que se traduzcan en seguridad y crecimiento sostenible a largo plazo.' },
] as const;

const GRADIENT_TEXT = 'bg-gradient-to-b from-white via-white/90 to-white/65 bg-clip-text text-transparent';

/* ── NarrativeBlock (GSAP) ── */
const NarrativeBlock = ({ section, index, isDesktop }: { section: (typeof SECTIONS)[number]; index: number; isDesktop: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasStat = 'stat' in section && section.stat;

  useGSAP(() => {
    if (!ref.current) return;
    if (!isDesktop) {
      gsap.from(ref.current, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } });
    }
  }, { scope: ref, dependencies: [isDesktop] });

  return (
    <div ref={ref} className="about-narrative-block py-10 md:py-16 will-change-transform" data-index={index}>
      {hasStat && (
        <div className="mb-6">
          <AnimatedCounter target={section.stat.value} suffix={section.stat.suffix} duration={2.2} />
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/30 font-elegant">{section.stat.label}</p>
        </div>
      )}
      {'isAward' in section && section.isAward ? (
        <SpotlightCard className="px-8 py-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-2xl shadow-2xl">
          <div className="about-breathing-orb absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(220 100% 60% / 0.2), transparent 70%)' }} />
          <p className="relative z-20 text-xs uppercase tracking-[0.3em] text-primary/60 font-elegant mb-3">Reconocimiento 2024</p>
          <div className="relative z-20"><WordStagger text={section.body} className={`font-elegant text-lg leading-[1.8] ${GRADIENT_TEXT}`} /></div>
        </SpotlightCard>
      ) : (
        <WordStagger text={section.body} className={`font-elegant text-lg md:text-xl leading-[1.85] ${GRADIENT_TEXT}`} />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   AboutAmanda — Pure GSAP
   ══════════════════════════════════════════════════════ */
const AboutAmanda = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Scroll-driven narrative highlighting (desktop only)
  useLayoutEffect(() => {
    if (!isDesktop || !containerRef.current || !leftColRef.current) return;
    const ctx = gsap.context(() => {
      const blocks = leftColRef.current!.querySelectorAll('.about-narrative-block');
      const progressFill = leftColRef.current!.querySelector('.about-progress-fill') as HTMLElement;
      const progressDot = leftColRef.current!.querySelector('.about-progress-dot') as HTMLElement;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top', end: 'bottom bottom', scrub: 2,
        onUpdate: (self) => {
          const p = self.progress;
          if (progressFill) progressFill.style.height = `${p * 100}%`;
          if (progressDot) progressDot.style.top = `${p * 100}%`;

          blocks.forEach((el, i) => {
            const rangeStart = i * 0.25;
            const rangeEnd = (i + 1) * 0.25;
            const fadeIn = Math.max(0, rangeStart - 0.08);
            const fadeOut = Math.min(1, rangeEnd + 0.08);
            let op = 0.12, sc = 0.98, tx = -6;
            if (p >= rangeStart && p <= rangeEnd) { op = 1; sc = 1.02; tx = 0; }
            else if (p >= fadeIn && p < rangeStart) {
              const t = gsap.utils.mapRange(fadeIn, rangeStart, 0, 1, p);
              op = gsap.utils.interpolate(0.12, 1, t); sc = gsap.utils.interpolate(0.98, 1.02, t); tx = gsap.utils.interpolate(-6, 0, t);
            } else if (p > rangeEnd && p <= fadeOut) {
              const t = gsap.utils.mapRange(rangeEnd, fadeOut, 0, 1, p);
              op = gsap.utils.interpolate(1, 0.12, t); sc = gsap.utils.interpolate(1.02, 0.98, t); tx = gsap.utils.interpolate(0, -6, t);
            }
            (el as HTMLElement).style.opacity = String(op);
            (el as HTMLElement).style.transform = `scale(${sc}) translateX(${tx}px)`;
          });
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isDesktop]);

  // Image parallax + reveals
  useGSAP(() => {
    if (!imageWrapRef.current || !containerRef.current) return;
    // Image entrance
    gsap.from(imageWrapRef.current.querySelector('.about-image-outer'), { opacity: 0, x: 40, scale: 0.96, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: imageWrapRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.from(imageWrapRef.current.querySelector('.about-image-inner'), { opacity: 0, scale: 1.06, duration: 1.4, delay: 0.15, ease: 'power2.out', scrollTrigger: { trigger: imageWrapRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.from(imageWrapRef.current.querySelector('.about-name-badge'), { opacity: 0, y: 12, duration: 0.7, delay: 0.6, ease: 'power2.out', scrollTrigger: { trigger: imageWrapRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    // Image scroll parallax
    gsap.to(imageWrapRef.current.querySelector('.about-image-inner'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom bottom', scrub: true } });
    // Breathing glows
    gsap.to(imageWrapRef.current.querySelector('.about-glow-primary'), { scale: 1.15, opacity: 0.45, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(imageWrapRef.current.querySelector('.about-glow-secondary'), { scale: 1, opacity: 0.2, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    // Breathing orb in award card
    gsap.to('.about-breathing-orb', { scale: 1.2, opacity: 0.14, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, { scope: containerRef });

  // Mouse 3D tilt (desktop only via GSAP quickTo)
  useEffect(() => {
    if (!isDesktop || !imageWrapRef.current) return;
    const tiltEl = imageWrapRef.current.querySelector('.about-tilt-target') as HTMLElement;
    if (!tiltEl) return;
    const xTo = gsap.quickTo(tiltEl, 'rotateX', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(tiltEl, 'rotateY', { duration: 0.4, ease: 'power2.out' });
    const outer = imageWrapRef.current.querySelector('.about-image-outer') as HTMLElement;
    if (!outer) return;
    const onMove = (e: MouseEvent) => {
      const rect = outer.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      yTo(px * 4); xTo(-py * 3);
    };
    const onLeave = () => { xTo(0); yTo(0); };
    outer.addEventListener('mousemove', onMove, { passive: true });
    outer.addEventListener('mouseleave', onLeave);
    return () => { outer.removeEventListener('mousemove', onMove); outer.removeEventListener('mouseleave', onLeave); };
  }, [isDesktop]);

  // Accent line reveal
  const accentRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!accentRef.current) return;
    gsap.from(accentRef.current, { scaleX: 0, opacity: 0, duration: 1, delay: 0.4, ease: 'power2.out', scrollTrigger: { trigger: accentRef.current, start: 'top 90%', toggleActions: 'play none none none' } });
  }, { scope: accentRef });

  // CTA reveal
  const ctaRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ctaRef.current) return;
    gsap.from(ctaRef.current, { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: 'power2.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', toggleActions: 'play none none none' } });
  }, { scope: ctaRef });

  return (
    <section id="about" ref={containerRef} className="relative lg:min-h-[300vh]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, hsl(220 100% 50% / 0.07), transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, hsl(220 80% 40% / 0.05), transparent 60%), radial-gradient(ellipse 40% 40% at 50% 20%, hsl(210 60% 30% / 0.03), transparent 50%)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">
          {/* LEFT: Scrolling narrative */}
          <div ref={leftColRef} className="order-2 lg:order-1 pt-24 lg:pt-32 pb-24 relative">
            {isDesktop && (
              <div className="absolute left-0 top-32 bottom-24 w-px">
                <div className="absolute inset-0 bg-white/[0.05] rounded-full" />
                <div className="about-progress-fill absolute top-0 left-0 w-full rounded-full" style={{ height: '0%', background: 'linear-gradient(to bottom, hsl(220 100% 55% / 0.5), hsl(220 100% 65% / 0.15))', boxShadow: '0 0 10px hsl(220 100% 55% / 0.2)' }} />
                <div className="about-progress-dot absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full" style={{ top: '0%', background: 'radial-gradient(circle, hsl(220 100% 70%) 30%, hsl(220 100% 55%) 100%)', boxShadow: '0 0 8px hsl(220 100% 60% / 0.6), 0 0 20px hsl(220 100% 55% / 0.25), 0 0 40px hsl(220 100% 55% / 0.1)' }} />
              </div>
            )}
            <div className="lg:pl-8">
              <TitleReveal className="mb-1"><h2 className={`font-luxury text-4xl md:text-5xl lg:text-6xl leading-[1.08] ${GRADIENT_TEXT}`}>Estrategia Global.</h2></TitleReveal>
              <TitleReveal delay={0.12} className="mb-5"><h2 className="font-luxury text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.08]">Seguridad Patrimonial.</h2></TitleReveal>
              <div ref={accentRef} className="w-16 h-px mb-14 origin-left" style={{ background: 'linear-gradient(to right, hsl(220 100% 55% / 0.6), transparent)' }} />
              {SECTIONS.map((section, i) => (<NarrativeBlock key={section.id} section={section} index={i} isDesktop={isDesktop} />))}
              <div ref={ctaRef} className="mt-12 md:mt-16 sm:ml-4 lg:ml-0 flex justify-center lg:justify-start lg:-ml-4"><MagneticCTA text="Diseñemos tu impacto" className="self-start" /></div>
            </div>
          </div>

          {/* RIGHT: Sticky image */}
          <div ref={imageWrapRef} className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start lg:h-fit pt-24 lg:pt-32">
            <div className="about-image-outer relative rounded-2xl overflow-hidden" style={{ perspective: isDesktop ? 1200 : undefined }}>
              <div className="about-tilt-target will-change-transform" style={{ transformStyle: isDesktop ? 'preserve-3d' : undefined }}>
                <div className="about-image-inner relative will-change-transform">
                  <img src="/lovable-uploads/5ce75e4d-ecd2-4490-8c38-8289c7e3a6e9.png" alt="Amanda Cruz, asesora financiera especializada en inversiones internacionales" className="w-full h-auto object-cover rounded-2xl" loading="lazy" style={{ maskImage: 'radial-gradient(ellipse 120% 90% at 50% 40%, black 50%, transparent 90%), linear-gradient(to bottom, black 55%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 120% 90% at 50% 40%, black 50%, transparent 90%), linear-gradient(to bottom, black 55%, transparent 100%)', maskComposite: 'intersect', WebkitMaskComposite: 'source-in' as unknown as string }} />
                </div>
              </div>
              {isDesktop && <div className="about-glow-primary absolute inset-0 -z-10 rounded-2xl" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 35%, hsl(220 100% 55% / 0.2), transparent 70%)', filter: 'blur(40px)', opacity: 0.25 }} />}
              <div className="about-glow-secondary absolute inset-0 -z-10 rounded-2xl" style={{ background: 'radial-gradient(ellipse 50% 50% at 60% 70%, hsl(200 80% 50% / 0.1), transparent 60%)', filter: 'blur(50px)', opacity: 0.1, transform: 'scale(1.1)' }} />
            </div>
            <div className="about-name-badge mt-6 text-center lg:text-left">
              <p className={`font-luxury text-2xl ${GRADIENT_TEXT}`}>Amanda Cruz</p>
              <p className="text-sm text-white/30 font-elegant tracking-[0.2em] uppercase mt-1">Senior Financial Advisor · AXIA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAmanda;