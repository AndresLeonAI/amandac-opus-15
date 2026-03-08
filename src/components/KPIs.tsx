import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const kpis = [
  {
    value: "$1M+",
    label: "de patrimonio bajo gestión"
  },
  {
    value: "+150",
    label: "clientes de alto patrimonio"
  },
  {
    value: "24+",
    label: "Años de experiencia"
  }
];

const KPIs = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current.querySelectorAll('.kpi-item'), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="kpi-item text-center group cursor-pointer"
            >
              <div className="font-luxury text-4xl md:text-5xl text-primary mb-2 transition-all duration-300 group-hover:text-shadow-neon-blue group-hover:text-primary-glow">
                {kpi.value}
              </div>
              <p className="font-elegant text-white text-lg transition-colors duration-300 group-hover:text-primary-glow">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KPIs;