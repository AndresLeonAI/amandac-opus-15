import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { BlogTOC } from '@/components/BlogTOC';
import { ReadingProgress } from '@/components/ReadingProgress';
import { slugify } from '@/utils/slugify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import emergencyFundImage from '@/assets/blog-emergency-fund.jpg';
import inflationImage from '@/assets/blog-inflation.jpg';
import entrepreneursImage from '@/assets/blog-entrepreneurs.jpg';

// Import blog components
import { EmergencyFundCalculator } from '@/components/blog/EmergencyFundCalculator';
import { EmergencyFundChecklist } from '@/components/blog/EmergencyFundChecklist';
import { BlogFAQ } from '@/components/blog/BlogFAQ';
import { BlogCTA } from '@/components/blog/BlogCTA';

const blogPosts = [
  {
    id: 1,
    slug: 'fondo-de-emergencia-en-colombia',
    title: 'Fondo de emergencia en Colombia — Estrategia, ubicación y ejecución',
    excerpt: 'Un mecanismo de protección financiera diseñado para cubrir eventos no planificados sin recurrir a deuda costosa. Metodología práctica para construirlo y gobernarlo desde Bogotá.',
    date: '15 Enero 2024',
    dateISO: '2024-01-15',
    readTime: '8 min',
    categories: ['Protección', 'Ahorro'],
    image: emergencyFundImage,
    metaTitle: 'Fondo de emergencia en Colombia: guía profesional (2025)',
    metaDescription: 'Qué es, cuánto debe tener y dónde ubicar tu fondo de emergencia en Colombia. Metodología práctica para construirlo y gobernarlo desde Bogotá.',
  },
  {
    id: 2,
    slug: 'inflacion-y-banco-de-la-republica',
    title: 'Inflación y Banco de la República — Impacto real en tu bolsillo y plan de acción',
    excerpt: 'Cómo se transmite la política monetaria a tus créditos, arriendos y ahorros. Indicadores a vigilar y tácticas prácticas para proteger tu poder adquisitivo en Bogotá.',
    date: '10 Enero 2024',
    dateISO: '2024-01-10',
    readTime: '6 min',
    categories: ['Economía', 'Inversión'],
    image: inflationImage,
    metaTitle: 'Inflación en Colombia y tasas del Banco de la República: efectos y estrategia personal',
    metaDescription: 'Cómo se transmite la política monetaria a tus créditos, arriendos y ahorros. Indicadores a vigilar y tácticas prácticas para proteger tu poder adquisitivo en Bogotá.',
  },
  {
    id: 3,
    slug: 'independientes-y-emprendedores-en-bogota',
    title: 'Independientes y emprendedores en Bogotá — Orden, cumplimiento y seguridad financiera',
    excerpt: 'Metodología para organizar ingresos variables, separar impuestos, cotizar seguridad financiera y construir un negocio sostenible.',
    date: '5 Enero 2024',
    dateISO: '2024-01-05',
    readTime: '10 min',
    categories: ['Emprendimiento', 'Impuestos'],
    image: entrepreneursImage,
    metaTitle: 'Guía práctica para independientes en Bogotá: flujo, precios y protección',
    metaDescription: 'Metodología para organizar ingresos variables, separar impuestos, cotizar seguridad financiera y construir un negocio sostenible.',
  }
];

