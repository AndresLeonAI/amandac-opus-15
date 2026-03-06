import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useSpring, useMotionValue,
  useMotionTemplate, animate, useInView, type MotionValue,
} from 'framer-motion';
import createGlobe from 'cobe';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

/* ─── constants ─────────────────────────────────────────── */
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SILK: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const IMAGES = [
  'https://ik.imagekit.io/jsaisu64x/A_vertical_architectural_2k_202602051906.jpeg',
  'https://ik.imagekit.io/jsaisu64x/A_wide_panoramic_2k_202602051902.jpeg',
  'https://ik.imagekit.io/jsaisu64x/A_closeup_interior_2k_202602051907.jpeg',
];
const NOISE_URI = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'256\' height=\'256\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/><feColorMatrix type=\'saturate\' values=\'0\'/></filter><rect width=\'256\' height=\'256\' filter=\'url(#n)\' opacity=\'1\'/></svg>')}")`;

/* chapter scroll ranges [start, peakIn, peakOut, end] */
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
  {
    index: 0, eyebrow: '01 — Divisas', title: ['Finanzas en', 'cualquier divisa'],
    body: 'Domine el tipo de cambio como ventaja estratégica. Un sistema claro para manejar USD, EUR, COP y más — con reglas precisas para cada flujo.',
    accent: 'hsl(218 100% 68%)', accentRgb: '60,120,255', ghostNum: '01',
    stat: { value: 4, suffix: '+', label: 'Divisas activas bajo gestión' }, image: IMAGES[0]
  },
  {
    index: 1, eyebrow: '02 — Geografía', title: ['Libertad', 'geográfica'],
    body: 'Sin fronteras para tu patrimonio. Planificamos el movimiento de activos entre jurisdicciones con máxima eficiencia fiscal — de Colombia a Europa, Miami o Singapur.',
    accent: 'hsl(44 90% 62%)', accentRgb: '230,170,40', ghostNum: '02',
    stat: { value: 10, suffix: '+', label: 'Ciudades de presencia global' }, image: IMAGES[1]
  },
  {
    index: 2, eyebrow: '03 — Protección', title: ['Protección', 'patrimonial'],
    body: 'Estructuras resilientes que preservan y multiplican, con blindaje ante cualquier volatilidad del mercado. 24 años diseñando escudos financieros.',
    accent: 'hsl(350 80% 65%)', accentRgb: '220,60,80', ghostNum: '03',
    stat: { value: 24, suffix: '+', label: 'Años protegiendo patrimonios' }, image: IMAGES[2]
  }
];

/* ─── animated counter ─────────────────────────────────── */
const AnimCounter = ({ target, suffix = '', duration = 2.4 }: { target: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, target, { duration, ease: SILK, onUpdate: v => setDisplay(Math.round(v)) });
    return () => c.stop();
  }, [inView, target, duration, mv]);
  return (
    <span ref={ref}>
      <span className="font-serif italic text-5xl md:text-7xl bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent tabular-nums">{display}</span>
      <span className="text-primary text-4xl md:text-6xl font-serif ml-1">{suffix}</span>
    </span>
  );
};

