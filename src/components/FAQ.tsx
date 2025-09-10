import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlareCard } from '@/components/ui/glare-card';

const faqs = [
  {
    question: "¿Cuál es el monto mínimo de inversión?",
    answer: "El monto de inversión se adapta a tus metas de libertad financiera y a la estrategia para el desmonte de deudas, ya que cada plan es personalizado."
  },
  {
    question: "¿Qué medidas tomamos para que tu información financiera esté 100% protegida?",
    answer: "Implementamos protocolos de confidencialidad de alto nivel, con acuerdos de no divulgación respaldados por instituciones financieras reconocidas. Además, cada plan incluye un nivel de seguridad acorde al tipo de inversión, garantizando que tus datos, tus movimientos y tu estrategia estén blindados frente a terceros."
  },
  {
    question: "¿Por qué confiar tu estrategia financiera con nosotros y no con un servicio tradicional?",
    answer: "No trabajamos con fórmulas estándar. Cada plan está diseñado a tu medida, con un enfoque que combina análisis técnico, gestión de riesgo y diversificación. Dependiendo de tu nivel de inversión y tus objetivos, recibirás un número específico de reuniones y reportes personalizados, para que siempre tengas claridad total sobre tus activos y decisiones."
  },
  {
    question: "¿Cada cuánto monitoreamos y ajustamos tu portafolio según el plan que elijas?",
    answer: "Ofrecemos revisiones periódicas garantizadas, que dependen del plan que contrates: algunos incluyen reuniones mensuales o incluso quincenales, mientras que otros se enfocan en revisiones trimestrales estratégicas. Además, si el mercado presenta movimientos relevantes, activamos sesiones adicionales para que tu estrategia siempre esté al día y aproveches cada oportunidad."
  },
  {
    question: "¿Cómo sé si tu asesoría es la indicada para mí?",
    answer: "Antes de iniciar, realizamos una consulta inicial sin compromiso en la que evaluamos tus objetivos financieros, tu perfil de riesgo y tu situación actual. De esta forma, sabrás si el servicio realmente encaja contigo antes de invertir."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-luxury text-3xl md:text-4xl text-primary mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="font-elegant text-white text-lg max-w-xl mx-auto">
            Consultas comunes sobre asesoría financiera
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
              <GlareCard
                key={index}
                className="p-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-primary/20 rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-6 py-4 hover:bg-primary/5 transition-all duration-300 group flex items-center justify-between"
                  >
                    <h3 className="font-luxury text-lg text-white group-hover:text-primary-glow transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-primary transition-colors duration-300" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-primary/10"
                      >
                        <div className="px-6 pb-4 pt-3 text-white/80 font-elegant leading-relaxed text-sm">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </GlareCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;