// Function to render article content with beautiful typography
const renderArticleContent = (post: typeof blogPosts[0]) => {
  if (post.slug === 'fondo-de-emergencia-en-colombia') {
    return (
      <>
        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6 animate-fade-in">¿Qué es y por qué es estratégico?</h2>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
            Un fondo de emergencia es un mecanismo de protección financiera diseñado para cubrir eventos no planificados (salud, reparaciones, desempleo temporal) sin recurrir a deuda costosa. En entornos urbanos como Bogotá, donde el costo de vida y la movilidad influyen en el presupuesto, mantener liquidez dedicada reduce el riesgo de sobreendeudamiento y preserva tus metas de mediano plazo.
          </p>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
            <strong className="text-primary font-semibold">Propósito:</strong> garantizar de 3 a 6 meses de gastos esenciales, con acceso rápido y seguridad del capital.
          </p>
        </section>

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">¿De qué tamaño debe ser?</h2>
          <ul className="space-y-4 font-elegant text-lg text-muted-foreground">
            <li className="flex items-start space-x-3">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Ingresos estables (nómina):</strong> 3–4 meses de gastos esenciales.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Ingresos variables (independientes):</strong> 4–6 meses.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary">•</span>
              <span><strong className="text-foreground">Hogares con dependientes o alto endeudamiento:</strong> considera el rango superior.</span>
            </li>
          </ul>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
            Gastos esenciales incluyen arriendo, alimentación, servicios públicos, transporte, salud, educación y pagos mínimos de deuda.
          </p>
          <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
            <p className="font-elegant text-lg text-foreground leading-relaxed">
              <strong className="text-primary">Ejemplo (Bogotá):</strong> si tus gastos esenciales son $1.600.000 COP, tu rango objetivo será $4.800.000–$9.600.000 COP.
            </p>
          </div>
        </section>

        {/* Calculator Component */}
        <EmergencyFundCalculator />

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">¿Dónde ubicarlo? En capas (liquidez superior a rendimiento)</h2>
          <div className="space-y-6">
            <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
              <h3 className="font-luxury text-2xl text-primary mb-4 italic">Capa 1 — Inmediata</h3>
              <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
                Cuenta de ahorros o bolsillo digital separado (alto acceso, costos bajos). <strong className="text-foreground">Meta: 30–60% del fondo.</strong>
              </p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
              <h3 className="font-luxury text-2xl text-primary mb-4 italic">Capa 2 — Casi inmediata</h3>
              <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
                FIC de liquidez o vehículos de muy corto plazo, con rescate ágil. <strong className="text-foreground">Meta: 30–50%.</strong>
              </p>
            </div>
            <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
              <h3 className="font-luxury text-2xl text-primary mb-4 italic">Capa 3 — Planificada</h3>
              <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
                CDT de corto plazo escalonado (ladder) para una porción menor. <strong className="text-foreground">Meta: 0–20%.</strong>
              </p>
            </div>
          </div>
          <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-r-lg">
            <p className="font-elegant text-lg text-foreground leading-relaxed">
              <strong className="text-destructive">Evita el efectivo en casa:</strong> carece de rentabilidad y expone a pérdidas.
            </p>
          </div>
        </section>

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">Ruta de construcción en 90 días</h2>
          <ol className="space-y-4">
            {[
              { title: "Cifra meta", desc: "gastos esenciales × meses objetivo." },
              { title: "Cuenta exclusiva", desc: "abre un contenedor independiente (no mezcles)." },
              { title: "Automatización", desc: "débito programado el día de pago." },
              { title: "Ajustes invisibles", desc: "eleva tu aporte 5–10% cuando suba el ingreso." },
              { title: "Ingresos extraordinarios", desc: "ventas ocasionales y bonificaciones → directo al fondo." },
              { title: "Escalonamiento", desc: "distribuye en las tres capas según tu tolerancia al riesgo." },
              { title: "Revisión trimestral", desc: "recalibra con cambios de gasto/ingreso." }
            ].map((step, index) => (
              <li key={index} className="flex items-start space-x-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <div>
                  <strong className="font-elegant text-lg text-foreground">{step.title}:</strong>
                  <span className="font-elegant text-lg text-muted-foreground ml-1">{step.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">Gobierno del fondo (reglas de uso)</h2>
          <div className="grid gap-6">
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/30">
              <h3 className="font-luxury text-xl text-accent mb-3 italic">Uso exclusivo</h3>
              <p className="font-elegant text-lg text-muted-foreground">Solo para emergencias reales (no vacaciones ni compras).</p>
            </div>
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/30">
              <h3 className="font-luxury text-xl text-accent mb-3 italic">Reposición obligatoria</h3>
              <p className="font-elegant text-lg text-muted-foreground">Si lo usas, plan de reposición en 2–3 meses.</p>
            </div>
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/30">
              <h3 className="font-luxury text-xl text-accent mb-3 italic">Separación mental y bancaria</h3>
              <p className="font-elegant text-lg text-muted-foreground">Evita tarjetas asociadas a esa cuenta.</p>
            </div>
          </div>
        </section>

        {/* Checklist Component */}
        <EmergencyFundChecklist />

        <section className="space-y-8 reveal-up">
          <h3 className="font-luxury text-3xl text-destructive mb-6 italic">Errores frecuentes</h3>
          <ul className="space-y-4">
            {[
              "Sacrificar liquidez por buscar la \"mejor tasa\".",
              "Tomar \"préstamos\" del fondo sin reponerlos.",
              "No actualizar la meta tras cambios de vida (mudanza, hijos, nuevas deudas)."
            ].map((error, index) => (
              <li key={index} className="flex items-start space-x-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <span className="text-destructive">⚠</span>
                <span className="font-elegant text-lg text-muted-foreground">{error}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Component */}
        <BlogFAQ title="Preguntas frecuentes sobre fondos de emergencia" />

        {/* CTA Component */}
        <BlogCTA 
          title="¿Quieres un plan personalizado?"
          description="Agenda una asesoría profesional y diseñamos tu fondo de emergencia con montos exactos, productos específicos y reglas de gobierno adaptadas a tu perfil financiero."
          buttonText="Diseñar mi estrategia"
          whatsappMessage="Hola Amanda, me interesa crear un plan personalizado para mi fondo de emergencia. ¿Podemos agendar una asesoría?"
        />
      </>
    );
  }

  if (post.slug === 'inflacion-y-banco-de-la-republica') {
    return (
      <>
        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">Inflación: el "impuesto silencioso" que erosiona metas</h2>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
            La inflación disminuye el poder de compra con el tiempo. Se evidencia en el mercado, el transporte y servicios. Sin ajustes periódicos, tu presupuesto y tus metas de ahorro pierden tracción.
          </p>
        </section>

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">Cómo se transmite la política monetaria a tu vida financiera</h2>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed mb-6">
            El Banco de la República ajusta su tasa de intervención para encauzar la inflación. Esos movimientos se trasladan, con rezagos, a:
          </p>
          
          <div className="grid gap-4">
            {[
              { title: "Crédito de consumo y tarjetas", desc: "variaciones en tasas efectivas y cuotas." },
              { title: "Vivienda", desc: "hipotecas en UVR (sensibles a inflación) y a tasa fija (protección parcial ante alzas)." },
              { title: "Ahorro e inversión", desc: "tasas de CDT, bonos y FIC de renta fija." },
              { title: "Tipo de cambio y expectativas", desc: "inciden en precios de bienes importados." }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-luxury text-xl text-primary mb-2 italic">{item.title}:</h3>
                <p className="font-elegant text-lg text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg">
            <p className="font-elegant text-lg text-foreground leading-relaxed">
              <strong className="text-accent">Idea clave:</strong> en ciclos de tasas altas, el crédito es más costoso pero la renta fija mejora. En ciclos de bajas, al contrario.
            </p>
          </div>
        </section>

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">Indicadores a monitorear (sin tecnicismos)</h2>
          <ul className="space-y-4 font-elegant text-lg text-muted-foreground">
            {[
              { term: "IPC anual y mensual", desc: "referencia de inflación." },
              { term: "Tasa de intervención", desc: "guía de ciclo monetario." },
              { term: "Expectativas de inflación", desc: "señalan tendencias futuras." },
              { term: "Mercado laboral", desc: "presión sobre ingresos y consumo." }
            ].map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">{item.term}:</strong> {item.desc}</span>
              </li>
            ))}
          </ul>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
            Monitorear estos puntos cada trimestre te ayuda a anticipar ajustes.
          </p>
        </section>

        <BlogFAQ title="Preguntas frecuentes sobre inflación" />

        <BlogCTA 
          title="¿Necesitas un diagnóstico integral?"
          description="Analicemos tus deudas, cuotas y estrategia de ahorro bajo el ciclo económico actual. Diseñamos un plan táctico personalizado por etapas."
          buttonText="Solicitar diagnóstico"
          whatsappMessage="Hola Amanda, me interesa un diagnóstico integral de mi situación financiera considerando la inflación actual. ¿Podemos conversar?"
        />
      </>
    );
  }

  if (post.slug === 'independientes-y-emprendedores-en-bogota') {
    return (
      <>
        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">El desafío de la variabilidad</h2>
          <p className="font-elegant text-lg text-muted-foreground leading-relaxed">
            Ingresos irregulares sin estructura llevan al uso de deuda cara. La solución es diseñar sistemas simples que funcionen incluso en meses flojos.
          </p>
        </section>

        <section className="space-y-8 reveal-up">
          <h2 className="font-luxury text-4xl text-foreground mb-6">Arquitectura financiera del independiente</h2>
          <h3 className="font-luxury text-2xl text-primary mb-6 italic">Sistema de 5 sobres (cuentas separadas):</h3>
          
          <div className="grid gap-4">
            {[
              { num: "1", title: "Negocio", desc: "software, transporte, equipos.", colorClass: "bg-primary/10 border-primary/30 text-primary" },
              { num: "2", title: "Impuestos y obligaciones", desc: "reserva mensual para evitar sorpresas.", colorClass: "bg-destructive/10 border-destructive/30 text-destructive" },
              { num: "3", title: "Seguridad financiera", desc: "fondo de emergencia y protección.", colorClass: "bg-accent/10 border-accent/30 text-accent" },
              { num: "4", title: "Gastos personales fijos", desc: "arriendo, servicios, educación.", colorClass: "bg-secondary/10 border-secondary/30 text-secondary" },
              { num: "5", title: "Vida y crecimiento", desc: "ocio planificado, formación e inversión.", colorClass: "bg-primary/10 border-primary/30 text-primary" }
            ].map((item, index) => (
              <div key={index} className={`p-6 rounded-lg border ${item.colorClass.split(' ')[0]} ${item.colorClass.split(' ')[1]}`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold`}>
                    {item.num}
                  </span>
                  <h3 className={`font-luxury text-xl italic ${item.colorClass.split(' ')[2]}`}>{item.title}</h3>
                </div>
                <p className="font-elegant text-lg text-muted-foreground ml-11">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
            <p className="font-elegant text-lg text-foreground leading-relaxed">
              <strong className="text-primary">Regla de oro:</strong> distribuye al instante cada pago recibido según tu plan. No dejes todo en una sola cuenta.
            </p>
            <p className="font-elegant text-lg text-muted-foreground leading-relaxed mt-4">
              Como referencia inicial (ajustable): 35% negocio, 15% impuestos, 20% seguridad, 20% personales, 10% vida y crecimiento.
            </p>
          </div>
        </section>

        <BlogFAQ title="Preguntas frecuentes para independientes" />

        <BlogCTA 
          title="¿Quieres una plantilla personalizada?"
          description="Te ayudo a implementar el sistema de 5 sobres con porcentajes específicos para tu actividad, plantillas de flujo y plan de estabilización financiera desde la primera semana."
          buttonText="Obtener mi sistema"
          whatsappMessage="Hola Amanda, soy independiente/emprendedor y me interesa implementar el sistema de 5 sobres. ¿Podemos conversar sobre mi situación?"
        />
      </>
    );
  }

  // Fallback for any other posts
  return (
    <div className="prose prose-lg max-w-none">
      <p className="font-elegant text-lg text-muted-foreground">Contenido en desarrollo...</p>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocItems, setTocItems] = useState<Array<{id: string; text: string; level: number}>>([]);
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Get related posts (same categories, excluding current)
  const relatedPosts = useMemo(() => {
    return blogPosts
      .filter(p => 
        p.slug !== slug && 
        p.categories?.some(cat => post.categories?.includes(cat))
      )
      .slice(0, 3);
  }, [slug, post.categories]);

  useEffect(() => {
    // Set page title and meta description
    document.title = `${post.title} | AC`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', post.metaDescription);
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    // Set canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${window.location.origin}/blog/${slug}`);
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }

    // Set Open Graph and Twitter meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('og:title', post.title, true);
    setMeta('og:description', post.metaDescription, true);
    setMeta('og:type', 'article', true);
    setMeta('og:url', `${window.location.origin}/blog/${slug}`, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', post.title);
    setMeta('twitter:description', post.metaDescription);

    // Generate TOC from content
    if (contentRef.current) {
      const headings = Array.from(contentRef.current.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
      const items = headings.map(heading => {
        const id = heading.id || slugify(heading.textContent || '');
        heading.id = id;
        heading.classList.add('scroll-mt-24');
        return {
          id,
          text: heading.textContent || '',
          level: heading.tagName === 'H2' ? 2 : 3
        };
      });
      setTocItems(items);
    }
  }, [post, slug]);

  // IntersectionObserver for blog content visibility
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const targets = root.querySelectorAll(
      'section, p, ul, ol, li, blockquote, pre, code, h2, h3, img'
    );

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [post?.slug]);

  return (
    <div className="min-h-screen">
      {/* Reading Progress */}
      <ReadingProgress />
      
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.metaDescription,
          "datePublished": post.dateISO,
          "dateModified": post.dateISO,
          "author": {
            "@type": "Person",
            "name": "Amanda Cruz"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AC",
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/logo.png`
            }
          },
          "mainEntityOfPage": `${window.location.origin}/blog/${slug}`
        })
      }} />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Inicio",
              "item": `${window.location.origin}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `${window.location.origin}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": `${window.location.origin}/blog/${slug}`
            }
          ]
        })
      }} />
      
      <Header />
      
      <main className="relative z-10 pt-24">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-6 mb-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{post.title}</span>
          </nav>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,4fr)_1fr] gap-8">
          {/* Left sidebar - empty for spacing */}
          <div className="hidden lg:block" />
          
          {/* Main content */}
          <article className="max-w-4xl mx-auto space-y-12">
            {/* Hero Image */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <picture>
                <img 
                  src={post.image} 
                  alt={`Ilustración del artículo: ${post.title}`}
                  width={720}
                  height={480}
                  loading="eager"
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="font-luxury text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Amanda Cruz</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.dateISO}>{post.date}</time>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </header>

            {/* Article Lead */}
            <div className="mb-16">
              <p className="lead font-elegant text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-8 py-6 bg-primary/5 rounded-r-lg shadow-card">
                {post.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div ref={contentRef} className="space-y-12">
              {renderArticleContent(post)}
            </div>
            
            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <Link 
                to="/blog"
                className="inline-flex items-center text-primary hover:text-primary-glow transition-colors animated-underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Link>
            </div>
          </article>
          
          {/* Right sidebar - TOC */}
          <BlogTOC items={tocItems} />
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="container mx-auto px-6 py-16">
            <h2 className="font-luxury text-2xl md:text-3xl text-foreground mb-8 text-center">
              Artículos relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group glass-card rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={`Ilustración del artículo: ${relatedPost.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-luxury text-lg text-foreground mb-2 group-hover:text-primary/90 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;