/* ─── char-stagger eyebrow ─────────────────────────────── */
const CharEyebrow = ({ text, isActive, color }: { text: string; isActive: boolean; color: string }) => (
  <motion.div className="flex flex-wrap text-[10px] uppercase tracking-[0.45em] font-sans font-semibold mb-5"
    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.018 } } }}
    initial="hidden" animate={isActive ? 'visible' : 'hidden'} aria-label={text}>
    <span aria-hidden="true" className="flex flex-wrap">
      {text.split('').map((ch, i) => (
        <motion.span key={i} style={{ color, display: 'inline-block' }}
          variants={{ hidden: { y: '100%', opacity: 0 }, visible: { y: '0%', opacity: 1, transition: { duration: 0.3, ease: EXPO } } }}>
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  </motion.div>
);

/* ─── word-stagger title ────────────────────────────────── */
const WordTitle = ({ lines, isActive }: { lines: string[]; isActive: boolean }) => (
  <h2 className="font-serif italic text-white mb-5 leading-[0.90] tracking-tight" style={{ fontSize: 'clamp(2.8rem, 5vw, 5.4rem)' }} aria-label={lines.join(' ')}>
    <span aria-hidden="true">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((word, wi) => (
            <span key={wi} className="inline-block overflow-hidden mr-[0.25em] pr-4 pb-2 -mr-4 -mb-2">
              <motion.span className="inline-block"
                variants={{ hidden: { y: '110%', opacity: 0, rotate: 2 }, visible: { y: '0%', opacity: 1, rotate: 0 } }}
                initial="hidden" animate={isActive ? 'visible' : 'hidden'}
                transition={{ duration: 0.72, ease: EXPO, delay: li * 0.14 + wi * 0.07 }}>
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </span>
  </h2>
);

/* ─── SVG chapter icons (path-draw) ───────────────────── */
const GlowFilter = ({ id }: { id: string }) => (
  <defs>
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const IconExchange = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <svg viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true">
    <GlowFilter id="ig1" />
    <motion.path d="M18 42 Q20 18 52 18" stroke={color} strokeWidth="1.4" strokeLinecap="round" filter="url(#ig1)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.0, ease: EXPO, delay: 0.1 }} />
    <motion.path d="M47 13 L56 18 L48 23" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.4, ease: EXPO, delay: 0.82 }} />
    <motion.path d="M62 38 Q60 62 28 62" stroke={color} strokeWidth="1.4" strokeLinecap="round" filter="url(#ig1)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.0, ease: EXPO, delay: 0.4 }} />
    <motion.path d="M33 67 L24 62 L32 57" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.4, ease: EXPO, delay: 1.1 }} />
    <motion.text x="10" y="46" fontSize="12" fill={color} fontFamily="serif"
      animate={{ opacity: isActive ? 0.85 : 0 }} transition={{ duration: 0.4, delay: 0.9 }}>$</motion.text>
    <motion.text x="57" y="36" fontSize="12" fill={color} fontFamily="serif"
      animate={{ opacity: isActive ? 0.85 : 0 }} transition={{ duration: 0.4, delay: 1.1 }}>€</motion.text>
  </svg>
);

const IconFlight = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <svg viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true">
    <GlowFilter id="ig2" />
    <motion.path d="M14 62 Q30 22 66 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" filter="url(#ig2)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.85 : 0 }}
      transition={{ duration: 1.3, ease: EXPO, delay: 0.1 }} />
    <motion.circle cx="14" cy="62" r="3.5" fill={color}
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.8 }} />
    <motion.circle cx="66" cy="18" r="3.5" fill={color}
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 1.1 }} />
    <motion.path d="M40 30 L40 50 M30 40 L50 40" stroke={color} strokeWidth="0.8" strokeLinecap="round"
      animate={{ opacity: isActive ? 0.4 : 0 }} transition={{ duration: 0.4, delay: 1.2 }} />
    <motion.text x="37" y="26" fontSize="7" fill={color} fontFamily="sans-serif"
      animate={{ opacity: isActive ? 0.5 : 0 }} transition={{ duration: 0.3, delay: 1.3 }}>N</motion.text>
  </svg>
);

const IconShield = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <svg viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true">
    <GlowFilter id="ig3" />
    <motion.path d="M40 8 L65 18 L65 42 Q65 62 40 72 Q15 62 15 42 L15 18 Z"
      stroke={color} strokeWidth="1.5" strokeLinejoin="round" filter="url(#ig3)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.4, ease: EXPO, delay: 0.1 }} />
    <motion.rect x="34" y="40" width="12" height="10" rx="2" stroke={color} strokeWidth="1.2"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.9 : 0 }}
      transition={{ duration: 0.5, ease: EXPO, delay: 1.0 }} />
    <motion.path d="M36 40 L36 36 Q36 32 40 32 Q44 32 44 36 L44 40"
      stroke={color} strokeWidth="1.2" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.9 : 0 }}
      transition={{ duration: 0.5, ease: EXPO, delay: 1.25 }} />
  </svg>
);

const IconArrow = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <svg viewBox="0 0 80 80" width="68" height="68" fill="none" aria-hidden="true">
    <GlowFilter id="ig4" />
    <motion.path d="M20 60 L55 25" stroke={color} strokeWidth="2" strokeLinecap="round" filter="url(#ig4)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8, ease: EXPO, delay: 0.1 }} />
    <motion.path d="M42 22 L60 20 L58 36" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#ig4)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EXPO, delay: 0.7 }} />
    {(['M14 68 L25 57', 'M8 60 L20 50', 'M2 52 L15 43'] as const).map((d, i) => (
      <motion.path key={i} d={d} stroke={color} strokeWidth="0.8" strokeLinecap="round"
        animate={{ opacity: isActive ? 0.4 : 0 }} transition={{ duration: 0.3, delay: 0.9 + i * 0.08 }} />
    ))}
  </svg>
);

