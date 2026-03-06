import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

const CTASection = () => {
  const scrollToBooking = useScrollToBooking();

  return <section className="py-24 relative overflow-hidden">
    {/* Background with subtle glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-background via-primary/5 to-background" />

    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h2 className="font-luxury text-4xl md:text-6xl text-primary mb-8">
          Comience su transformación
          <span className="block text-foreground">
            financiera hoy
          </span>
        </h2>

        {/* Description */}
        <p className="font-elegant text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Una conversación puede cambiar el rumbo de su patrimonio.
          <span className="font-luxury text-primary/80"> Agenda su consulta estratégica.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button variant="premium" size="lg" className="px-10 py-6 text-lg font-elegant tracking-wide group" onClick={scrollToBooking}>
            <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            Agendar consulta privada
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>


        </div>

        {/* Contact info */}
        <div className="mt-16 pt-8 border-t border-border/20">
          <p className="font-elegant text-foreground/50 text-sm">
            Consultas confidenciales disponibles • Respuesta en 24 horas
          </p>
        </div>
      </div>
    </div>
  </section>;
};
export default CTASection;