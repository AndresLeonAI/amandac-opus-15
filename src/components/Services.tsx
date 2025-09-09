import { TrendingUp, Shield, Target, Gem } from 'lucide-react';
import { GlareCard } from '@/components/ui/glare-card';
import { useTiltEffect } from '@/hooks/use-tilt-effect';
const services = [{
  icon: TrendingUp,
  title: 'Gestión de Carteras',
  subtitle: 'Estrategias a medida',
  description: 'Diseño, implementación y seguimiento de carteras multiactivo alineadas a su perfil de riesgo, horizonte y necesidades de liquidez. Estructuramos la asignación de activos con rebalanceos disciplinados, incorporando como motor de crecimiento una exposición eficiente al S&P 500 (benchmark global de renta variable) mediante vehículos indexados de alta calidad y bajo costo, complementados con renta fija y estrategias de cobertura cuando aplica. Entregamos reportes claros con métricas de riesgo, tracking error y desempeño para decisiones informadas.'
}, {
  icon: Shield,
  title: 'Preservación Patrimonial',
  subtitle: 'Protección integral',
  description: 'Enfoque prioritario en desmonte de deudas y preservación del patrimonio. Realizamos auditoría de pasivos, diseñamos un plan de desendeudamiento escalonado (priorización por tasa efectiva, plazo y riesgo), renegociación de condiciones y creación de reservas de liquidez. Paralelamente, implementamos políticas de blindaje patrimonial: segregación de activos, diversificación por divisa y jurisdicción, y coordinación con asesores legales/fiscales para estructuras sucesorales robustas y confidenciales.'
}, {
  icon: Target,
  title: 'Planificación Estratégica',
  subtitle: 'Objetivos claros',
  description: 'Trazamos un plan financiero integral a 3–10 años con metas cuantificables (independencia, educación, retiro, adquisición de activos). Incluye proyecciones de flujo, escenarios y pruebas de estrés, calendario de aportes, reglas de retiro y una Política de Inversión (IPS) que armoniza: ritmo de desendeudamiento, preservación de capital y crecimiento vía exposición al S&P 500 y renta fija de alta calidad. Realizamos revisiones periódicas para mantener la alineación con objetivos y coyuntura.'
}, {
  icon: Gem,
  title: 'Inversiones Inteligentes',
  subtitle: 'Oportunidades exclusivas',
  description: 'Acceso curado a oportunidades con diligencia independiente: renta fija grado inversión, bonos ligados a inflación, real estate institucional, fondos privados (PE/VC) y notas estructuradas. A través de brokers internacionales regulados, podemos gestionar inversiones en productos de gestoras globales como BlackRock o J.P. Morgan, con tickets mínimos claros, ventanas de salida definidas y una evaluación rigurosa de liquidez, costos y encaje con su perfil.'
}];
const Services = () => {
  return <section id="asesoria-estrategia" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-luxury text-4xl md:text-5xl text-primary mb-6">
            Asesoria 
            <span className="text-slate-50"> Estrategia</span>
          </h2>
          <p className="font-elegant text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada cliente recibe una estrategia única, diseñada para sus objetivos específicos y perfil de riesgo.
          </p>
        </div>

        {/* Desktop: Vertical Scroll-Snap Layout */}
        <div className="hidden lg:block">
          <div className="w-full max-w-4xl mx-auto" style={{ scrollSnapType: 'y mandatory' }}>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index} 
                  className="min-h-screen flex items-center justify-center py-16 fade-in" 
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div className="w-full max-w-2xl mx-auto">
                    <div 
                      ref={useTiltEffect(15) as React.RefObject<HTMLDivElement>}
                      className="p-12 group cursor-pointer glass-card rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:shadow-glow hover:-translate-y-1 transform-gpu will-change-transform relative overflow-hidden"
                      style={{
                        '--mouse-x': '50%',
                        '--mouse-y': '50%',
                      } as React.CSSProperties}
                    >
                      {/* Glare effects */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `
                              radial-gradient(
                                600px circle at var(--mouse-x) var(--mouse-y),
                                hsla(var(--primary), 0.15),
                                transparent 40%
                              )
                            `,
                          }}
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30">
                        <div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `
                              radial-gradient(
                                300px circle at var(--mouse-x) var(--mouse-y),
                                rgba(255, 255, 255, 0.1),
                                transparent 40%
                              )
                            `,
                          }}
                        />
                      </div>

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="mb-8 text-center">
                          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 pulse-glow">
                            <Icon className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors duration-300" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="font-luxury text-3xl text-primary mb-3 font-medium group-hover:text-primary-glow transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="font-elegant text-primary/80 text-lg mb-6 group-hover:text-primary transition-colors duration-300">
                            {service.subtitle}
                          </p>
                          <p className="font-elegant text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 max-w-xl mx-auto">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet: Original Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="fade-in" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                <div 
                  ref={useTiltEffect(12) as React.RefObject<HTMLDivElement>}
                  className="p-8 h-full group cursor-pointer glass-card rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:shadow-glow hover:-translate-y-1 transform-gpu will-change-transform relative overflow-hidden"
                  style={{
                    '--mouse-x': '50%',
                    '--mouse-y': '50%',
                  } as React.CSSProperties}
                >
                  {/* Glare effects */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `
                          radial-gradient(
                            600px circle at var(--mouse-x) var(--mouse-y),
                            hsla(var(--primary), 0.15),
                            transparent 40%
                          )
                        `,
                      }}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30">
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `
                          radial-gradient(
                            300px circle at var(--mouse-x) var(--mouse-y),
                            rgba(255, 255, 255, 0.1),
                            transparent 40%
                          )
                        `,
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 pulse-glow">
                        <Icon className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-elegant text-xl text-primary mb-2 font-medium group-hover:text-primary-glow transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="font-luxury text-primary/80 text-sm mb-4 group-hover:text-primary transition-colors duration-300">
                      {service.subtitle}
                    </p>
                    <p className="font-elegant text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>;
};
export default Services;