const ICONS = [IconExchange, IconFlight, IconShield, IconArrow];

/* ─── globe canvas ─────────────────────────────────────── */
const GlobeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(1.4);
  const mouseRef = useRef({ dx: 0, dy: 0 });
  const onMouse = useCallback((e: MouseEvent) => {
    mouseRef.current.dx = ((e.clientX - window.innerWidth * 0.725) / (window.innerWidth * 0.275)) * 0.28;
    mouseRef.current.dy = ((e.clientY - window.innerHeight * 0.5) / (window.innerHeight * 0.5)) * 0.22;
  }, []);
  useEffect(() => { window.addEventListener('mousemove', onMouse, { passive: true }); return () => window.removeEventListener('mousemove', onMouse); }, [onMouse]);
  useEffect(() => {
    if (!canvasRef.current) return;
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { threshold: 0 });
    observer.observe(canvasRef.current);

    const DPR = Math.min(window.devicePixelRatio || 1, 2); const CSS = 760;
    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: DPR, width: CSS * DPR, height: CSS * DPR,
      phi: 1.4, theta: 0.12, dark: 1, diffuse: 2.8, mapSamples: 24000, mapBrightness: 8.0,
      baseColor: [0.05, 0.09, 0.25] as [number, number, number],
      markerColor: [1.0, 0.88, 0.1] as [number, number, number],
      glowColor: [0.05, 0.22, 1.0] as [number, number, number],
      offset: [0, 0],
      markers: [
        { location: [4.711, -74.0721], size: 0.09 }, { location: [40.4168, -3.7038], size: 0.075 },
        { location: [25.7617, -80.1918], size: 0.085 }, { location: [19.4326, -99.1332], size: 0.07 },
        { location: [51.5074, -0.1278], size: 0.06 }, { location: [40.7128, -74.006], size: 0.07 },
        { location: [1.3521, 103.8198], size: 0.055 }, { location: [48.8566, 2.3522], size: 0.055 },
        { location: [-34.6037, -58.3816], size: 0.065 }, { location: [-23.5505, -46.6333], size: 0.058 },
      ],
      onRender: (state) => {
        if (!isVisible) return; // Viewport Culling!
        phiRef.current += 0.0014;
        state.phi = phiRef.current + mouseRef.current.dx;
        state.theta = 0.12 + mouseRef.current.dy;
      },
    });
    return () => { observer.disconnect(); globeRef.current?.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 2;
  // Make CSS size responsive to window width
  const CSS = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 760;
  return <canvas ref={canvasRef} width={CSS * DPR} height={CSS * DPR} aria-hidden="true" className="will-change-transform w-[120%] md:w-full scale-105 md:scale-100 max-w-none origin-center" style={{ aspectRatio: '1/1', background: 'transparent' }} />;
};

/* ─── orbital rings (neon upgraded) ───────────────────── */
const OrbitalRings = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" fill="none">
      <defs>
        <filter id="gfc-neon" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gfc-soft" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="250" cy="250" r="238" stroke="rgba(40,100,255,0.5)" strokeWidth="1.2" strokeDasharray="8 16" filter="url(#gfc-neon)" style={{ animation: 'spin 40s linear infinite', transformOrigin: 'center' }} />
      <circle cx="250" cy="250" r="195" stroke="rgba(220,170,40,0.38)" strokeWidth="0.8" strokeDasharray="4 12" filter="url(#gfc-soft)" style={{ animation: 'spin 28s linear infinite reverse', transformOrigin: 'center' }} />
      <circle cx="250" cy="250" r="150" stroke="rgba(80,140,255,0.38)" strokeWidth="0.8" strokeDasharray="3 9" filter="url(#gfc-neon)" style={{ animation: 'spin 18s linear infinite', transformOrigin: 'center' }} />
      <circle cx="250" cy="250" r="108" stroke="rgba(255,200,50,0.28)" strokeWidth="0.6" strokeDasharray="2 7" style={{ animation: 'spin 12s linear infinite reverse', transformOrigin: 'center' }} />
      {/* Bright radar arc */}
      <circle cx="250" cy="250" r="238" stroke="rgba(80,160,255,0.85)" strokeWidth="2.5" strokeDasharray="100 2400" strokeLinecap="round" filter="url(#gfc-neon)" style={{ animation: 'spin 5s linear infinite', transformOrigin: 'center' }} />
    </svg>
  </div>
);

