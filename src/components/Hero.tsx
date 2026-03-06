import React, { useRef, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

const SparklesCore = lazy(() => import('@/components/ui/sparkles').then(mod => ({ default: mod.SparklesCore })));

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const scrollToBooking = useScrollToBooking();

  useGSAP(() => {
    if (!heroRef.current) return;

    // Create extremely fast, immutable GSAP tweeners pumping values directly to CSS Variables. 
    // This entirely bypasses React's virtual DOM diffing (Zero Layout Thrashing).
    const xTo = gsap.quickTo(heroRef.current, "--mouse-x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(heroRef.current, "--mouse-y", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      xTo((clientX / innerWidth) * 100);
      yTo((clientY / innerHeight) * 100);
    };

    // Passive listener so we don't block the Native Scroll Thread
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // GSAP context automatically handles reverting on unmount!
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: heroRef });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      style={{
        "--mouse-x": 50,
        "--mouse-y": 50,
        background: `
          radial-gradient(circle at calc(var(--mouse-x) * 1%) calc(var(--mouse-y) * 1%), hsl(220 100% 25% / 0.15) 0%, transparent 50%),
          linear-gradient(135deg, hsl(220 90% 8%) 0%, hsl(220 90% 12%) 100%)
        `
      } as React.CSSProperties}
    >
      {/* Sparkles Effect - Full Screen Background */}
      <div className="absolute inset-0 w-full h-full">
        <Suspense fallback={null}>
          <SparklesCore
            id="hero-sparkles"
            background="transparent"
            minSize={1.0}
            maxSize={2.8}
            particleDensity={120}
            className="w-full h-full"
            particleColor="#60A5FA"
          />
        </Suspense>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto w-full">
          {/* Main Title - Fluid scaling to prevent overflow */}
          <h1
            className="font-luxury text-white mb-4 relative z-20 leading-[1.1] md:leading-tight"
            style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
          >
            Estrategias financieras
            <span className="block text-primary-glow mt-2 md:mt-0">Personalizadas</span>
          </h1>

          {/* Personal Quote - Scaled down for mobile */}
          <p className="font-luxury text-lg md:text-2xl text-primary/90 mb-6 md:mb-8 relative z-20 px-4 md:px-0">
            "Tu tranquilidad financiera es mi principal objetivo."
          </p>

          {/* Subtitle - Better mobile tracking and line-height */}
          <p className="font-elegant text-base md:text-xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed relative z-20 px-2 md:px-0">
            Asesoría personalizada para patrimonios selectos.<br className="hidden md:block" />
            <span className="font-luxury text-primary/80 block mt-2 md:inline md:mt-0"> Discreción. Precisión. Resultados.</span>
          </p>

          {/* CTAs - Stack perfectly on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center relative z-20 w-full px-4 sm:px-0">
            <div className="flex flex-col items-center w-full sm:w-auto">
              <Button
                size="lg"
                variant="premium"
                className="group px-6 md:px-8 relative overflow-hidden w-full sm:w-auto h-14 md:h-12"
                onClick={scrollToBooking}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                  Agendar consulta
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </span>
              </Button>
              <p className="font-luxury text-xs opacity-80 md:text-sm text-white/70 mt-3 md:mt-2 text-center max-w-[250px] md:max-w-none">
                Primera consulta de 30 minutos, sin costo y sin compromiso.
              </p>
            </div>

            <div className="w-full sm:w-auto mt-4 sm:mt-0 pb-6 sm:pb-0">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 md:px-8 py-6 h-14 md:h-auto text-base md:text-lg font-elegant tracking-wide hover:scale-102 transition-all duration-200"
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
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce relative z-20">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </div>
    </section>
  );
};

export default Hero;