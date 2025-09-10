import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { SparklesCore } from '@/components/ui/sparkles';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX / innerWidth * 100;
      const y = clientY / innerHeight * 100;
      
      heroRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, hsl(220 100% 25% / 0.15) 0%, transparent 50%),
        linear-gradient(135deg, hsl(220 100% 8%) 0%, hsl(220 90% 12%) 100%)
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      id="hero"
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background" 
      style={{
        background: 'var(--bg-page, linear-gradient(135deg, hsl(220 45% 15%) 0%, hsl(225 50% 18%) 50%, hsl(230 55% 22%) 100%))'
      }}
    >
      {/* Sparkles Effect - Full Screen Background */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={1.0}
          maxSize={2.8}
          particleDensity={120}
          className="w-full h-full"
          particleColor="#60A5FA"
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="font-luxury text-5xl md:text-7xl lg:text-8xl text-white mb-4 fade-in relative z-20">
            Estrategias financieras
            <span className="block text-primary-glow">Personalizadas</span>
          </h1>

          {/* Personal Quote */}
          <p className="font-luxury text-xl md:text-2xl text-primary/90 mb-8 fade-in relative z-20" style={{
            animationDelay: '0.1s'
          }}>
            "Tu tranquilidad financiera es mi principal objetivo."
          </p>

          {/* Subtitle */}
          <p className="font-elegant text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed fade-in relative z-20" style={{
            animationDelay: '0.2s'
          }}>
            Asesoría personalizada para patrimonios selectos. 
            <span className="font-luxury text-primary/80"> Discreción. Precisión. Resultados.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in relative z-20" style={{
            animationDelay: '0.4s'
          }}>
            <div className="flex flex-col items-center">
              <Button 
                variant="premium" 
                size="lg" 
                className="px-8 py-6 text-lg font-elegant tracking-wide hover:scale-102 transition-all duration-200" 
                onClick={() => window.open('https://wa.me/573114688067?text=Hola%20Amanda,%20me%20interesa%20agendar%20una%20consulta%20financiera.', '_blank')}
              >
                Agendar consulta
              </Button>
              <p className="font-luxury text-sm text-white/70 mt-2">
                Primera consulta de 30 minutos, sin costo y sin compromiso.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg font-elegant tracking-wide hover:scale-102 transition-all duration-200" 
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce relative z-20">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </div>
    </section>
  );
};

export default Hero;