/* ─── scan line (radar sweep) ──────────────────────────── */
const ScanLine = () => (
  <motion.div className="pointer-events-none absolute left-0 right-0 z-30" aria-hidden="true"
    style={{ height: '1px', background: 'linear-gradient(to right, transparent 5%, rgba(60,120,255,0.5) 35%, rgba(120,180,255,0.8) 50%, rgba(60,120,255,0.5) 65%, transparent 95%)' }}
    animate={{ top: ['8%', '92%'] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }} />
);

/* ─── currency particles ───────────────────────────────── */
const PTCLS = [{ s: '$', t: '16%', l: '16%', dur: 7, d: 0 }, { s: '€', t: '68%', l: '10%', dur: 9, d: 2.5 }, { s: '₿', t: '42%', l: '4%', dur: 6, d: 1 }];
const CurrencyParticles = () => (
  <>{PTCLS.map((p, i) => (
    <motion.span key={i} aria-hidden="true" className="pointer-events-none absolute font-serif select-none z-10"
      style={{ top: p.t, left: p.l, fontSize: '1.5rem', color: 'rgba(255,255,255,0.06)' }}
      animate={{ y: [0, -22, 0], rotate: [0, 5, -3, 0], opacity: [0.04, 0.11, 0.04] }}
      transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.d }} >
      {p.s}
    </motion.span>
  ))}</>
);

/* ─── per-chapter accent glow (left column) ────────────── */
const AccentGlowLayer = ({ progress, range, rgb }: { progress: MotionValue<number>; range: readonly [number, number, number, number]; rgb: string }) => {
  const op = useSpring(useTransform(progress, [...range], [0, 0.09, 0.09, 0]), { stiffness: 35, damping: 18 });
  return <motion.div className="pointer-events-none absolute inset-y-0 left-0 z-0" aria-hidden="true"
    style={{ opacity: op, width: '46%', background: `radial - gradient(ellipse 80 % 60 % at 20 % 50 %, rgba(${rgb}, 1), transparent 70 %)` }} />;
};

/* ─── background editorial image ──────────────────────── */
const BgImage = ({ src, progress, inR, outR }: { src: string; progress: MotionValue<number>; inR: [number, number]; outR: [number, number] }) => {
  const op = useSpring(useTransform(progress, [inR[0], inR[1], outR[0], outR[1]], [0, 0.2, 0.2, 0]), { stiffness: 40, damping: 20 });
  const scale = useTransform(progress, [inR[0], outR[1]], [1.06, 1.0]);
  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: op }}>
      <motion.img src={src} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover grayscale" style={{ scale }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020408] via-[#020408]/65 to-[#020408]/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-[#020408]" />
    </motion.div>
  );
};

/* ─── floating chip ────────────────────────────────────── */
const FloatingChip = ({ label, sub, top, left, right, bottom, progress, inR, outR, delay = 0 }: {
  label: string; sub: string; top?: string; left?: string; right?: string; bottom?: string;
  progress: MotionValue<number>; inR: [number, number]; outR: [number, number]; delay?: number;
}) => {
  const op = useSpring(useTransform(progress, [inR[0] + delay, inR[1] + delay, outR[0], outR[1]], [0, 1, 1, 0]), { stiffness: 50, damping: 20 });
  const y = useSpring(useTransform(progress, [inR[0] + delay, inR[1] + delay], [20, 0]), { stiffness: 50, damping: 22 });
  return (
    <motion.div style={{ opacity: op, y, position: 'absolute', top, left, right, bottom, zIndex: 30 }}>
      <motion.div animate={{ boxShadow: ['0 0 0px 0px rgba(255,255,255,0)', '0 0 14px 2px rgba(255,255,255,0.12)', '0 0 0px 0px rgba(255,255,255,0)'] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '10px', padding: '8px 14px' }}>
        <span className="font-sans font-semibold text-sm text-white tracking-widest block">{label}</span>
        <span className="text-[10px] text-white/32 font-sans tracking-wider block mt-0.5">{sub}</span>
      </motion.div>
    </motion.div>
  );
};

