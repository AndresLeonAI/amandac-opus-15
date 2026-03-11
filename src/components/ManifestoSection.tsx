import React, { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

gsap.registerPlugin(ScrollTrigger);

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (IS_TOUCH || !cursorRef.current) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.45,
        ease: 'expo.out',
      });
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (IS_TOUCH) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed left-0 top-0 z-[100] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 mix-blend-difference md:block"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

interface SplitTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SplitText: React.FC<SplitTextProps> = ({ children, className = '', style }) => {
  if (typeof children !== 'string') return null;

  return (
    <span className={`split-text-wrapper inline-flex flex-wrap ${className}`} aria-label={children} style={style}>
      {children.split(/\s+/).map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden="true" className="word-span inline-block overflow-hidden pe-[0.26em] pb-[0.14em]">
          <span className="char-wrapper inline-block translate-y-full opacity-0 will-change-transform">{word}</span>
        </span>
      ))}
    </span>
  );
};

interface CircledWordProps {
  children: React.ReactNode;
  className?: string;
}

const CircledWord: React.FC<CircledWordProps> = ({ children, className = '' }) => (
  <span className="relative inline-grid max-w-full place-items-center px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.35rem,1.4vw,0.85rem)]">
    <svg className="absolute inset-0 h-full w-full overflow-visible text-blue-900/80 pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
      <path
        d="M20,80 C40,95 160,95 180,75 C200,50 170,10 100,15 C40,20 15,45 25,65"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="draw-path"
        filter="url(#manifesto-premium-glow)"
      />
    </svg>
    <span className={`relative z-10 text-balance font-manifesto-serif italic text-white drop-shadow-lg ${className}`}>{children}</span>
  </span>
);

interface SvgProps {
  className?: string;
  speed?: string;
}

const ProfitChartSVG: React.FC<SvgProps> = ({ className }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className}>
    <defs>
      <linearGradient id="manifesto-profitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1" />
      </linearGradient>
      <filter id="manifesto-sapphire-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g stroke="rgba(255,255,255,0.02)" strokeWidth="0.5">
      {[10, 30, 50, 70, 90, 110].map((pos) => (
        <React.Fragment key={pos}>
          <line x1={pos} y1="10" x2={pos} y2="110" />
          <line x1="10" y1={pos} x2="110" y2={pos} />
        </React.Fragment>
      ))}
    </g>
    <path d="M10 110 L110 110 M10 110 L10 10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <path className="draw-path" d="M10 100 C 40 100, 50 60, 70 65 C 90 70, 100 20, 110 15" stroke="url(#manifesto-profitGrad)" strokeWidth="1.5" strokeLinecap="round" filter="url(#manifesto-sapphire-glow)" />
    <circle cx="70" cy="65" r="1.5" fill="#1e3a8a" className="animate-pulse" filter="url(#manifesto-sapphire-glow)" />
    <circle cx="110" cy="15" r="3" fill="#fff" className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
    <circle cx="110" cy="15" r="1.5" fill="#fff" filter="url(#manifesto-sapphire-glow)" />
  </svg>
);

const AstrolabeCoinSVG: React.FC<SvgProps> = ({ className, speed = '1' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} data-speed={speed}>
    <defs>
      <filter id="manifesto-astro-glow">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="42" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" opacity="0.6" />
    <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    <path d="M50 5 L50 95 M5 50 L95 50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="20" stroke="#fff" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_15s_linear_infinite_reverse]" filter="url(#manifesto-astro-glow)" opacity="0.8" />
    <circle cx="50" cy="50" r="3" fill="#1e3a8a" className="animate-pulse" filter="url(#manifesto-astro-glow)" />
  </svg>
);

