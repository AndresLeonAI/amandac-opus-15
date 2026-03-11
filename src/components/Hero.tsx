import React, { Suspense, lazy, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';
import { useIsMobile } from '@/hooks/useIsMobile';

const SparklesCore = lazy(() => import('@/components/ui/sparkles').then((mod) => ({ default: mod.SparklesCore })));

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const scrollToBooking = useScrollToBooking();
  const isMobile = useIsMobile();
  const titleSize = 'clamp(2.9rem, 9vw, 5.75rem)';
  const quoteSize = 'clamp(1.05rem, 3.4vw, 1.6rem)';
  const subtitleSize = 'clamp(0.98rem, 2.7vw, 1.2rem)';
  const ctaLabelSize = 'clamp(1rem, 2.8vw, 1.08rem)';
  const ctaNoteSize = 'clamp(0.8rem, 2.2vw, 0.95rem)';

  useGSAP(() => {
    if (!heroRef.current || isMobile) return;

    const xTo = gsap.quickTo(heroRef.current, '--mouse-x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(heroRef.current, '--mouse-y', { duration: 0.6, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      xTo((clientX / innerWidth) * 100);
      yTo((clientY / innerHeight) * 100);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: heroRef, dependencies: [isMobile] });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background"
      style={{
        '--mouse-x': 50,
        '--mouse-y': 50,
        paddingBlockStart: 'max(env(safe-area-inset-top), clamp(1rem, 3vh, 2rem))',
        paddingBlockEnd: 'max(env(safe-area-inset-bottom), clamp(1.25rem, 4vh, 2.75rem))',
        background: `
          radial-gradient(circle at calc(var(--mouse-x) * 1%) calc(var(--mouse-y) * 1%), hsl(220 100% 25% / 0.15) 0%, transparent 50%),
          linear-gradient(135deg, hsl(220 90% 8%) 0%, hsl(220 90% 12%) 100%)
        `,
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
        <Suspense fallback={null}>
          {!isMobile ? (
            <SparklesCore
              id="hero-sparkles"
              background="transparent"
              minSize={1.0}
              maxSize={2.8}
              particleDensity={120}
              className="h-full w-full"
              particleColor="#60A5FA"
            />
          ) : null}
        </Suspense>
      </div>

      <div
        className="container relative z-10 mx-auto flex w-full items-center justify-center px-5 text-center sm:px-6"
        style={{ minHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex w-full max-w-[44rem] flex-col items-center justify-center gap-[clamp(1rem,2.75vh,1.75rem)]">
          <h1
            className="relative z-20 mb-0 max-w-[12ch] text-balance font-luxury leading-[0.94] tracking-[-0.035em] text-white"
            style={{ fontSize: titleSize }}
          >
            Estrategias financieras
            <span className="mt-[clamp(0.15rem,1vh,0.5rem)] block text-primary-glow">Personalizadas</span>
          </h1>

          <p
            className="relative z-20 max-w-[30rem] px-3 font-luxury leading-[1.22] text-balance text-primary/90 sm:px-0"
            style={{ fontSize: quoteSize }}
          >
            "Tu tranquilidad financiera es mi principal objetivo."
          </p>

          <p
            className="relative z-20 mx-auto max-w-[34rem] px-1 font-elegant leading-[1.55] text-pretty text-white/80 sm:px-0"
            style={{ fontSize: subtitleSize }}
          >
            AsesorÃ­a personalizada para patrimonios selectos.<br className="hidden md:block" />
            <span className="mt-2 block font-luxury text-primary/80 md:mt-0 md:inline"> DiscreciÃ³n. PrecisiÃ³n. Resultados.</span>
          </p>

          <div className="relative z-20 flex w-full max-w-[36rem] flex-col items-center justify-center gap-[clamp(0.85rem,2.4vh,1.5rem)] px-1 sm:px-0">
            <div className="flex w-full flex-col items-center">
              <Button
                size="lg"
                variant="premium"
                className="group relative w-full overflow-hidden rounded-full"
                style={{
                  minHeight: 'clamp(3.35rem, 10vw, 3.85rem)',
                  paddingInline: 'clamp(1.15rem, 4vw, 2rem)',
                  paddingBlock: 'clamp(0.95rem, 2.6vw, 1.1rem)',
                  fontSize: ctaLabelSize,
                }}
                onClick={scrollToBooking}
              >
                <span className="relative z-10 flex w-full items-center justify-center gap-2">
                  Agendar consulta
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                </span>
              </Button>
              <p
                className="mt-3 max-w-[22rem] text-center font-luxury text-white/70 opacity-80"
                style={{ fontSize: ctaNoteSize, lineHeight: 1.45 }}
              >
                Primera consulta de 30 minutos, sin costo y sin compromiso.
              </p>
            </div>

            <div className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full font-elegant tracking-[0.02em] transition-transform duration-200 hover:scale-102"
                style={{
                  minHeight: 'clamp(3.25rem, 10vw, 3.8rem)',
                  paddingInline: 'clamp(1.1rem, 4vw, 2rem)',
                  paddingBlock: 'clamp(0.9rem, 2.4vw, 1.05rem)',
                  fontSize: ctaLabelSize,
                }}
                onClick={() => {
                  const servicesSection = document.getElementById('asesoria-estrategia');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#asesoria-estrategia';
                  }
                }}
              >
                Ver servicios
              </Button>
            </div>
          </div>

          <div className="hero-scroll-indicator relative z-20 flex items-center justify-center pt-[clamp(0.25rem,1.5vh,0.75rem)] text-white/40">
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