/* ─── chapter panel ────────────────────────────────────── */
const ChapterPanel = ({ data, progress, rng }: { data: ChapterData; progress: MotionValue<number>; rng: readonly [number, number, number, number] }) => {
  const [active, setActive] = useState(false);
  const op = useSpring(useTransform(progress, [...rng], [0, 1, 1, 0]), { stiffness: 55, damping: 22 });
  const x = useSpring(useTransform(progress, [rng[0], rng[1]], [-28, 0]), { stiffness: 55, damping: 22 });
  const blurPx = useSpring(useTransform(progress, [rng[0], rng[1]], [12, 0]), { stiffness: 55, damping: 22 });
  const blurFilter = useMotionTemplate`blur(${blurPx}px)`;
  const bodyOp = useTransform(progress, [rng[1], rng[2]], [0.35, 0.75]);

  useEffect(() => {
    return (op as MotionValue<number>).on('change', (v: number) => setActive(v > 0.28));
  }, [op]);

  const Icon = ICONS[data.index];

  return (
    <motion.div style={{ opacity: op, x, filter: blurFilter }}
      className="absolute inset-y-0 left-0 w-full flex flex-col justify-center pl-6 md:pl-16 lg:pl-20 pr-6 pointer-events-none mt-10 md:mt-0">
      {/* ghost chapter number */}
      <motion.div aria-hidden="true" animate={{ opacity: active ? 0.04 : 0 }} transition={{ duration: 0.8 }}
        className="absolute right-0 bottom-0 pointer-events-none select-none z-0 font-serif italic text-white"
        style={{ fontSize: '22vw', lineHeight: 0.85, userSelect: 'none' }}>
        {data.ghostNum}
      </motion.div>
      {/* editorial label top-right */}
      <motion.span aria-hidden="true" animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.6 }}
        className="absolute top-12 right-6 font-mono text-[7px] tracking-[0.3em] uppercase text-white/15">
        CAP {data.ghostNum} / 04
      </motion.span>
      {/* icon */}
      <motion.div className="mb-5" animate={{ scale: active ? 1 : 0.82, opacity: active ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.05 }}>
        <Icon isActive={active} color={data.accent} />
      </motion.div>
      {/* eyebrow char stagger */}
      <CharEyebrow text={data.eyebrow} isActive={active} color={data.accent} />
      {/* title word stagger */}
      <WordTitle lines={data.title} isActive={active} />
      {/* stat 3D pop-in */}
      {data.stat && (
        <motion.div className="mb-5" style={{ perspective: 600 }}
          animate={active ? { rotateX: 0, y: 0, opacity: 1, scale: 1 } : { rotateX: 58, y: 20, opacity: 0, scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 78, damping: 16, delay: active ? 0.35 : 0 }}>
          <AnimCounter target={data.stat.value} suffix={data.stat.suffix} />
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/28 font-sans">{data.stat.label}</p>
        </motion.div>
      )}
      {/* body — scroll-opacity wipe */}
      <motion.p className="font-sans font-light text-white leading-relaxed mb-4 md:mb-7"
        style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)', maxWidth: '40ch', opacity: bodyOp }}>
        {data.body}
      </motion.p>
      {/* accent rule draw */}
      <motion.div style={{ height: '1px', background: data.accent, originX: 0 }} className="w-12"
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 0.35 : 0 }}
        transition={{ duration: 0.8, ease: SILK, delay: active ? 0.5 : 0 }} />
    </motion.div>
  );
};