const BlueprintSVG: React.FC<SvgProps> = ({ className, speed = '1' }) => (
  <svg viewBox="0 0 160 80" fill="none" className={className} data-speed={speed}>
    <defs>
      <filter id="manifesto-blue-glow">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect x="5" y="5" width="150" height="70" rx="4" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="rgba(30,58,138,0.02)" />
    <path d="M5 25 L155 25 M5 55 L155 55 M40 5 L40 75 M120 5 L120 75" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
    <circle cx="80" cy="40" r="15" stroke="#1e3a8a" strokeDasharray="2 4" strokeWidth="1" className="animate-[spin_10s_linear_infinite]" opacity="0.8" filter="url(#manifesto-blue-glow)" />
    <circle cx="80" cy="40" r="1.5" fill="#fff" />
    <path d="M20 15 L30 15 M130 65 L140 65" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const GlassCTA: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const scrollToBooking = useScrollToBooking();

  useGSAP(() => {
    if (!buttonRef.current || !inViewRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: inViewRef.current,
        start: 'top 80%',
        end: 'top 25%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(glowRef.current, { opacity: 0, scale: 0.85 }, { opacity: 0.6, scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .fromTo(buttonRef.current, { opacity: 0, y: 36, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' }, 0)
      .fromTo(labelRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.15)
      .fromTo(arrowRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, 0.28);
  }, { scope: inViewRef });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current || IS_TOUCH) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.12;
    const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.12;

    gsap.to(buttonRef.current, {
      x: deltaX,
      y: deltaY,
      rotationX: -deltaY * 0.08,
      rotationY: deltaX * 0.08,
      duration: 0.7,
      ease: 'power3.out',
      overwrite: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  return (
    <section ref={inViewRef} className="relative isolate w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-[clamp(1.1rem,4vw,2rem)] py-[clamp(1.5rem,5vw,2.75rem)] backdrop-blur-xl shadow-[0_30px_120px_-40px_rgba(30,58,138,0.28)]">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div ref={glowRef} className="absolute inset-x-[12%] top-1/2 h-[clamp(10rem,36vw,18rem)] -translate-y-1/2 rounded-full bg-blue-900/[0.12] blur-[120px]" style={{ opacity: 0 }} />
        <AstrolabeCoinSVG className="absolute left-1/2 top-1/2 h-[clamp(12rem,28vw,24rem)] w-[clamp(12rem,28vw,24rem)] -translate-x-1/2 -translate-y-1/2 text-blue-900/[0.1] opacity-80" speed="1.2" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl [perspective:1200px]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <button
          ref={buttonRef}
          onClick={scrollToBooking}
          className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.015] px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(2rem,6vw,4rem)] text-center will-change-transform"
          style={{ opacity: 0, textDecoration: 'none', transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-blue-400/45 to-transparent" />
            <div className="absolute inset-x-[20%] bottom-0 h-px bg-gradient-to-r from-transparent via-blue-600/45 to-transparent" />
            <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.18),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </div>

          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient-glass-border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.16)" />
                <stop offset="100%" stopColor="rgba(30,58,138,0.35)" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="28" ry="28" fill="none" stroke="url(#gradient-glass-border)" strokeWidth="1" />
          </svg>

          <span ref={labelRef} className="mb-5 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.35em] text-blue-200/65 md:text-[0.75rem]" style={{ opacity: 0 }}>
            <span className="h-px w-8 bg-blue-400/30" />
            El siguiente nivel
            <span className="h-px w-8 bg-blue-400/30" />
          </span>

          <div className="relative z-10 flex max-w-[18ch] flex-col items-center justify-center text-center">
            <span className="font-manifesto-serif text-balance italic leading-[1.06] tracking-tight text-white" style={{ fontSize: 'clamp(2.2rem, 7vw, 5rem)' }}>
              Comienza tu
            </span>
            <span className="font-manifesto-serif text-balance italic leading-[0.98] tracking-tight text-white" style={{ fontSize: 'clamp(2.2rem, 7vw, 5.4rem)' }}>
              Camino a la
            </span>
            <span className="mt-2 font-manifesto-serif text-balance italic leading-[0.92] tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]" style={{ fontSize: 'clamp(3rem, 9vw, 6.6rem)' }}>
              Libertad
            </span>
          </div>

          <div
            ref={arrowRef}
            className="relative mt-8 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 text-white/90 transition-colors duration-500 group-hover:border-blue-400/45 group-hover:text-black"
            style={{ opacity: 0 }}
          >
            <div className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
            <ArrowUpRight className="relative z-10 h-5 w-5" strokeWidth={1.5} />
          </div>
        </button>
      </div>
    </section>
  );
};

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    const setupSharedAnimations = (parallaxFactor: number) => {
      gsap.utils.toArray<HTMLElement>('.manifesto-panel').forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.word-span').forEach((word) => {
        const char = word.querySelector<HTMLElement>('.char-wrapper');
        if (!char) return;

        gsap.to(char, {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: word,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.image-container').forEach((container) => {
        const img = container.querySelector('img');
        if (!img) return;

        gsap.set(container, { clipPath: 'inset(0 0 100% 0 round 2rem)' });
        gsap.set(img, { scale: 1.08, transformOrigin: 'center center' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        });

        tl.to(container, { clipPath: 'inset(0 0 0% 0 round 2rem)', ease: 'power3.out' })
          .to(img, { scale: 1, yPercent: -4, ease: 'none' }, 0);
      });

      gsap.utils.toArray<SVGPathElement>('.draw-path').forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: path,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 1,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.parallax-el').forEach((item) => {
        const speed = parseFloat(item.dataset.speed || '1');
        gsap.to(item, {
          yPercent: parallaxFactor * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    };

    mm.add('(min-width: 768px)', () => setupSharedAnimations(-18));
    mm.add('(max-width: 767px)', () => setupSharedAnimations(-10));

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      data-manifesto
      className="relative isolate overflow-hidden bg-[#030303] text-[#ececec] selection:bg-red-600/30 selection:text-white"
    >
      <CustomCursor />

      <svg className="hidden">
        <defs>
          <filter id="manifesto-premium-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          aria-hidden="true"
        >
          <source src="https://ik.imagekit.io/owke186g5/MANSION%202%20.mp4?updatedAt=1772143250901" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.24),transparent_42%),linear-gradient(180deg,rgba(3,3,3,0.72),rgba(3,3,3,0.96))]" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-red-600/[0.08] blur-[180px] md:h-[42rem] md:w-[42rem]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-16 md:gap-14 md:px-8 md:py-24">
        <section className="manifesto-panel relative isolate overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] px-[clamp(1.1rem,4vw,2rem)] py-[clamp(1.5rem,4vw,2.4rem)] shadow-[0_32px_120px_-50px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_25%_15%,rgba(30,58,138,0.25),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
            <div className="min-w-0 md:col-span-5">
              <SplitText className="font-manifesto-sans text-[clamp(2.5rem,8vw,5.8rem)] font-light tracking-tight text-white/92">Cada</SplitText>
              <CircledWord className="text-[clamp(2.9rem,9vw,6.4rem)] leading-[0.94]">decisión</CircledWord>
              <SplitText className="font-manifesto-serif text-[clamp(1.8rem,5vw,4rem)] italic text-gray-300/80">es una semilla.</SplitText>
            </div>

            <div className="image-container relative min-w-0 overflow-hidden rounded-[2rem] md:col-span-7">
              <div className="absolute inset-0 z-10 bg-blue-900/12 mix-blend-multiply pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200"
                alt="Capital y estrategia financiera"
                className="block aspect-[4/5] w-full object-cover brightness-75 grayscale md:aspect-[16/10]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/12 mix-blend-overlay" />
            </div>
          </div>
        </section>

        <section className="manifesto-panel relative isolate overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] px-[clamp(1.1rem,4vw,2rem)] py-[clamp(1.5rem,4vw,2.4rem)] shadow-[0_32px_120px_-50px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <ProfitChartSVG className="parallax-el absolute right-[6%] top-[8%] h-[10rem] w-[10rem] text-white/8 md:h-[18rem] md:w-[18rem]" speed="0.2" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(30,58,138,0.2),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <div className="min-w-0 md:col-span-7">
              <SplitText className="font-manifesto-sans text-[clamp(1.3rem,3.8vw,2.8rem)] font-light text-gray-300">revelando el</SplitText>
              <SplitText className="font-manifesto-sans leading-none tracking-[-0.05em] text-white" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)', fontWeight: 700 }}>
                POTENCIAL
              </SplitText>
            </div>
            <div className="min-w-0 self-end md:col-span-5">
              <SplitText className="font-manifesto-serif text-[clamp(1.7rem,4.8vw,3.8rem)] italic text-blue-100">oculto del capital.</SplitText>
            </div>
          </div>
        </section>

        <section className="manifesto-panel relative isolate overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] px-[clamp(1.1rem,4vw,2rem)] py-[clamp(1.5rem,4vw,2.4rem)] shadow-[0_32px_120px_-50px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_22%_70%,rgba(220,38,38,0.12),transparent_34%),radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.08),transparent_26%)]" />
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
            <div className="image-container relative min-w-0 overflow-hidden rounded-[2rem] md:col-span-7">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400"
                alt="Arquitectura financiera urbana"
                className="block aspect-[1/1] w-full object-cover brightness-50 grayscale md:aspect-[16/10]"
                loading="lazy"
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#010101] via-transparent to-transparent opacity-80" />
              <BlueprintSVG className="parallax-el absolute left-1/2 top-1/2 z-20 h-20 w-40 -translate-x-1/2 -translate-y-1/2 text-white/18 md:h-28 md:w-56" speed="0.1" />
            </div>

            <div className="relative min-w-0 md:col-span-5">
              <AstrolabeCoinSVG className="parallax-el absolute -right-2 top-0 hidden h-20 w-20 text-blue-900/30 md:block" speed="-0.3" />
              <SplitText className="font-manifesto-sans text-[clamp(1.3rem,3.8vw,2.8rem)] font-light text-gray-300">trazando tu propia</SplitText>
              <CircledWord className="text-[clamp(2.3rem,7vw,5.8rem)] leading-[0.96]">ruta estratégica.</CircledWord>
            </div>
          </div>
        </section>

        <section className="manifesto-panel relative isolate overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] px-[clamp(1.1rem,4vw,2rem)] py-[clamp(1.5rem,4vw,2.4rem)] shadow-[0_32px_120px_-50px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(220,38,38,0.11),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.06),transparent_26%)]" />
            <div className="absolute inset-x-0 top-1/2 h-[18rem] -translate-y-1/2 bg-[radial-gradient(circle,rgba(220,38,38,0.08)_0%,transparent_68%)] md:h-[24rem]" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <div className="min-w-0 md:col-span-8">
              <SplitText className="font-manifesto-sans text-[clamp(0.85rem,2.2vw,1.4rem)] font-semibold uppercase tracking-[0.32em] text-gray-500">Guiando tus pasos</SplitText>
              <SplitText className="font-manifesto-serif text-[clamp(2.1rem,5.8vw,4.8rem)] italic text-white">Hacia la</SplitText>
              <div className="relative max-w-full">
                <SplitText className="font-manifesto-serif leading-[0.88] tracking-tight text-white drop-shadow-2xl" style={{ fontSize: 'clamp(3.4rem, 11vw, 9rem)', fontStyle: 'italic' }}>
                  Libertad
                </SplitText>
                <div
                  className="pointer-events-none absolute inset-0 font-manifesto-serif italic text-white/[0.05] blur-[12px]"
                  style={{ fontSize: 'clamp(3.4rem, 11vw, 9rem)' }}
                  aria-hidden="true"
                >
                  Libertad
                </div>
              </div>
            </div>

            <div className="min-w-0 self-end md:col-span-4 md:justify-self-end">
              <div className="inline-flex max-w-full items-center rounded-full border border-blue-900/40 bg-white/[0.02] px-[clamp(1rem,3vw,1.6rem)] py-[clamp(0.7rem,2vw,1rem)] shadow-[0_0_40px_rgba(30,58,138,0.16)] backdrop-blur-md">
                <SplitText className="font-manifesto-sans text-[clamp(1.15rem,3.2vw,2.4rem)] font-black uppercase tracking-[0.18em] text-white">financiera.</SplitText>
              </div>
            </div>
          </div>
        </section>

        <section className="manifesto-panel">
          <GlassCTA />
        </section>
      </div>
    </section>
  );
}
