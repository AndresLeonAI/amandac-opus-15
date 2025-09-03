import { motion } from 'framer-motion';

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
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {kpis.map((kpi, index) => (
            <motion.div
              key={index}
              className="text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="font-luxury text-4xl md:text-5xl text-primary mb-2 transition-all duration-300 group-hover:text-shadow-neon-blue group-hover:text-primary-glow">
                {kpi.value}
              </div>
              <p className="font-elegant text-white text-lg transition-colors duration-300 group-hover:text-primary-glow">
                {kpi.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KPIs;