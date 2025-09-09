import { useState, useEffect, useRef } from 'react';
import { Search, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/TiltCard';

const steps = [
  {
    number: 'Paso 1',
    icon: Search,
    title: 'Diagnóstico',
    subtitle: 'Análisis profundo de su situación actual y objetivos específicos',
    userActions: [
      'Comparte su situación financiera actual',
      'Define objetivos claros y plazos',
      'Expresa preferencias de riesgo'
    ],
    ourActions: [
      'Auditamos su cartera existente',
      'Identificamos gaps y oportunidades',
      'Diseñamos estrategia personalizada'
    ]
  },
  {
    number: 'Paso 2',
    icon: Target,
    title: 'Estrategia',
    subtitle: 'Desarrollo de plan de acción adaptado a su perfil y metas',
    userActions: [
      'Revisa la propuesta estratégica',
      'Pregunta y ajusta detalles',
      'Aprueba el plan de implementación'
    ],
    ourActions: [
      'Estructuramos la cartera objetivo',
      'Seleccionamos instrumentos óptimos',
      'Establecemos cronograma de ejecución'
    ]
  },
  {
    number: 'Paso 3',
    icon: Users,
    title: 'Acompañamiento',
    subtitle: 'Implementación y seguimiento continuo de resultados',
    userActions: [
      'Recibe reportes periódicos',
      'Participa en revisiones trimestrales',
      'Comunica cambios en objetivos'
    ],
    ourActions: [
      'Ejecutamos la estrategia acordada',
      'Monitoreamos y rebalanceamos',
      'Adaptamos según condiciones de mercado'
    ]
  }
];

const Process = () => {
  const [activeStep, setActiveStep] = useState(0);
  const processRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepElements = entry.target.querySelectorAll('.process-step');
            stepElements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('in-view');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (processRef.current) {
      observer.observe(processRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={processRef} id="proceso" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-luxury text-4xl md:text-5xl text-primary mb-6">
            Proceso
            <span className="text-foreground"> meticuloso</span>
          </h2>
          <p className="font-elegant text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada decisión financiera requiere precisión quirúrgica. Nuestro método garantiza resultados excepcionales.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="space-y-16 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  {/* Icon and Title */}
                  <div className={`text-center lg:text-left ${isEven ? '' : 'lg:col-start-2'}`}>
                    <div className="flex items-center justify-center lg:justify-start mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <span className="font-luxury text-xl text-primary">{step.number}</span>
                    </div>
                    <h3 className="font-luxury text-3xl text-primary mb-4">{step.title}</h3>
                    <p className="font-elegant text-muted-foreground text-lg mb-8">{step.subtitle}</p>
                  </div>

                  {/* Process Cards */}
                  <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-1'}`}>
                    {/* User Actions Card */}
                    <TiltCard className="p-6" intensity={10}>
                      <h4 className="font-elegant text-lg text-primary mb-4 font-medium">LO QUE USTED HACE</h4>
                      <ul className="space-y-2">
                        {step.userActions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="font-elegant text-muted-foreground">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </TiltCard>

                    {/* Our Actions Card */}
                    <TiltCard className="p-6" intensity={10}>
                      <h4 className="font-elegant text-lg text-primary mb-4 font-medium">LO QUE NOSOTROS HACEMOS</h4>
                      <ul className="space-y-2">
                        {step.ourActions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="font-elegant text-muted-foreground">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </TiltCard>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;