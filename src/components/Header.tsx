import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const prevScrollRef = useRef(0);
  const scrollToBooking = useScrollToBooking();

  // Replace useScroll/useMotionValueEvent with efficient passive scroll listener
  useEffect(() => {
    const onScroll = () => {
      const latest = window.scrollY;
      const previous = prevScrollRef.current;

      if (latest > previous && latest > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setScrolled(latest > 50);
      prevScrollRef.current = latest;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP-driven hide/show animation (replaces motion.header animate)
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      y: hidden ? '-100%' : '0%',
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }, [hidden]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
    >
      {/* Glassmorphism Background Container */}
      <div className={`absolute inset-0 transition-all duration-700 ${scrolled
        ? 'bg-black/10 backdrop-blur-xl border-b border-white/5 shadow-sm supports-[backdrop-filter]:bg-black/5'
        : 'bg-transparent border-transparent'
        }`} />

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