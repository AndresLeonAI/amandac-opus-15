import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollToBooking = useScrollToBooking();

  useGSAP(() => {
    if (!headerRef.current || !bgRef.current) return;

    ScrollTrigger.create({
      start: 'top top',
      end: '+=99999',
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const scrolled = scrollY > 50;
        const hidden = self.direction === 1 && scrollY > 150;

        // O(1) Matrix Transformation via Layer Promotion
        gsap.to(headerRef.current, {
          yPercent: hidden ? -100 : 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Estilos calculados en el hilo del Compositor CSS. Evita CSS transiciones peleando con GSAP.
        gsap.to(bgRef.current, {
          backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
          borderBottomColor: scrolled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      },
    });
  }, { scope: headerRef });

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 will-change-transform"
    >
      {/* Background Container for GSAP animation */}
      <div
        ref={bgRef}
        className="absolute inset-0 border-b border-transparent supports-[backdrop-filter]:bg-black/5"
      />

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo/Monogram */}
          <div className="relative group cursor-pointer">
            <Link to="/#hero" className="font-luxury text-2xl text-white transition-opacity duration-300 hover:opacity-80">
              AC
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {['Servicios', 'Proceso', 'Premios', 'Blog', 'Testimonios'].map((item) => {
              const href = item === 'Premios' ? '/premios' : item === 'Blog' ? '/blog' : `/#${item.toLowerCase().replace(' ', '-')}`;
              const finalHref = item === 'Servicios' ? '/#asesoria-estrategia' :
                item === 'Proceso' ? '/#proceso-meticuloso' :
                  item === 'Testimonios' ? '/#testimonios' : href;

              return (
                <a key={item} href={finalHref} className="font-sans text-sm tracking-widest text-white/70 hover:text-white transition-colors uppercase">
                  {item}
                </a>
              )
            })}
          </nav>

          {/* CTA Button */}
          <Button
            variant="premium"
            size="sm"
            className="font-luxury tracking-wide bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-full px-6"
            onClick={scrollToBooking}
          >
            Agendar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;