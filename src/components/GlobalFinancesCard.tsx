import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import createGlobe from 'cobe';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SILK: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const IMAGES = [
  'https://ik.imagekit.io/jsaisu64x/A_vertical_architectural_2k_202602051906.jpeg',
  'https://ik.imagekit.io/jsaisu64x/A_wide_panoramic_2k_202602051902.jpeg',
  'https://ik.imagekit.io/jsaisu64x/A_closeup_interior_2k_202602051907.jpeg',
];
const NOISE_URI = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'256\' height=\'256\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/><feColorMatrix type=\'saturate\' values=\'0\'/></filter><rect width=\'256\' height=\'256\' filter=\'url(#n)\' opacity=\'1\'/></svg>')}")`;

const C_RANGES = [
  [0.00, 0.08, 0.20, 0.28],
  [0.25, 0.33, 0.47, 0.55],
  [0.51, 0.59, 0.70, 0.78],
  [0.75, 0.83, 0.95, 1.00],
] as const;

interface ChapterData {
  index: number; eyebrow: string; title: string[]; body: string;
  accent: string; accentRgb: string; ghostNum: string;
  stat?: { value: number; suffix: string; label: string } | null;
  image?: string | null;
}
const CHAPTERS: ChapterData[] = [
  { index: 0, eyebrow: '01 — Divisas', title: ['Finanzas en', 'cualquier divisa'], body: 'Domine el tipo de cambio como ventaja estratégica. Un sistema claro para manejar USD, EUR, COP y más — con reglas precisas para cada flujo.', accent: 'hsl(218 100% 68%)', accentRgb: '60,120,255', ghostNum: '01', stat: { value: 4, suffix: '+', label: 'Divisas activas bajo gestión' }, image: IMAGES[0] },
  { index: 1, eyebrow: '02 — Geografía', title: ['Libertad', 'geográfica'], body: 'Sin fronteras para tu patrimonio. Planificamos el movimiento de activos entre jurisdicciones con máxima eficiencia fiscal — de Colombia a Europa, Miami o Singapur.', accent: 'hsl(44 90% 62%)', accentRgb: '230,170,40', ghostNum: '02', stat: { value: 10, suffix: '+', label: 'Ciudades de presencia global' }, image: IMAGES[1] },
  { index: 2, eyebrow: '03 — Protección', title: ['Protección', 'patrimonial'], body: 'Estructuras resilientes que preservan y multiplican, con blindaje ante cualquier volatilidad del mercado. 24 años diseñando escudos financieros.', accent: 'hsl(350 80% 65%)', accentRgb: '220,60,80', ghostNum: '03', stat: { value: 24, suffix: '+', label: 'Años protegiendo patrimonios' }, image: IMAGES[2] },
];

/* ─── animated counter (GSAP) ─── */
const AnimCounter = ({ target, suffix = '', duration = 2.4 }: { target: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useGSAP(() => {
    if (!ref.current) return;
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: target, duration, ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(proxy.val)),
      scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' },
    });
  }, { scope: ref });
  return (
    <span ref={ref}>
      <span className="font-serif italic text-5xl md:text-7xl bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent tabular-nums">{display}</span>
      <span className="text-primary text-4xl md:text-6xl font-serif ml-1">{suffix}</span>
    </span>
  );
};

