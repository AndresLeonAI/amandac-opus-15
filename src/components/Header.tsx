import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Monogram */}
          <div className="relative">
            <Link to="/" className="font-luxury text-2xl text-white hover:text-primary transition-colors">
              AC
            </Link>
            {scrolled && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-60" />
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#asesoria-estrategia" className="font-luxury text-white/90 hover:text-white animated-underline transition-colors">
              Servicios
            </a>
            <a href="/#proceso" className="font-luxury text-white/90 hover:text-white animated-underline transition-colors">
              Proceso
            </a>
            <Link to="/blog" className="font-luxury text-white/90 hover:text-white animated-underline transition-colors">
              Blog
            </Link>
            <a href="/#testimonios" className="font-luxury text-white/90 hover:text-white animated-underline transition-colors">
              Testimonios
            </a>
          </nav>

          {/* CTA Button */}
          <Button 
            variant="premium"
            size="sm"
            className="font-luxury tracking-wide hover:scale-102 transition-all duration-200"
            onClick={() => window.open('https://wa.me/573114688067?text=Hola%20Amanda,%20me%20interesa%20agendar%20una%20consulta%20financiera.', '_blank')}
          >
            Agendar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;