import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlareCard } from '@/components/ui/glare-card';

const faqs = [
  {
    question: "¿Cuál es el monto mínimo de inversión?",
    answer: "Trabajo con patrimonios a partir de $500,000 USD para ofrecer atención personalizada."
  },
  {
    question: "¿Cómo garantizas la confidencialidad?",
    answer: "Protocolos estrictos de confidencialidad y acuerdos de no divulgación con instituciones de primer nivel."
  },
  {
    question: "¿Qué diferencia tu servicio?",
    answer: "Enfoque completamente personalizado. Estrategias diseñadas específicamente para cada cliente con control total de activos."
  },
  {
    question: "¿Con qué frecuencia revisamos la estrategia?",
    answer: "Revisiones trimestrales obligatorias y reuniones adicionales según necesidad del mercado."
  },
  {
    question: "¿Cuáles son tus honorarios?",
    answer: "Transparentes, basados en porcentaje de activos bajo gestión. Se discute en consulta inicial."
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