/* ─── char-stagger eyebrow (GSAP) ─── */
const CharEyebrow = ({ text, isActive, color }: { text: string; isActive: boolean; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('.gfc-char');
    gsap.to(chars, {
      y: isActive ? '0%' : '100%', opacity: isActive ? 1 : 0,
      duration: 0.3, ease: 'expo.out', stagger: 0.018,
    });
  }, [isActive]);
  return (
    <div ref={ref} className="flex flex-wrap text-[10px] uppercase tracking-[0.45em] font-sans font-semibold mb-5" aria-label={text}>
      <span aria-hidden="true" className="flex flex-wrap">
        {text.split('').map((ch, i) => (
          <span key={i} className="gfc-char inline-block" style={{ color, opacity: 0, transform: 'translateY(100%)' }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>
    </div>
  );
};

/* ─── word-stagger title (GSAP) ─── */
const WordTitle = ({ lines, isActive }: { lines: string[]; isActive: boolean }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll('.gfc-word');
    words.forEach((word, i) => {
      const li = parseInt((word as HTMLElement).dataset.line || '0');
      const wi = parseInt((word as HTMLElement).dataset.word || '0');
      gsap.to(word, {
        y: isActive ? '0%' : '110%', opacity: isActive ? 1 : 0, rotate: isActive ? 0 : 2,
        duration: 0.72, ease: 'expo.out', delay: li * 0.14 + wi * 0.07,
      });
    });
  }, [isActive]);
  return (
    <h2 ref={ref} className="font-serif italic text-white mb-5 leading-[0.90] tracking-tight" style={{ fontSize: 'clamp(2.8rem, 5vw, 5.4rem)' }} aria-label={lines.join(' ')}>
      <span aria-hidden="true">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(' ').map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.25em] pr-4 pb-2 -mr-4 -mb-2">
                <span className="gfc-word inline-block" data-line={li} data-word={wi} style={{ transform: 'translateY(110%)', opacity: 0 }}>{word}</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </h2>
  );
};

/* ─── SVG chapter icons (CSS transitions replace motion.path) ─── */
const GlowFilter = ({ id }: { id: string }) => (<defs><filter id={id} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>);

