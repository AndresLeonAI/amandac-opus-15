import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ChevronRight, Calculator, CheckSquare, HelpCircle, TrendingUp, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
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
    content: `
      <h2>¿Qué es y por qué es estratégico?</h2>
      <p>Un fondo de emergencia es un mecanismo de protección financiera diseñado para cubrir eventos no planificados (salud, reparaciones, desempleo temporal) sin recurrir a deuda costosa. En entornos urbanos como Bogotá, donde el costo de vida y la movilidad influyen en el presupuesto, mantener liquidez dedicada reduce el riesgo de sobreendeudamiento y preserva tus metas de mediano plazo.</p>
      
      <p><strong>Propósito:</strong> garantizar de 3 a 6 meses de gastos esenciales, con acceso rápido y seguridad del capital.</p>

      <h2>¿De qué tamaño debe ser?</h2>
      <ul>
        <li><strong>Ingresos estables (nómina):</strong> 3–4 meses de gastos esenciales.</li>
        <li><strong>Ingresos variables (independientes):</strong> 4–6 meses.</li>
        <li><strong>Hogares con dependientes o alto endeudamiento:</strong> considera el rango superior.</li>
      </ul>
      
      <p>Gastos esenciales incluyen arriendo, alimentación, servicios públicos, transporte, salud, educación y pagos mínimos de deuda.</p>
      
      <p><strong>Ejemplo (Bogotá):</strong> si tus gastos esenciales son $1.600.000 COP, tu rango objetivo será $4.800.000–$9.600.000 COP.</p>

      <h2>¿Dónde ubicarlo? En capas (liquidez > rendimiento)</h2>
      <ul>
        <li><strong>Capa 1 — Inmediata:</strong> cuenta de ahorros o bolsillo digital separado (alto acceso, costos bajos). Meta: 30–60% del fondo.</li>
        <li><strong>Capa 2 — Casi inmediata:</strong> FIC de liquidez o vehículos de muy corto plazo, con rescate ágil. Meta: 30–50%.</li>
        <li><strong>Capa 3 — Planificada:</strong> CDT de corto plazo escalonado (ladder) para una porción menor. Meta: 0–20%.</li>
      </ul>
      
      <p><strong>Evita el efectivo en casa:</strong> carece de rentabilidad y expone a pérdidas.</p>

      <h2>Ruta de construcción en 90 días</h2>
      <ol>
        <li><strong>Cifra meta:</strong> gastos esenciales × meses objetivo.</li>
        <li><strong>Cuenta exclusiva:</strong> abre un contenedor independiente (no mezcles).</li>
        <li><strong>Automatización:</strong> débito programado el día de pago.</li>
        <li><strong>Ajustes invisibles:</strong> eleva tu aporte 5–10% cuando suba el ingreso.</li>
        <li><strong>Ingresos extraordinarios:</strong> ventas ocasionales y bonificaciones → directo al fondo.</li>
        <li><strong>Escalonamiento:</strong> distribuye en las tres capas según tu tolerancia al riesgo.</li>
        <li><strong>Revisión trimestral:</strong> recalibra con cambios de gasto/ingreso.</li>
      </ol>

      <h2>Gobierno del fondo (reglas de uso)</h2>
      <ul>
        <li><strong>Uso exclusivo:</strong> solo para emergencias reales (no vacaciones ni compras).</li>
        <li><strong>Reposición obligatoria:</strong> si lo usas, plan de reposición en 2–3 meses.</li>
        <li><strong>Separación mental y bancaria:</strong> evita tarjetas asociadas a esa cuenta.</li>
      </ul>

      <h3>Errores frecuentes</h3>
      <ul>
        <li>Sacrificar liquidez por buscar la "mejor tasa".</li>
        <li>Tomar "préstamos" del fondo sin reponerlos.</li>
        <li>No actualizar la meta tras cambios de vida (mudanza, hijos, nuevas deudas).</li>
      </ul>
    `
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
    content: `
      <h2>Inflación: el "impuesto silencioso" que erosiona metas</h2>
      <p>La inflación disminuye el poder de compra con el tiempo. Se evidencia en el mercado, el transporte y servicios. Sin ajustes periódicos, tu presupuesto y tus metas de ahorro pierden tracción.</p>

      <h2>Cómo se transmite la política monetaria a tu vida financiera</h2>
      <p>El Banco de la República ajusta su tasa de intervención para encauzar la inflación. Esos movimientos se trasladan, con rezagos, a:</p>
      
      <ul>
        <li><strong>Crédito de consumo y tarjetas:</strong> variaciones en tasas efectivas y cuotas.</li>
        <li><strong>Vivienda:</strong> hipotecas en UVR (sensibles a inflación) y a tasa fija (protección parcial ante alzas).</li>
        <li><strong>Ahorro e inversión:</strong> tasas de CDT, bonos y FIC de renta fija.</li>
        <li><strong>Tipo de cambio y expectativas:</strong> inciden en precios de bienes importados.</li>
      </ul>
      
      <p><strong>Idea clave:</strong> en ciclos de tasas altas, el crédito es más costoso pero la renta fija mejora. En ciclos de bajas, al contrario.</p>

      <h2>Indicadores a monitorear (sin tecnicismos)</h2>
      <ul>
        <li><strong>IPC anual y mensual:</strong> referencia de inflación.</li>
        <li><strong>Tasa de intervención:</strong> guía de ciclo monetario.</li>
        <li><strong>Expectativas de inflación:</strong> señalan tendencias futuras.</li>
        <li><strong>Mercado laboral:</strong> presión sobre ingresos y consumo.</li>
      </ul>
      
      <p>Monitorear estos puntos cada trimestre te ayuda a anticipar ajustes.</p>

      <h2>Plan de acción según tu perfil</h2>
      
      <h3>1) Empleado con deudas de consumo</h3>
      <ul>
        <li>Prioriza amortizaciones extraordinarias en deudas de mayor tasa.</li>
        <li>Evita diferidos largos; prefiere plazos cortos.</li>
        <li>Si el ciclo apunta a bajas de tasas, evalúa refinanciación responsable.</li>
      </ul>

      <h3>2) Hipoteca</h3>
      <ul>
        <li><strong>UVR:</strong> crea un fondo de estabilidad (1–2 cuotas). Revisa prepagos al capital cuando sea viable.</li>
        <li><strong>Tasa fija:</strong> monitorea; si el ciclo baja y los costos de cambio lo permiten, analiza portafolio y alternativas.</li>
      </ul>

      <h3>3) Ahorro e inversión conservadora</h3>
      <ul>
        <li><strong>Ciclo alto:</strong> aprovecha renta fija de corto plazo y escalonamiento de CDT.</li>
        <li><strong>Ciclo bajo:</strong> considera diversificar para sostener rentabilidad real.</li>
      </ul>

      <h3>4) Independientes</h3>
      <ul>
        <li>Construye colchón de 4–6 meses.</li>
        <li>Indexa precios de contratos a métricas objetivas (p. ej., ajustes anuales pactados por escrito).</li>
      </ul>

      <h2>Procedimiento trimestral recomendado</h2>
      <ol>
        <li>Actualiza tu presupuesto con precios reales.</li>
        <li>Calcula si tu rentabilidad neta supera la inflación anual.</li>
        <li>Revisa tu deuda: tasa efectiva, plazo restante y costo de oportunidad de prepagos.</li>
        <li>Ajusta tu asignación de liquidez (cuenta → FIC → renta fija).</li>
        <li>Documenta decisiones y fecha de próxima revisión.</li>
      </ol>

      <h2>Caso práctico (Bogotá)</h2>
      <p>María gasta $2.400.000 COP al mes. Decide:</p>
      <ul>
        <li>Migrar compras recurrentes a débito para no pagar intereses.</li>
        <li>Realizar dos prepagos a su crédito de consumo y renegociar a un plazo menor.</li>
        <li>Trasladar una porción del ahorro a renta fija de corto plazo, manteniendo 3 meses en liquidez inmediata.</li>
      </ul>
      <p><strong>Resultado:</strong> menor gasto en intereses, liquidez suficiente y continuidad de su meta de vivienda a 24 meses.</p>

      <h3>Errores y sesgos comunes</h3>
      <ul>
        <li>Usar proyecciones optimistas y no cifras reales.</li>
        <li>"Perseguir la tasa" descuidando la liquidez necesaria.</li>
        <li>Ignorar comisiones/costos que reducen la rentabilidad neta.</li>
      </ul>
    `
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
    content: `
      <h2>El desafío de la variabilidad</h2>
      <p>Ingresos irregulares sin estructura llevan al uso de deuda cara. La solución es diseñar sistemas simples que funcionen incluso en meses flojos.</p>

      <h2>Arquitectura financiera del independiente</h2>
      <p><strong>Sistema de 5 sobres (cuentas separadas):</strong></p>
      <ol>
        <li><strong>Negocio:</strong> software, transporte, equipos.</li>
        <li><strong>Impuestos y obligaciones:</strong> reserva mensual para evitar sorpresas.</li>
        <li><strong>Seguridad financiera:</strong> fondo de emergencia y protección.</li>
        <li><strong>Gastos personales fijos:</strong> arriendo, servicios, educación.</li>
        <li><strong>Vida y crecimiento:</strong> ocio planificado, formación e inversión.</li>
      </ol>
      
      <p><strong>Regla de oro:</strong> distribuye al instante cada pago recibido según tu plan. No dejes todo en una sola cuenta.</p>
      
      <p>Como referencia inicial (ajustable): 35% negocio, 15% impuestos, 20% seguridad, 20% personales, 10% vida y crecimiento.</p>

      <h2>Calendario operativo (mensual y trimestral)</h2>
      <ul>
        <li><strong>Semana 1:</strong> proyección de ventas y flujo.</li>
        <li><strong>Semana 2:</strong> cobranza activa y seguimiento de facturas.</li>
        <li><strong>Semana 3:</strong> pagos a proveedores y ajuste de presupuesto.</li>
        <li><strong>Semana 4:</strong> revisión de reservas (impuestos/seguridad) y análisis de rentabilidad.</li>
        <li><strong>Trimestral:</strong> auditoría de gastos, actualización de precios y evaluación de cartera (80/20).</li>
      </ul>

      <h2>Facturación y cumplimiento</h2>
      <ul>
        <li>Usa contratos con alcance, entregables y cronograma.</li>
        <li>Solicita anticipos (30–50% según proyecto) y define hitos de pago.</li>
        <li>Establece cláusulas de tiempos de pago y moras.</li>
        <li>Emite facturación formal y conserva soportes.</li>
      </ul>
      
      <p>Para requisitos específicos, consulta a tu contador o autoridad tributaria según tu caso.</p>

      <h2>Protección y continuidad del negocio</h2>
      <ul>
        <li><strong>Fondo de emergencia ampliado:</strong> 4–6 meses de gastos esenciales.</li>
        <li><strong>Seguros según actividad:</strong> vida, salud complementaria, equipos, responsabilidad civil.</li>
        <li><strong>Respaldo operativo:</strong> listas de proveedores alternos y copias de seguridad.</li>
      </ul>

      <h2>Precios y rentabilidad</h2>
      <ul>
        <li>Calcula tu costo por hora incluyendo tiempo no facturable.</li>
        <li>Define márgenes y evita vender solo horas: ofrece paquetes y valor.</li>
        <li>Actualiza precios al menos una vez al año con criterios objetivos documentados.</li>
      </ul>
      
      <p><strong>Fórmula simple de referencia:</strong><br/>
      Precio mínimo sugerido = (Costos totales mensuales / Horas facturables) × (1 + margen objetivo).</p>

      <h2>Tablero de control sugerido</h2>
      <ul>
        <li><strong>Liquidez:</strong> meses de gastos cubiertos.</li>
        <li><strong>Cobranza:</strong> Días de Cartera (DSO) y porcentaje vencido.</li>
        <li><strong>Rentabilidad:</strong> margen neto mensual.</li>
        <li><strong>Concentración:</strong> % del mayor cliente sobre ingresos.</li>
      </ul>

      <h2>Herramientas prácticas</h2>
      <ul>
        <li>Plantillas de propuesta y contrato.</li>
        <li>Hojas de cálculo para flujo y control de facturas.</li>
        <li>Billeteras digitales/bancos con bolsillos.</li>
        <li>Recordatorios en calendario para pagos y cobros.</li>
      </ul>

      <h3>Errores frecuentes</h3>
      <ul>
        <li>Gastar como si todos los meses fueran pico.</li>
        <li>No reservar para impuestos.</li>
        <li>Mezclar finanzas del negocio y personales.</li>
        <li>Postergar protección y ahorro de largo plazo.</li>
      </ul>
    `
  }
];

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
      'p, ul, ol, li, blockquote, pre, code, h2, h3, img'
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

            {/* Article Body */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none prose-headings:font-luxury prose-headings:text-foreground prose-p:font-elegant prose-p:text-muted-foreground prose-li:font-elegant prose-li:text-muted-foreground prose-strong:text-foreground prose-h2:text-3xl prose-h2:mb-8 prose-h3:text-2xl prose-h3:mb-6 prose-p:mb-6 prose-p:leading-relaxed prose-ul:mb-6 prose-ol:mb-6 prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2"
            >
              <p className="lead font-elegant text-xl text-muted-foreground leading-relaxed mb-12 border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg">
                {post.excerpt}
              </p>
              
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              
              {/* Interactive Components for Emergency Fund Article */}
              {post.slug === 'fondo-de-emergencia-en-colombia' && (
                <>
                  <EmergencyFundCalculator />
                  <EmergencyFundChecklist />
                  <BlogFAQ 
                    items={[
                      {
                        question: "¿Puedo \"invertir\" el fondo?",
                        answer: "Sí, en instrumentos de alta liquidez y bajo riesgo. Prioriza acceso rápido."
                      },
                      {
                        question: "¿Puede estar en dólares o cripto?",
                        answer: "No es ideal por volatilidad y tiempos de conversión."
                      },
                      {
                        question: "¿Qué pasa si lo uso parcialmente?",
                        answer: "Define un plan de reposición con aportes adicionales durante 2–3 meses."
                      }
                    ]}
                  />
                  <BlogCTA 
                    title="¿Quieres un plan personalizado?"
                    description="Agenda una asesoría y diseñamos tu fondo con hoja de ruta y reglas de gobierno específicas para tu situación."
                    buttonText="Agendar consulta privada"
                    whatsappMessage="Hola Amanda, me interesa diseñar un fondo de emergencia personalizado con plan y reglas específicas."
                  />
                </>
              )}
              
              {/* FAQ for other articles */}
              {post.slug === 'inflacion-y-banco-de-la-republica' && (
                <>
                  <BlogFAQ 
                    items={[
                      {
                        question: "¿Cambio mi hipoteca UVR a fija?",
                        answer: "Depende de flujo, horizonte y costos de cambio. Requiere simulación personalizada."
                      },
                      {
                        question: "¿Conviene un CDT largo?",
                        answer: "Si anticipas bajas de tasas, prefiere escalonar (varios plazos) y conservar liquidez."
                      },
                      {
                        question: "¿Cómo sé si pierdo contra la inflación?",
                        answer: "Compara tu rentabilidad neta anual con el IPC anual y ajusta tu estrategia."
                      }
                    ]}
                  />
                  <BlogCTA 
                    title="¿Necesitas un diagnóstico integral?"
                    description="Diseñamos un plan táctico por etapas ajustado al ciclo económico actual."
                    buttonText="Solicitar diagnóstico"
                    whatsappMessage="Hola Amanda, me interesa un diagnóstico integral de deudas, cuotas y ahorro bajo el ciclo actual."
                  />
                </>
              )}
              
              {post.slug === 'independientes-y-emprendedores-en-bogota' && (
                <>
                  <BlogFAQ 
                    items={[
                      {
                        question: "¿Cuánto reservo para impuestos?",
                        answer: "Define un porcentaje objetivo con tu contador y ajústalo conforme a tu facturación."
                      },
                      {
                        question: "¿Cómo estabilizo ingresos?",
                        answer: "Crea planes de mantenimiento o membresías que generen pagos recurrentes."
                      },
                      {
                        question: "¿Qué hago si un cliente retrasa pagos?",
                        answer: "Aplica lo pactado en contrato, activa recordatorios y evita depender de un solo cliente."
                      }
                    ]}
                  />
                  <BlogCTA 
                    title="¿Quieres implementar el sistema completo?"
                    description="Agenda una sesión y lo dejamos implementado desde la primera semana con plantillas y porcentajes ajustados."
                    buttonText="Implementar sistema"
                    whatsappMessage="Hola Amanda, me interesa implementar el sistema de 5 sobres con plantillas y plan personalizado."
                  />
                </>
              )}
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
                  className="group led-card rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
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