/* ─── the grand finale (chapter 4 center out) ──────────── */
const GrandFinale = ({ progress }: { progress: MotionValue<number> }) => {
  const [active, setActive] = useState(false);
  const P_START = 0.76;
  const P_PEAK = 0.88;

  const op = useSpring(useTransform(progress, [P_START, P_PEAK], [0, 1]), { stiffness: 50, damping: 20 });
  const scale = useSpring(useTransform(progress, [P_START, 1], [0.95, 1.05]), { stiffness: 40, damping: 30 });
  const y = useSpring(useTransform(progress, [P_START, P_PEAK], [40, 0]), { stiffness: 50, damping: 20 });
  const blurPx = useSpring(useTransform(progress, [P_START, P_PEAK], [20, 0]), { stiffness: 50, damping: 20 });
  const bgGlowOp = useSpring(useTransform(progress, [P_START, 1], [0, 0.15]), { stiffness: 40, damping: 20 });

  useEffect(() => {
    return (progress as MotionValue<number>).on('change', (v: number) => setActive(v > P_START + 0.04));
  }, [progress]);

  const words = ['Comienza', 'tu', 'camino', 'hoy'];
  const scrollToBooking = useScrollToBooking();

  return (
    <motion.div style={{ opacity: op }} className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
      {/* massive green aura behind text */}
      <motion.div aria-hidden style={{ opacity: bgGlowOp }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,211,102,1)_0%,transparent_60%)] pointer-events-none mix-blend-screen" />

      <motion.div style={{ scale, y, filter: useMotionTemplate`blur(${blurPx}px)` }} className="relative z-10 flex flex-col items-center text-center px-4">

        {/* massive typography split text */}
        <h2 className="font-serif italic text-white leading-[0.9] tracking-tight mb-8 flex flex-col items-center" style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }} aria-label="Comienza tu camino hoy">
          <span className="flex items-center gap-[0.25em]" aria-hidden="true">
            {words.slice(0, 3).map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pr-4 pb-2 -mr-4 -mb-2">
                <motion.span className="inline-block origin-bottom"
                  variants={{ hidden: { y: '110%', opacity: 0, scale: 0.9, rotateX: 45 }, visible: { y: '0%', opacity: 1, scale: 1, rotateX: 0 } }}
                  initial="hidden" animate={active ? 'visible' : 'hidden'}
                  transition={{ duration: 0.9, ease: EXPO, delay: i * 0.1 }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="flex justify-center mt-2" aria-hidden="true">
            <span className="inline-block overflow-hidden pr-4 pb-2 -mr-4 -mb-2">
              <motion.span className="inline-block origin-bottom"
                variants={{ hidden: { y: '110%', opacity: 0, scale: 0.9, rotateX: 45 }, visible: { y: '0%', opacity: 1, scale: 1, rotateX: 0 } }}
                initial="hidden" animate={active ? 'visible' : 'hidden'}
                transition={{ duration: 1.1, ease: EXPO, delay: 0.35 }}>
                {words[3]}
              </motion.span>
            </span>
          </span>
        </h2>

        {/* subtitle */}
        <motion.p className="font-sans font-light text-white/70 max-w-xl mx-auto mb-12 text-center leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 20 }} animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.2, ease: SILK, delay: 0.6 }}>
          Una conversación cambia todo. Sesión de 30 minutos sin costo. Descubre el plan exacto que tu patrimonio merece.
        </motion.p>

        {/* grand oval CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.8 }} className="pointer-events-auto">
          <motion.button
            onClick={scrollToBooking}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-6 rounded-[2rem] overflow-hidden"
            style={{ padding: '20px 48px', background: 'rgba(2,4,8,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>

            {/* pulsing glass shadow */}
            <motion.div animate={{ boxShadow: ['0 0 0px 0px rgba(37,211,102,0)', '0 0 40px 4px rgba(37,211,102,0.18)', '0 0 0px 0px rgba(37,211,102,0)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-[2rem] pointer-events-none" />

            {/* blur backdrop */}
            <div className="absolute inset-0 backdrop-blur-2xl -z-10 bg-gradient-to-r from-white/[0.03] to-white/[0.08]" />

            <span className="font-sans font-medium text-lg tracking-widest text-white uppercase flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Agendar Sesión
            </span>

            {/* animated arrow */}
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center -mr-2 overflow-hidden relative">
              <motion.svg className="w-5 h-5 absolute"
                initial={{ x: -20, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
              <motion.svg className="w-5 h-5 absolute"
                initial={{ x: 0, opacity: 1 }}
                whileHover={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ─── chapter dot (hooks-safe, no loop) ───────────────── */
const ChapterDot = ({ rng, progress }: { rng: readonly [number, number, number, number]; progress: MotionValue<number> }) => {
  const op = useSpring(useTransform(progress, [...rng], [0.18, 1, 1, 0.18]), { stiffness: 80, damping: 20 });
  const sc = useSpring(useTransform(progress, [rng[0], rng[1]], [1, 1.8]), { stiffness: 80, damping: 20 });
  return <motion.div className="rounded-full bg-white" style={{ width: 4, height: 4, opacity: op, scale: sc }} />;
};
const ProgressDots = ({ progress }: { progress: MotionValue<number> }) => (
  <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
    {C_RANGES.map((r, i) => <ChapterDot key={i} rng={r} progress={progress} />)}
  </div>
);

/* ─── scroll rail ─────────────────────────────────────── */
const ScrollRail = ({ progress }: { progress: MotionValue<number> }) => {
  const scaleY = useSpring(useTransform(progress, [0, 1], [0, 1]), { stiffness: 80, damping: 28 });
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 mt-20">
      <div className="w-px h-20 bg-white/10 relative overflow-hidden rounded-full">
        <motion.div style={{ scaleY, originY: 0 }} className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-700 rounded-full" />
      </div>
      <span className="text-[8px] uppercase tracking-[0.35em] text-white/18 font-sans" style={{ writingMode: 'vertical-rl' }}>scroll</span>
    </div>
  );
};

/* ─── section header ──────────────────────────────────── */
const SectionHeader = ({ progress }: { progress: MotionValue<number> }) => {
  const op = useSpring(useTransform(progress, [0, 0.06], [1, 0]), { stiffness: 60, damping: 20 });
  return (
    <motion.div style={{ opacity: op }} className="pointer-events-none absolute top-10 left-0 w-full flex items-center justify-between px-8 md:px-16 lg:px-20 z-40">
      <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/20">El Compás del Capital Global</span>
      <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/20">Amanda Cruz · AXIA</span>
    </motion.div>
  );
};

/* ─── scroll hint ─────────────────────────────────────── */
const ScrollHint = ({ progress }: { progress: MotionValue<number> }) => {
  const op = useSpring(useTransform(progress, [0, 0.07], [1, 0]), { stiffness: 60, damping: 20 });
  return (
    <motion.div style={{ opacity: op }} aria-hidden className="pointer-events-none absolute bottom-10 left-[22.5%] -translate-x-1/2 z-40 flex flex-col items-center gap-2">
      <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/25">Scroll para explorar</span>
      <motion.svg animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="w-4 h-4 text-white/20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.1">
        <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const GlobalFinancesCard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 80, mass: 3, restDelta: 0.001 });

  // Globe entrance
  const globeScaleEnter = useTransform(smooth, [0, 0.1], [0.88, 1]);
  // Globe exit (Chapter 4 collapse)
  const globeScaleExit = useTransform(smooth, [0.74, 0.86], [1, 0.5]);
  const globeYExit = useTransform(smooth, [0.74, 0.86], [0, 300]);
  const globalsOp = useTransform(smooth, [0.74, 0.82], [1, 0]); // fades out left column elements, rings, etc

  const glowOp = useSpring(useTransform(smooth, [0, 0.5, 1], [0.12, 0.28, 0.1]), { stiffness: 35, damping: 20 });

  return (
    <section id="finanzas-divisa" ref={sectionRef} className="relative" style={{ height: '550vh' }}
      aria-label="Finanzas globales — El Compás del Capital Global">

      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ background: '#020408' }}>

        {/* noise */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true"
          style={{ backgroundImage: NOISE_URI, backgroundRepeat: 'repeat', backgroundSize: '200px 200px', mixBlendMode: 'overlay', opacity: 0.04 }} />

        {/* editorial images */}
        {[0, 1, 2].map(i => (
          <BgImage key={i} src={IMAGES[i]} progress={smooth}
            inR={[C_RANGES[i][0], C_RANGES[i][1]]} outR={[C_RANGES[i][2], C_RANGES[i][3]]} />
        ))}

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 75% 75% at 55% 50%, transparent 22%, rgba(2,4,8,0.92) 100%)' }} />

        {/* per-chapter accent glows (left column) */}
        {CHAPTERS.map((ch, i) => (
          <AccentGlowLayer key={i} progress={smooth} range={C_RANGES[i]} rgb={ch.accentRgb} />
        ))}

        {/* ── two-column grid ── */}
        <div className="relative z-10 h-full w-full flex flex-col md:grid md:grid-cols-[45%_55%]">

          {/* LEFT: text */}
          <div className="relative h-[40%] md:h-full overflow-hidden shrink-0 mt-20 md:mt-0">
            <SectionHeader progress={smooth} />

            <motion.div style={{ opacity: globalsOp }}>
              <CurrencyParticles />
            </motion.div>

            {CHAPTERS.map((ch, i) => (
              <ChapterPanel key={i} data={ch} progress={smooth} rng={C_RANGES[i]} />
            ))}
            <ScrollHint progress={smooth} />
          </div>

          {/* RIGHT: globe */}
          <motion.div style={{ opacity: globalsOp }} className="relative h-[60%] md:h-full flex items-center justify-center overflow-visible">

            {/* ambient glow */}
            <motion.div aria-hidden="true" style={{ opacity: glowOp }}
              className="pointer-events-none absolute"
              css-role="glow"
              {...{} as Record<string, unknown>}
            >
              <div style={{
                width: '800px', height: '800px', borderRadius: '50%',
                background: 'radial-gradient(circle, hsl(220 100% 55% / 1), transparent 65%)',
                filter: 'blur(110px)'
              }} />
            </motion.div>

            {/* dark circular backing (makes neon ring pop) */}
            <div aria-hidden="true" className="absolute" style={{
              width: '760px', height: '760px', borderRadius: '50%',
              background: 'radial-gradient(circle, #010310 40%, #020510 70%, transparent 100%)',
              zIndex: 1, maxWidth: '100%'
            }} />

            {/* orbital rings */}
            <div aria-hidden="true" className="absolute" style={{ width: '780px', height: '780px', zIndex: 5, maxWidth: '100%' }}>
              <OrbitalRings />
            </div>

            {/* globe + neon border */}
            <motion.div style={{ scale: globeScaleExit, y: globeYExit, zIndex: 20 }} className="relative will-change-transform"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, ease: SILK }}>
              {/* neon border ring */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: '-2px', borderRadius: '50%',
                boxShadow: '0 0 0 1.5px rgba(40,100,255,0.55), 0 0 35px 8px rgba(30,80,255,0.32), 0 0 110px 28px rgba(20,60,220,0.18), 0 0 260px 55px rgba(10,40,200,0.1)',
                pointerEvents: 'none', zIndex: 25
              }} />
              <GlobeCanvas />
              {/* scan line overlay */}
              <div className="absolute rounded-full overflow-hidden" style={{ inset: '3%', zIndex: 26 }}>
                <ScanLine />
              </div>
            </motion.div>

            {/* chips */}
            <FloatingChip label="USD · EUR · COP" sub="Divisas bajo gestión" top="24%" left="2%"
              progress={smooth} inR={[C_RANGES[0][0], C_RANGES[0][1]]} outR={[C_RANGES[0][2], C_RANGES[0][3]]} />
            <FloatingChip label="10+ Ciudades" sub="Presencia global" bottom="28%" left="2%"
              progress={smooth} inR={[C_RANGES[1][0], C_RANGES[1][1]]} outR={[C_RANGES[1][2], C_RANGES[1][3]]} delay={0.04} />
            <FloatingChip label="AXIA Network" sub="Red internacional" top="16%" right="4%"
              progress={smooth} inR={[C_RANGES[1][0], C_RANGES[1][1]]} outR={[C_RANGES[1][2], C_RANGES[1][3]]} delay={0.08} />
            <FloatingChip label="24+ Años" sub="Experiencia comprobada" top="20%" right="4%"
              progress={smooth} inR={[C_RANGES[2][0], C_RANGES[2][1]]} outR={[C_RANGES[2][2], C_RANGES[2][3]]} />
            <FloatingChip label="J.P. Morgan · BlackRock" sub="Acceso institucional" bottom="26%" right="2%"
              progress={smooth} inR={[C_RANGES[2][0], C_RANGES[2][1]]} outR={[C_RANGES[2][2], C_RANGES[2][3]]} delay={0.06} />
          </motion.div>
        </div>

        <motion.div style={{ opacity: globalsOp }} className="pointer-events-none absolute inset-0 z-40">
          <ScrollRail progress={smooth} />
          <ProgressDots progress={smooth} />
        </motion.div>

        {/* GRAND FINALE ABSOLUTE OVERLAY */}
        <GrandFinale progress={smooth} />

        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent z-50" />
      </div>
    </section>
  );
};

export default GlobalFinancesCard;