const IconExchange = ({ isActive, color }: { isActive: boolean; color: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => { if (!ref.current) return; const paths = ref.current.querySelectorAll('path, text'); paths.forEach((p, i) => { gsap.to(p, { attr: { 'stroke-dashoffset': isActive ? 0 : (p as SVGPathElement).getTotalLength?.() || 100 }, opacity: isActive ? 1 : 0, duration: 0.8, delay: i * 0.15, ease: 'expo.out' }); }); }, [isActive]);
  return (<svg ref={ref} viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true"><GlowFilter id="ig1" /><path d="M18 42 Q20 18 52 18" stroke={color} strokeWidth="1.4" strokeLinecap="round" filter="url(#ig1)" style={{ opacity: 0 }} /><path d="M47 13 L56 18 L48 23" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0 }} /><path d="M62 38 Q60 62 28 62" stroke={color} strokeWidth="1.4" strokeLinecap="round" filter="url(#ig1)" style={{ opacity: 0 }} /><path d="M33 67 L24 62 L32 57" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0 }} /><text x="10" y="46" fontSize="12" fill={color} fontFamily="serif" style={{ opacity: 0 }}>$</text><text x="57" y="36" fontSize="12" fill={color} fontFamily="serif" style={{ opacity: 0 }}>€</text></svg>);
};
const IconFlight = ({ isActive, color }: { isActive: boolean; color: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => { if (!ref.current) return; gsap.to(ref.current.querySelectorAll('path, circle, text'), { opacity: isActive ? 1 : 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }); }, [isActive]);
  return (<svg ref={ref} viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true"><GlowFilter id="ig2" /><path d="M14 62 Q30 22 66 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" filter="url(#ig2)" style={{ opacity: 0 }} /><circle cx="14" cy="62" r="3.5" fill={color} style={{ opacity: 0 }} /><circle cx="66" cy="18" r="3.5" fill={color} style={{ opacity: 0 }} /><path d="M40 30 L40 50 M30 40 L50 40" stroke={color} strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0 }} /><text x="37" y="26" fontSize="7" fill={color} fontFamily="sans-serif" style={{ opacity: 0 }}>N</text></svg>);
};
const IconShield = ({ isActive, color }: { isActive: boolean; color: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => { if (!ref.current) return; gsap.to(ref.current.querySelectorAll('path, rect'), { opacity: isActive ? 1 : 0, duration: 1, stagger: 0.15, ease: 'expo.out' }); }, [isActive]);
  return (<svg ref={ref} viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true"><GlowFilter id="ig3" /><path d="M40 8 L65 18 L65 42 Q65 62 40 72 Q15 62 15 42 L15 18 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" filter="url(#ig3)" style={{ opacity: 0 }} /><rect x="34" y="40" width="12" height="10" rx="2" stroke={color} strokeWidth="1.2" style={{ opacity: 0 }} /><path d="M36 40 L36 36 Q36 32 40 32 Q44 32 44 36 L44 40" stroke={color} strokeWidth="1.2" strokeLinecap="round" style={{ opacity: 0 }} /></svg>);
};
const IconArrow = ({ isActive, color }: { isActive: boolean; color: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => { if (!ref.current) return; gsap.to(ref.current.querySelectorAll('path'), { opacity: isActive ? 1 : 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }); }, [isActive]);
  return (<svg ref={ref} viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true"><GlowFilter id="ig4" /><path d="M20 60 L55 25" stroke={color} strokeWidth="2" strokeLinecap="round" filter="url(#ig4)" style={{ opacity: 0 }} /><path d="M42 22 L60 20 L58 36" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#ig4)" style={{ opacity: 0 }} />{(['M14 68 L25 57', 'M8 60 L20 50', 'M2 52 L15 43'] as const).map((d, i) => (<path key={i} d={d} stroke={color} strokeWidth="0.8" strokeLinecap="round" style={{ opacity: 0 }} />))}</svg>);
};
const ICONS = [IconExchange, IconFlight, IconShield, IconArrow];

/* ─── globe canvas (unchanged — no framer deps) ─── */
const GlobeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(1.4);
  const mouseRef = useRef({ dx: 0, dy: 0 });
  const onMouse = useCallback((e: MouseEvent) => { mouseRef.current.dx = ((e.clientX - window.innerWidth * 0.725) / (window.innerWidth * 0.275)) * 0.28; mouseRef.current.dy = ((e.clientY - window.innerHeight * 0.5) / (window.innerHeight * 0.5)) * 0.22; }, []);
  useEffect(() => { if (IS_TOUCH) return; window.addEventListener('mousemove', onMouse, { passive: true }); return () => window.removeEventListener('mousemove', onMouse); }, [onMouse]);
  useEffect(() => {
    if (!canvasRef.current) return;
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { threshold: 0 });
    observer.observe(canvasRef.current);
    const DPR = Math.min(window.devicePixelRatio || 1, 2); const CSS = 760;
    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: DPR, width: CSS * DPR, height: CSS * DPR, phi: 1.4, theta: 0.12, dark: 1, diffuse: 2.8, mapSamples: 24000, mapBrightness: 8.0,
      baseColor: [0.05, 0.09, 0.25], markerColor: [1.0, 0.88, 0.1], glowColor: [0.05, 0.22, 1.0], offset: [0, 0],
      markers: [{ location: [4.711, -74.0721], size: 0.09 }, { location: [40.4168, -3.7038], size: 0.075 }, { location: [25.7617, -80.1918], size: 0.085 }, { location: [19.4326, -99.1332], size: 0.07 }, { location: [51.5074, -0.1278], size: 0.06 }, { location: [40.7128, -74.006], size: 0.07 }, { location: [1.3521, 103.8198], size: 0.055 }, { location: [48.8566, 2.3522], size: 0.055 }, { location: [-34.6037, -58.3816], size: 0.065 }, { location: [-23.5505, -46.6333], size: 0.058 }],
      onRender: (state) => { if (!isVisible) return; phiRef.current += 0.0014; state.phi = phiRef.current + mouseRef.current.dx; state.theta = 0.12 + mouseRef.current.dy; },
    });
    return () => { observer.disconnect(); globeRef.current?.destroy(); };
  }, []);
  const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 2;
  const CSS = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 760;
  return <canvas ref={canvasRef} width={CSS * DPR} height={CSS * DPR} aria-hidden="true" className="will-change-transform w-[120%] md:w-full scale-105 md:scale-100 max-w-none origin-center" style={{ aspectRatio: '1/1', background: 'transparent' }} />;
};

/* ─── orbital rings (pure CSS animation, no framer) ─── */
const OrbitalRings = () => (<div className="absolute inset-0 pointer-events-none" aria-hidden="true"><svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" fill="none"><defs><filter id="gfc-neon" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter><filter id="gfc-soft" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs><circle cx="250" cy="250" r="238" stroke="rgba(40,100,255,0.5)" strokeWidth="1.2" strokeDasharray="8 16" filter="url(#gfc-neon)" style={{ animation: 'spin 40s linear infinite', transformOrigin: 'center' }} /><circle cx="250" cy="250" r="195" stroke="rgba(220,170,40,0.38)" strokeWidth="0.8" strokeDasharray="4 12" filter="url(#gfc-soft)" style={{ animation: 'spin 28s linear infinite reverse', transformOrigin: 'center' }} /><circle cx="250" cy="250" r="150" stroke="rgba(80,140,255,0.38)" strokeWidth="0.8" strokeDasharray="3 9" filter="url(#gfc-neon)" style={{ animation: 'spin 18s linear infinite', transformOrigin: 'center' }} /><circle cx="250" cy="250" r="108" stroke="rgba(255,200,50,0.28)" strokeWidth="0.6" strokeDasharray="2 7" style={{ animation: 'spin 12s linear infinite reverse', transformOrigin: 'center' }} /><circle cx="250" cy="250" r="238" stroke="rgba(80,160,255,0.85)" strokeWidth="2.5" strokeDasharray="100 2400" strokeLinecap="round" filter="url(#gfc-neon)" style={{ animation: 'spin 5s linear infinite', transformOrigin: 'center' }} /></svg></div>);

/* ─── scan line (GSAP infinite) ─── */
const ScanLine = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!ref.current) return; gsap.fromTo(ref.current, { top: '8%' }, { top: '92%', duration: 3.5, repeat: -1, yoyo: true, ease: 'none' }); }, []);
  return <div ref={ref} className="pointer-events-none absolute left-0 right-0 z-30" aria-hidden="true" style={{ height: '1px', background: 'linear-gradient(to right, transparent 5%, rgba(60,120,255,0.5) 35%, rgba(120,180,255,0.8) 50%, rgba(60,120,255,0.5) 65%, transparent 95%)' }} />;
};

/* ─── currency particles (GSAP infinite) ─── */
const PTCLS = [{ s: '$', t: '16%', l: '16%', dur: 7, d: 0 }, { s: '€', t: '68%', l: '10%', dur: 9, d: 2.5 }, { s: '₿', t: '42%', l: '4%', dur: 6, d: 1 }];
const CurrencyParticles = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll('.gfc-ptcl').forEach((el, i) => {
      gsap.to(el, { y: -22, rotate: 5, opacity: 0.11, duration: PTCLS[i].dur / 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: PTCLS[i].d });
    });
  }, []);
  return (<div ref={ref}>{PTCLS.map((p, i) => (<span key={i} className="gfc-ptcl pointer-events-none absolute font-serif select-none z-10" aria-hidden="true" style={{ top: p.t, left: p.l, fontSize: '1.5rem', color: 'rgba(255,255,255,0.06)' }}>{p.s}</span>))}</div>);
};

