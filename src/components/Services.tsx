import React, { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// --- Assets & Styles Injection ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    
    :root {
      --font-sans: 'Inter', sans-serif;
      --font-serif: 'Playfair Display', serif;
    }

    .font-serif { font-family: var(--font-serif); }
    .font-sans { font-family: var(--font-sans); }
    .hairline { height: 1px; background-color: rgba(255,255,255,0.15); width: 100%; }
  `}</style>
);

// --- Custom Cursor (GSAP, gated by pointer) ---
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (IS_TOUCH || !cursorRef.current) return;
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.5, ease: 'expo.out' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.5, ease: 'expo.out' });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor, { passive: true });
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (IS_TOUCH) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 rounded-full bg-white mix-blend-difference will-change-transform"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
};

// --- MaskedText (GSAP ScrollTrigger) ---
const MaskedText = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={`overflow-hidden block ${className}`}>
      <span className="block origin-top-left masked-text-inner" style={{ opacity: 0, transform: 'translateY(100%)' }}>
        {children}
      </span>
    </span>
  );
};

// LEVEL 1: ESTRATEGIA (Intro)
const CanonLevel1_Intro = () => {
  return (
    <article className="services-level services-level-1 absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-8 md:px-20 z-20">
      <div className="absolute top-12 left-0 w-full px-8 md:px-12 flex justify-between items-center opacity-60">
        <span className="font-sans text-xs tracking-[0.2em] uppercase">Private Wealth</span>
        <span className="font-sans text-xs tracking-[0.2em] uppercase">Est. 2026</span>
      </div>

      <div className="text-center z-10 w-full max-w-5xl services-skew-target">
        <h1
          className="font-serif text-white tracking-tight leading-[1] md:leading-[0.95]"
          style={{ fontSize: "clamp(2.5rem, 12vw, 9rem)" }}
        >
          <MaskedText>
            <span className="italic font-light opacity-80 block md:inline">Diseño de</span>
          </MaskedText>
          <MaskedText>
            Estrategia Personal
          </MaskedText>
        </h1>

        <div className="mt-12 flex flex-col items-center">
          <div className="w-[1px] h-16 bg-white/20 mb-8" />
          <MaskedText>
            <p className="font-sans text-sm md:text-base text-white/70 max-w-md leading-relaxed tracking-wide">
              Más allá de la gestión de activos. <br />
              Arquitectura financiera para la vida que quieres vivir.
            </p>
          </MaskedText>
        </div>
      </div>
    </article>
  );
};

// LEVEL 2: INVERSIONES (Editorial Spread)
const CanonLevel2_Investments = () => {
  return (
    <article className="services-level services-level-2 absolute inset-0 flex items-center pointer-events-none" style={{ opacity: 0 }}>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-4 sm:px-8 md:pl-24 md:pr-12 bg-[#050505]/90 md:bg-[#050505] z-10 h-full">
          <div className="services-skew-target">
            <span className="font-sans text-[10px] md:text-xs text-stone-400 tracking-[0.2em] uppercase mb-4 md:mb-6 block">01 — Crecimiento</span>
            <h2
              className="font-serif text-white mb-6 md:mb-10 leading-[1] md:leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)" }}
            >
              <MaskedText>
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
          </div>
        </div>

        {/* Right: Image Asset */}
        <div
          className="services-level-2-image relative h-full w-full overflow-hidden hidden md:block"
          style={{ clipPath: 'inset(10% 10% 10% 10%)', transform: 'scale(1.1)' }}
        >
          <img
            src="https://ik.imagekit.io/jsaisu64x/A_vertical_architectural_2k_202602051906.jpeg"
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[30%]"
            alt="Investment Architecture"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505]/80" />
        </div>
      </div>
    </article>
  );
};

// LEVEL 3: SEGURIDAD
const CanonLevel3_Security = () => {
  return (
    <article className="services-level services-level-3 absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6" style={{ opacity: 0 }}>
      {/* Background */}
      <div className="services-level-3-bg absolute inset-0 z-0" style={{ opacity: 0, transform: 'scale(1.2)' }}>
        <img
          src="https://ik.imagekit.io/jsaisu64x/A_closeup_interior_2k_202602051907.jpeg"
          className="w-full h-full object-cover grayscale"
          alt="Interior Detail"
        />
      </div>

      <div className="services-skew-target z-10 text-center max-w-4xl w-full px-4 md:px-0">
        <span className="font-sans text-[10px] md:text-xs text-stone-400 tracking-[0.2em] uppercase mb-6 md:mb-8 block">02 — Preservación</span>
        <h2
          className="font-serif text-white mb-10 md:mb-16 leading-[1] md:leading-[0.9]"
          style={{ fontSize: "clamp(3rem, 15vw, 7rem)" }}
        >
          <MaskedText>Patrimonio</MaskedText>
          <MaskedText><span className="italic text-stone-300">Blindado</span></MaskedText>
        </h2>

        {/* The 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-white/10 pt-10 text-left md:text-center">
          <div className="services-pillar" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <h4 className="font-serif text-xl text-white mb-3 italic">Orden</h4>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Saneamiento de pasivos y estructura clara. La paz mental comienza con el orden.
            </p>
          </div>
          <div className="services-pillar" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <h4 className="font-serif text-xl text-white mb-3 italic">Solidez</h4>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Reservas estratégicas de liquidez. Tu estilo de vida, protegido ante cualquier eventualidad.
            </p>
          </div>
          <div className="services-pillar" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <h4 className="font-serif text-xl text-white mb-3 italic">Estructura</h4>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Ingeniería legal y fiscal para blindar el legado que has construido.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

// LEVEL 4: LEGADO
const CanonLevel4_Legacy = () => {
  return (
    <article className="services-level services-level-4 absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
      {/* Background Image */}
      <div className="services-level-4-bg absolute inset-0 w-full h-full overflow-hidden z-0" style={{ opacity: 0, transform: 'scale(1.1)' }}>
        <img
          src="https://ik.imagekit.io/jsaisu64x/A_wide_panoramic_2k_202602051902.jpeg"
          className="w-full h-full object-cover grayscale mix-blend-overlay opacity-60"
          alt="Panoramic Landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 w-full h-full flex flex-col md:flex-row items-center justify-between">
        <div className="services-skew-target w-full md:w-1/2 flex flex-col justify-center h-1/2 md:h-full pt-16 md:pt-0">
          <span className="font-sans text-[10px] md:text-xs text-stone-500 tracking-[0.3em] uppercase mb-4 md:mb-8 block ml-2">03 — Futuro</span>
          <h2
            className="font-serif text-white tracking-tight leading-[0.8] md:leading-[0.85]"
            style={{ fontSize: "clamp(4rem, 20vw, 11rem)" }}
          >
            <MaskedText>Legado</MaskedText>
            <MaskedText className="mt-[-2vw]"><span className="font-light text-white/40">&</span></MaskedText>
            <MaskedText><span className="italic text-white">Libertad</span></MaskedText>
          </h2>
        </div>

        <div className="services-level-4-text w-full md:w-[35%] flex flex-col justify-start md:justify-center h-1/2 md:h-full pb-16 md:pb-0 md:pr-12" style={{ opacity: 0, transform: 'translateX(50px)' }}>
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
        </div>
      </div>
    </article>
  );
};

// --- Main Scroll Component ---
const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const sticky = stickyRef.current!;

      // Master scroll progress (replaces useScroll + useSpring)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3, // Acts as spring damping — higher = smoother
          invalidateOnRefresh: true,
        }
      });

      // --- LEVEL 1 → LEVEL 2 transition ---
      const level1 = sticky.querySelector('.services-level-1')!;
      const level2 = sticky.querySelector('.services-level-2')!;
      const level2Image = sticky.querySelector('.services-level-2-image')!;

      // Level 1 exit
      masterTl.to(level1, { opacity: 0, duration: 0.05 }, 0.20);

      // Level 2 enter (includes MaskedText reveals)
      masterTl.to(level2, { opacity: 1, duration: 0.05 }, 0.20);
      masterTl.to(level2Image, { clipPath: 'inset(0 0 0 0)', scale: 1, duration: 0.15 }, 0.20);

      // Level 2 masked text reveals
      const level2Texts = level2.querySelectorAll('.masked-text-inner');
      level2Texts.forEach((el, i) => {
        masterTl.to(el, { y: '0%', opacity: 1, duration: 0.1, ease: 'expo.out' }, 0.22 + i * 0.02);
      });

      // Level 2 exit
      masterTl.to(level2, { opacity: 0, duration: 0.05 }, 0.50);

      // --- LEVEL 3 ---
      const level3 = sticky.querySelector('.services-level-3')!;
      const level3Bg = sticky.querySelector('.services-level-3-bg')!;
      const level3Pillars = sticky.querySelectorAll('.services-pillar');

      masterTl.to(level3, { opacity: 1, duration: 0.05 }, 0.50);
      masterTl.to(level3Bg, { opacity: 0.2, scale: 1, duration: 0.15 }, 0.50);

      // Level 3 masked text reveals
      const level3Texts = level3.querySelectorAll('.masked-text-inner');
      level3Texts.forEach((el, i) => {
        masterTl.to(el, { y: '0%', opacity: 1, duration: 0.1, ease: 'expo.out' }, 0.52 + i * 0.02);
      });

      // Pillars stagger
      level3Pillars.forEach((el, i) => {
        masterTl.to(el, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.60 + i * 0.04);
      });

      // Level 3 exit
      masterTl.to(level3, { opacity: 0, duration: 0.05 }, 0.80);

      // --- LEVEL 4 ---
      const level4 = sticky.querySelector('.services-level-4')!;
      const level4Bg = sticky.querySelector('.services-level-4-bg')!;
      const level4Text = sticky.querySelector('.services-level-4-text')!;

      masterTl.to(level4, { opacity: 1, duration: 0.05 }, 0.80);
      masterTl.to(level4Bg, { opacity: 0.4, scale: 1, duration: 0.15 }, 0.80);

      // Level 4 masked text reveals
      const level4Texts = level4.querySelectorAll('.masked-text-inner');
      level4Texts.forEach((el, i) => {
        masterTl.to(el, { y: '0%', opacity: 1, duration: 0.1, ease: 'expo.out' }, 0.82 + i * 0.02);
      });

      // Level 4 editorial text reveal
      masterTl.to(level4Text, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.84);

      // --- Level 1 initial reveal (on load) ---
      const level1Texts = level1.querySelectorAll('.masked-text-inner');
      level1Texts.forEach((el, i) => {
        masterTl.to(el, { y: '0%', opacity: 1, duration: 0.1, ease: 'expo.out' }, i * 0.02);
      });

      // --- Background atmosphere ---
      const bgAtmosphere = sticky.querySelector('.services-bg-atmosphere')!;
      if (bgAtmosphere) {
        masterTl.to(bgAtmosphere, { opacity: 0, duration: 0.15 }, 0);
      }

      // --- Progress dots ---
      const dots = sticky.querySelectorAll('.services-progress-dot');
      dots.forEach((dot, i) => {
        const startPos = i * 0.25;
        const endPos = (i + 1) * 0.25;
        masterTl.fromTo(dot,
          { scale: 1, opacity: 0.5 },
          { scale: 1.5, opacity: 1, duration: 0.05 },
          startPos
        );
        masterTl.to(dot,
          { scale: 1, opacity: 0.5, duration: 0.05 },
          endPos
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#050505] z-10" style={{ height: '550vh' }}>
      <FontStyles />
      <CustomCursor />

      {/* Organic Noise Texture */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Sticky Viewport */}
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">

        {/* Background Atmosphere */}
        <div className="services-bg-atmosphere absolute inset-0 z-0" style={{ opacity: 0.4 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
          <video
            className="h-full w-full object-cover grayscale opacity-40"
            autoPlay loop muted playsInline
            src="https://ik.imagekit.io/jsaisu64x/WhatsApp%20Video%202026-02-04%20at%207.19.52%20PM%20(1).mp4?updatedAt=1770325999155"
          />
        </div>

        {/* Levels */}
        <CanonLevel1_Intro />
        <CanonLevel2_Investments />
        <CanonLevel3_Security />
        <CanonLevel4_Legacy />

        {/* Progress Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="services-progress-dot w-1 h-1 rounded-full bg-white/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;