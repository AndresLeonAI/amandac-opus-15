import { motion } from 'framer-motion';
const AboutAmanda = () => {
  return <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Text Content - Left */}
          <motion.div className="text-left" initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="font-luxury text-4xl md:text-5xl text-primary mb-12">
              Sobre 
              <span className="text-foreground"> Amanda Cruz</span>
            </h2>
            
            <div className="space-y-6 font-elegant text-lg text-muted-foreground leading-relaxed">
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }} className="text-slate-100">
                Amanda Cruz es una asesora financiera con más de 24 años de trayectoria, especializada en la planeación de portafolios e inversiones internacionales. Desde Bogotá, y como parte de AXIA, ha acompañado a profesionales, empresarios y familias a transformar la manera en que manejan su patrimonio.
              </motion.p>
              
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="text-slate-100">
                A lo largo de su carrera, ha ayudado a más de 150 profesionales a fortalecer y hacer crecer su patrimonio, gracias a estrategias personalizadas que combinan diversificación global, optimización del riesgo y un acompañamiento cercano en cada etapa.
              </motion.p>
              
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }} className="text-slate-100">
                En 2024 fue nombrada <span className="text-primary font-medium">"Mejor Asesor Financiero del Año"</span> por United Financial Consultants (UFC), reconocimiento que se suma a otros logros obtenidos a lo largo de su carrera.
              </motion.p>
              
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.4
            }} className="text-slate-100">
                La filosofía de Amanda es clara: cada cliente merece un plan financiero diseñado a su medida, con visión global y resultados concretos que se traduzcan en seguridad y crecimiento a largo plazo.
              </motion.p>
            </div>
          </motion.div>

          {/* Image - Right */}
          <motion.div className="relative" initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            <div className="relative rounded-2xl overflow-hidden">
              <img src="/lovable-uploads/5ce75e4d-ecd2-4490-8c38-8289c7e3a6e9.png" alt="Amanda Cruz, asesora financiera especializada en inversiones internacionales" className="w-full h-auto object-cover rounded-2xl shadow-elegant" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default AboutAmanda;