/* ═════════════════════════════════════════════════════
   MAIN COMPONENT — GSAP ScrollTrigger replaces ALL MotionValue chains
   ═════════════════════════════════════════════════════ */
const GlobalFinancesCard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(-1);
  const scrollToBooking = useScrollToBooking();

  useLayoutEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;
    const ctx = gsap.context(() => {
      const sticky = stickyRef.current!;
      const panels = sticky.querySelectorAll('.gfc-chapter-panel');
      const bgImages = sticky.querySelectorAll('.gfc-bg-image');
      const accentGlows = sticky.querySelectorAll('.gfc-accent-glow');
      const chips = sticky.querySelectorAll('.gfc-floating-chip');
      const dots = sticky.querySelectorAll('.gfc-dot');
      const scrollRailFill = sticky.querySelector('.gfc-scroll-rail-fill') as HTMLElement;
      const headerEl = sticky.querySelector('.gfc-header') as HTMLElement;
      const hintEl = sticky.querySelector('.gfc-scroll-hint') as HTMLElement;
      const globeWrap = sticky.querySelector('.gfc-globe-wrap') as HTMLElement;
      const globeGlow = sticky.querySelector('.gfc-globe-glow') as HTMLElement;
      const globalsLeft = sticky.querySelector('.gfc-globals-left') as HTMLElement;
      const globalsRight = sticky.querySelector('.gfc-globals-right') as HTMLElement;
      const globalsOverlay = sticky.querySelector('.gfc-globals-overlay') as HTMLElement;
      const finaleEl = sticky.querySelector('.gfc-grand-finale') as HTMLElement;
      const finaleContent = sticky.querySelector('.gfc-finale-content') as HTMLElement;
      const finaleBgGlow = sticky.querySelector('.gfc-finale-bg-glow') as HTMLElement;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top', end: 'bottom bottom', scrub: 2.5,
        onUpdate: (self) => {
          const p = self.progress;
          // Header + hint fade out
          if (headerEl) headerEl.style.opacity = String(gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.06, 1, 0, p)));
          if (hintEl) hintEl.style.opacity = String(gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, 0.07, 1, 0, p)));
          // Scroll rail
          if (scrollRailFill) scrollRailFill.style.transform = `scaleY(${gsap.utils.clamp(0, 1, p)})`;
          // Globe glow
          if (globeGlow) globeGlow.style.opacity = String(gsap.utils.interpolate([0.12, 0.28, 0.1], gsap.utils.clamp(0, 1, p < 0.5 ? p * 2 : 1 - (p - 0.5) * 2)));
          // Globe exit + globals fade
          const globalsOp = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.74, 0.82, 1, 0, p));
          if (globalsLeft) globalsLeft.style.opacity = String(globalsOp);
          if (globalsRight) globalsRight.style.opacity = String(globalsOp);
          if (globalsOverlay) globalsOverlay.style.opacity = String(globalsOp);
          if (globeWrap) {
            const gScale = gsap.utils.interpolate(1, 0.5, gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.74, 0.86, 0, 1, p)));
            const gY = gsap.utils.interpolate(0, 300, gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.74, 0.86, 0, 1, p)));
            globeWrap.style.transform = `scale(${gScale}) translateY(${gY}px)`;
          }
          // BG images
          bgImages.forEach((el, i) => {
            const rng = C_RANGES[i]; if (!rng) return;
            const imgOp = gsap.utils.clamp(0, 0.2, gsap.utils.mapRange(rng[0], rng[1], 0, 0.2, p)) - gsap.utils.clamp(0, 0.2, gsap.utils.mapRange(rng[2], rng[3], 0, 0.2, p));
            (el as HTMLElement).style.opacity = String(Math.max(0, imgOp));
          });
          // Accent glows
          accentGlows.forEach((el, i) => {
            const rng = C_RANGES[i]; if (!rng) return;
            let glowOp = 0;
            if (p >= rng[0] && p <= rng[1]) glowOp = gsap.utils.mapRange(rng[0], rng[1], 0, 0.09, p);
            else if (p > rng[1] && p < rng[2]) glowOp = 0.09;
            else if (p >= rng[2] && p <= rng[3]) glowOp = gsap.utils.mapRange(rng[2], rng[3], 0.09, 0, p);
            (el as HTMLElement).style.opacity = String(gsap.utils.clamp(0, 0.09, glowOp));
          });
          // Chapter panels
          let newActive = -1;
          panels.forEach((el, i) => {
            const rng = C_RANGES[i]; if (!rng) return;
            let panelOp = 0;
            if (p >= rng[0] && p <= rng[1]) panelOp = gsap.utils.mapRange(rng[0], rng[1], 0, 1, p);
            else if (p > rng[1] && p < rng[2]) panelOp = 1;
            else if (p >= rng[2] && p <= rng[3]) panelOp = gsap.utils.mapRange(rng[2], rng[3], 1, 0, p);
            panelOp = gsap.utils.clamp(0, 1, panelOp);
            const panelX = gsap.utils.interpolate(-28, 0, gsap.utils.clamp(0, 1, gsap.utils.mapRange(rng[0], rng[1], 0, 1, p)));
            (el as HTMLElement).style.opacity = String(panelOp);
            (el as HTMLElement).style.transform = `translateX(${panelX}px)`;
            if (panelOp > 0.28) newActive = i;
          });
          if (newActive !== activeChapter) setActiveChapter(newActive);
          // Dots
          dots.forEach((el, i) => {
            const rng = C_RANGES[i]; if (!rng) return;
            let dotOp = 0.18, dotScale = 1;
            if (p >= rng[0] && p <= rng[3]) { dotOp = 1; dotScale = 1.8; }
            (el as HTMLElement).style.opacity = String(dotOp);
            (el as HTMLElement).style.transform = `scale(${dotScale})`;
          });
          // Floating chips
          chips.forEach((el) => {
            const he = el as HTMLElement;
            const inStart = parseFloat(he.dataset.instart || '0');
            const inEnd = parseFloat(he.dataset.inend || '0');
            const outStart = parseFloat(he.dataset.outstart || '1');
            const outEnd = parseFloat(he.dataset.outend || '1');
            let chipOp = 0;
            if (p >= inStart && p <= inEnd) chipOp = gsap.utils.mapRange(inStart, inEnd, 0, 1, p);
            else if (p > inEnd && p < outStart) chipOp = 1;
            else if (p >= outStart && p <= outEnd) chipOp = gsap.utils.mapRange(outStart, outEnd, 1, 0, p);
            he.style.opacity = String(gsap.utils.clamp(0, 1, chipOp));
          });
          // Grand finale
          if (finaleEl) {
            const fOp = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.76, 0.88, 0, 1, p));
            const fScale = gsap.utils.interpolate(0.95, 1.05, gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.76, 1, 0, 1, p)));
            const fY = gsap.utils.interpolate(40, 0, gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.76, 0.88, 0, 1, p)));
            finaleEl.style.opacity = String(fOp);
            if (finaleContent) finaleContent.style.transform = `scale(${fScale}) translateY(${fY}px)`;
            if (finaleBgGlow) finaleBgGlow.style.opacity = String(gsap.utils.clamp(0, 0.15, gsap.utils.mapRange(0.76, 1, 0, 0.15, p)));
          }
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [activeChapter]);

  return (
    <section id="finanzas-divisa" ref={sectionRef} className="relative" style={{ height: '550vh' }} aria-label="Finanzas globales — El Compás del Capital Global">
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ background: '#020408' }}>
        {/* noise */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" style={{ backgroundImage: NOISE_URI, backgroundRepeat: 'repeat', backgroundSize: '200px 200px', mixBlendMode: 'overlay', opacity: 0.04 }} />
        {/* bg images */}
        {[0, 1, 2].map(i => (<div key={i} className="gfc-bg-image absolute inset-0 pointer-events-none" style={{ opacity: 0 }}><img src={IMAGES[i]} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover grayscale" /><div className="absolute inset-0 bg-gradient-to-r from-[#020408] via-[#020408]/65 to-[#020408]/35" /><div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-[#020408]" /></div>))}
        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 75% 75% at 55% 50%, transparent 22%, rgba(2,4,8,0.92) 100%)' }} />
        {/* accent glows */}
        {CHAPTERS.map((ch, i) => (<div key={i} className="gfc-accent-glow pointer-events-none absolute inset-y-0 left-0 z-0" aria-hidden="true" style={{ opacity: 0, width: '46%', background: `radial-gradient(ellipse 80% 60% at 20% 50%, rgba(${ch.accentRgb}, 1), transparent 70%)` }} />))}

        {/* two-column grid */}
        <div className="relative z-10 h-full w-full flex flex-col md:grid md:grid-cols-[45%_55%]">
          {/* LEFT */}
          <div className="gfc-globals-left relative h-[40%] md:h-full overflow-hidden shrink-0 mt-20 md:mt-0">
            <div className="gfc-header pointer-events-none absolute top-10 left-0 w-full flex items-center justify-between px-8 md:px-16 lg:px-20 z-40"><span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/20">El Compás del Capital Global</span><span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/20">Amanda Cruz · AXIA</span></div>
            <CurrencyParticles />
            {CHAPTERS.map((ch, i) => {
              const Icon = ICONS[ch.index];
              const isActive = activeChapter === i;
              return (
                <div key={i} className="gfc-chapter-panel absolute inset-y-0 left-0 w-full flex flex-col justify-center pl-6 md:pl-16 lg:pl-20 pr-6 pointer-events-none mt-10 md:mt-0" style={{ opacity: 0 }}>
                  <div aria-hidden="true" className="absolute right-0 bottom-0 pointer-events-none select-none z-0 font-serif italic text-white transition-opacity duration-800" style={{ fontSize: '22vw', lineHeight: 0.85, opacity: isActive ? 0.04 : 0 }}>{ch.ghostNum}</div>
                  <span aria-hidden="true" className="absolute top-12 right-6 font-mono text-[7px] tracking-[0.3em] uppercase text-white/15 transition-opacity duration-600" style={{ opacity: isActive ? 1 : 0 }}>CAP {ch.ghostNum} / 04</span>
                  <div className="mb-5 transition-all duration-500" style={{ transform: isActive ? 'scale(1)' : 'scale(0.82)', opacity: isActive ? 1 : 0 }}><Icon isActive={isActive} color={ch.accent} /></div>
                  <CharEyebrow text={ch.eyebrow} isActive={isActive} color={ch.accent} />
                  <WordTitle lines={ch.title} isActive={isActive} />
                  {ch.stat && (<div className="mb-5 transition-all duration-500" style={{ perspective: 600, transform: isActive ? 'rotateX(0) translateY(0) scale(1)' : 'rotateX(58deg) translateY(20px) scale(0.93)', opacity: isActive ? 1 : 0 }}><AnimCounter target={ch.stat.value} suffix={ch.stat.suffix} /><p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/28 font-sans">{ch.stat.label}</p></div>)}
                  <p className="font-sans font-light text-white leading-relaxed mb-4 md:mb-7 transition-opacity duration-500" style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)', maxWidth: '40ch', opacity: isActive ? 0.75 : 0.35 }}>{ch.body}</p>
                  <div style={{ height: '1px', background: ch.accent, width: '48px', transform: isActive ? 'scaleX(1)' : 'scaleX(0)', opacity: isActive ? 0.35 : 0, transformOrigin: 'left', transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
                </div>
              );
            })}
            <div className="gfc-scroll-hint pointer-events-none absolute bottom-10 left-[22.5%] -translate-x-1/2 z-40 flex flex-col items-center gap-2" aria-hidden="true"><span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/25">Scroll para explorar</span><svg className="w-4 h-4 text-white/20 gfc-scroll-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </div>
          {/* RIGHT */}
          <div className="gfc-globals-right relative h-[60%] md:h-full flex items-center justify-center overflow-visible">
            <div className="gfc-globe-glow pointer-events-none absolute" aria-hidden="true" style={{ opacity: 0.12 }}><div style={{ width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, hsl(220 100% 55% / 1), transparent 65%)', filter: 'blur(110px)' }} /></div>
            <div aria-hidden="true" className="absolute" style={{ width: 760, height: 760, borderRadius: '50%', background: 'radial-gradient(circle, #010310 40%, #020510 70%, transparent 100%)', zIndex: 1, maxWidth: '100%' }} />
            <div aria-hidden="true" className="absolute" style={{ width: 780, height: 780, zIndex: 5, maxWidth: '100%' }}><OrbitalRings /></div>
            <div className="gfc-globe-wrap relative will-change-transform" style={{ zIndex: 20 }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: '-2px', borderRadius: '50%', boxShadow: '0 0 0 1.5px rgba(40,100,255,0.55), 0 0 35px 8px rgba(30,80,255,0.32), 0 0 110px 28px rgba(20,60,220,0.18), 0 0 260px 55px rgba(10,40,200,0.1)', pointerEvents: 'none', zIndex: 25 }} />
              <GlobeCanvas />
              <div className="absolute rounded-full overflow-hidden" style={{ inset: '3%', zIndex: 26 }}><ScanLine /></div>
            </div>
            {/* chips */}
            <div className="gfc-floating-chip absolute z-30" style={{ top: '24%', left: '2%', opacity: 0 }} data-instart={C_RANGES[0][0]} data-inend={C_RANGES[0][1]} data-outstart={C_RANGES[0][2]} data-outend={C_RANGES[0][3]}><div className="gfc-chip-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: 10, padding: '8px 14px' }}><span className="font-sans font-semibold text-sm text-white tracking-widest block">USD · EUR · COP</span><span className="text-[10px] text-white/32 font-sans tracking-wider block mt-0.5">Divisas bajo gestión</span></div></div>
            <div className="gfc-floating-chip absolute z-30" style={{ bottom: '28%', left: '2%', opacity: 0 }} data-instart={C_RANGES[1][0] + 0.04} data-inend={C_RANGES[1][1] + 0.04} data-outstart={C_RANGES[1][2]} data-outend={C_RANGES[1][3]}><div className="gfc-chip-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: 10, padding: '8px 14px' }}><span className="font-sans font-semibold text-sm text-white tracking-widest block">10+ Ciudades</span><span className="text-[10px] text-white/32 font-sans tracking-wider block mt-0.5">Presencia global</span></div></div>
            <div className="gfc-floating-chip absolute z-30" style={{ top: '16%', right: '4%', opacity: 0 }} data-instart={C_RANGES[1][0] + 0.08} data-inend={C_RANGES[1][1] + 0.08} data-outstart={C_RANGES[1][2]} data-outend={C_RANGES[1][3]}><div className="gfc-chip-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: 10, padding: '8px 14px' }}><span className="font-sans font-semibold text-sm text-white tracking-widest block">AXIA Network</span><span className="text-[10px] text-white/32 font-sans tracking-wider block mt-0.5">Red internacional</span></div></div>
            <div className="gfc-floating-chip absolute z-30" style={{ top: '20%', right: '4%', opacity: 0 }} data-instart={C_RANGES[2][0]} data-inend={C_RANGES[2][1]} data-outstart={C_RANGES[2][2]} data-outend={C_RANGES[2][3]}><div className="gfc-chip-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: 10, padding: '8px 14px' }}><span className="font-sans font-semibold text-sm text-white tracking-widest block">24+ Años</span><span className="text-[10px] text-white/32 font-sans tracking-wider block mt-0.5">Experiencia comprobada</span></div></div>
            <div className="gfc-floating-chip absolute z-30" style={{ bottom: '26%', right: '2%', opacity: 0 }} data-instart={C_RANGES[2][0] + 0.06} data-inend={C_RANGES[2][1] + 0.06} data-outstart={C_RANGES[2][2]} data-outend={C_RANGES[2][3]}><div className="gfc-chip-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', borderRadius: 10, padding: '8px 14px' }}><span className="font-sans font-semibold text-sm text-white tracking-widest block">J.P. Morgan · BlackRock</span><span className="text-[10px] text-white/32 font-sans tracking-wider block mt-0.5">Acceso institucional</span></div></div>
          </div>
        </div>

        {/* overlay elements */}
        <div className="gfc-globals-overlay pointer-events-none absolute inset-0 z-40">
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 mt-20">
            <div className="w-px h-20 bg-white/10 relative overflow-hidden rounded-full"><div className="gfc-scroll-rail-fill absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-700 rounded-full origin-top" style={{ transform: 'scaleY(0)' }} /></div>
            <span className="text-[8px] uppercase tracking-[0.35em] text-white/18 font-sans" style={{ writingMode: 'vertical-rl' }}>scroll</span>
          </div>
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
            {C_RANGES.map((_, i) => (<div key={i} className="gfc-dot rounded-full bg-white transition-all duration-300" style={{ width: 4, height: 4, opacity: 0.18 }} />))}
          </div>
        </div>

        {/* Grand Finale */}
        <div className="gfc-grand-finale absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden" style={{ opacity: 0 }}>
          <div className="gfc-finale-bg-glow absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,211,102,1)_0%,transparent_60%)] pointer-events-none mix-blend-screen" style={{ opacity: 0 }} />
          <div className="gfc-finale-content relative z-10 flex flex-col items-center text-center px-4">
            <h2 className="font-serif italic text-white leading-[0.9] tracking-tight mb-8" style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }} aria-label="Comienza tu camino hoy">Comienza tu<br />camino hoy</h2>
            <p className="font-sans font-light text-white/70 max-w-xl mx-auto mb-12 text-center leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}>Una conversación cambia todo. Sesión de 30 minutos sin costo. Descubre el plan exacto que tu patrimonio merece.</p>
            <div className="pointer-events-auto">
              <button onClick={scrollToBooking} className="group relative flex items-center gap-6 rounded-[2rem] overflow-hidden hover:scale-105 active:scale-95 transition-transform" style={{ padding: '20px 48px', background: 'rgba(2,4,8,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="absolute inset-0 backdrop-blur-2xl -z-10 bg-gradient-to-r from-white/[0.03] to-white/[0.08]" />
                <span className="font-sans font-medium text-lg tracking-widest text-white uppercase flex items-center gap-3">
                  <svg className="w-6 h-6 shrink-0 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Agendar Sesión
                </span>
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center -mr-2"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              </button>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent z-50" />
      </div>
    </section>
  );
};

export default GlobalFinancesCard;