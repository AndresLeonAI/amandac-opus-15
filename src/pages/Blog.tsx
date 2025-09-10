import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, FileText, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogFilters } from '@/components/BlogFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import emergencyFundImage from '@/assets/blog-emergency-fund.jpg';
import inflationImage from '@/assets/blog-inflation.jpg';
import entrepreneursImage from '@/assets/blog-entrepreneurs.jpg';
import WebGLShaderOceanLight from '@/components/ui/WebGLShaderOceanLight';

const blogPosts = [
  {
    id: 1,
    slug: 'fondo-de-emergencia-en-colombia',
    title: 'Fondo de emergencia en Colombia — Estrategia, ubicación y ejecución',
    excerpt: 'Un mecanismo de protección financiera diseñado para cubrir eventos no planificados sin recurrir a deuda costosa. Metodología práctica para construirlo y gobernarlo desde Bogotá.',
    date: '15 Enero 2024',
    readTime: '8 min',
    categories: ['Protección', 'Ahorro'],
    icon: Shield,
    image: emergencyFundImage,
    metaTitle: 'Fondo de emergencia en Colombia: guía profesional (2025)',
    metaDescription: 'Qué es, cuánto debe tener y dónde ubicar tu fondo de emergencia en Colombia. Metodología práctica para construirlo y gobernarlo desde Bogotá.',
    keywords: ['fondo de emergencia Colombia', 'liquidez', 'FIC de liquidez', 'CDT', 'cuentas de ahorro', 'disciplina financiera', 'Bogotá']
  },
  {
    id: 2,
    slug: 'inflacion-y-banco-de-la-republica',
    title: 'Inflación y Banco de la República — Impacto real en tu bolsillo y plan de acción',
    excerpt: 'Cómo se transmite la política monetaria a tus créditos, arriendos y ahorros. Indicadores a vigilar y tácticas prácticas para proteger tu poder adquisitivo en Bogotá.',
    date: '10 Enero 2024',
    readTime: '6 min',
    categories: ['Economía', 'Inversión'],
    icon: TrendingUp,
    image: inflationImage,
    metaTitle: 'Inflación en Colombia y tasas del Banco de la República: efectos y estrategia personal',
    metaDescription: 'Cómo se transmite la política monetaria a tus créditos, arriendos y ahorros. Indicadores a vigilar y tácticas prácticas para proteger tu poder adquisitivo en Bogotá.',
    keywords: ['inflación Colombia', 'Banco de la República', 'tasa de interés', 'UVR', 'crédito de consumo', 'CDT', 'presupuesto Bogotá', 'política monetaria']
  },
  {
    id: 3,
    slug: 'independientes-y-emprendedores-en-bogota',
    title: 'Independientes y emprendedores en Bogotá — Orden, cumplimiento y seguridad financiera',
    excerpt: 'Metodología para organizar ingresos variables, separar impuestos, cotizar seguridad financiera y construir un negocio sostenible.',
    date: '5 Enero 2024',
    readTime: '10 min',
    categories: ['Emprendimiento', 'Impuestos'],
    icon: FileText,
    image: entrepreneursImage,
    metaTitle: 'Guía práctica para independientes en Bogotá: flujo, precios y protección',
    metaDescription: 'Metodología para organizar ingresos variables, separar impuestos, cotizar seguridad financiera y construir un negocio sostenible.',
    keywords: ['finanzas para freelancers Bogotá', 'independientes Colombia', 'flujo de caja', 'seguridad social', 'facturación', 'precios', 'ahorro', 'presupuesto por sobres']
  }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  
  const handleWhatsApp = () => {
    window.open('https://wa.me/573114688067?text=Hola%20Amanda,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20de%20asesoría%20financiera.', '_blank');
  };

  // Get all unique categories
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    blogPosts.forEach(post => {
      post.categories?.forEach(cat => allCategories.add(cat));
    });
    return Array.from(allCategories);
  }, []);

  // Filter posts based on search and categories
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const query = searchQuery.toLowerCase();
      const matchesQuery = !query || 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.keywords && post.keywords.some(keyword => 
          keyword.toLowerCase().includes(query)
        ));

      const matchesCategory = activeCategories.size === 0 || 
        (post.categories && post.categories.some(cat => activeCategories.has(cat)));

      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, activeCategories]);


  useEffect(() => {
    // Premium scroll animations for blog page
    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-in, .slide-up, .reveal-up, .reveal-scale');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.2, rootMargin: '30px' }
      );

      elements.forEach((el) => observer.observe(el));
    };

    // Staggered animations for cards
    const observeCards = () => {
      const cards = document.querySelectorAll('.blog-card');
      
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('in-view');
              }, index * 100);
            }
          });
        },
        { threshold: 0.1 }
      );

      cards.forEach((card) => cardObserver.observe(card));
    };

    observeElements();
    observeCards();

    // Add keyboard navigation enhancement
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target as HTMLElement;
        if (target.closest('.blog-card')) {
          e.preventDefault();
          const link = target.closest('.blog-card')?.querySelector('a') as HTMLAnchorElement;
          if (link) link.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardNavigation);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* WebGL Ocean Background - Fixed behind content, not in hero */}
      <WebGLShaderOceanLight className="pointer-events-none fixed inset-0 -z-10" />
      
      <Header />
      
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="py-16 relative bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center max-w-4xl mx-auto fade-in"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-luxury text-4xl md:text-6xl text-foreground mb-6">
                Blog de
                <span className="text-primary"> finanzas</span>
              </h1>
              <p className="font-elegant text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Insights profesionales, estrategias avanzadas y guías prácticas 
                para optimizar tu patrimonio financiero.
              </p>
            </motion.div>
            
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BlogFilters
                query={searchQuery}
                setQuery={setSearchQuery}
                categories={categories}
                activeCategories={activeCategories}
                setActiveCategories={setActiveCategories}
              />
            </motion.div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block group blog-card"
                  tabIndex={0}
                  aria-label={`Leer artículo: ${post.title}`}
                >
                  <motion.article
                    className="led-card rounded-xl overflow-hidden h-full flex flex-col transition-all duration-500 slide-up hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary/20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={`Ilustración del artículo: ${post.title}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-3 py-1.5">
                          <post.icon className="w-3.5 h-3.5 text-primary" />
                          <span className="font-elegant text-xs text-primary font-medium">
                            {post.categories?.[0] || 'Finanzas'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h2 className="font-luxury text-2xl text-foreground mb-4 leading-tight group-hover:text-primary/90 transition-colors duration-300">
                        {post.title}
                      </h2>
                      
                      <p className="font-elegant text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground/80">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-4 h-4" />
                            <span className="font-elegant">{post.date}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Clock className="w-4 h-4" />
                            <span className="font-elegant">{post.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-primary font-elegant text-sm font-medium">
                          <span>Leer más</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center fade-in"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-luxury text-3xl md:text-4xl text-foreground mb-6">
                ¿Necesita asesoría
                <span className="text-primary"> personalizada?</span>
              </h2>
              <p className="font-elegant text-muted-foreground text-lg mb-8">
                Cada situación financiera es única. Discutamos su caso específico 
                en una consulta confidencial.
              </p>
              <Button 
                onClick={handleWhatsApp}
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground px-10 py-6 text-lg shadow-elegant hover:shadow-glow transition-all duration-300 group hover:scale-102"
              >
                Agendar consulta privada
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;