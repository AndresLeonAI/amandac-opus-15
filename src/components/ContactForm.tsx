import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { GlassCombobox } from '@/components/ui/glass-combobox';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    patrimony: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send data to webhook
      await fetch('https://hook.us2.make.com/eb9r7lfa76wkl12lfdkos4xudropmcmz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Success message - form submitted to webhook only
      
      toast({
        title: "Formulario enviado",
        description: "Te conectaremos directamente con Amanda Cruz.",
      });
    } catch (error) {
      console.error('Error sending form:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el formulario. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppDirect = () => {
    window.open('https://wa.me/573114688067?text=Hola%20Amanda,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20de%20asesoría%20financiera.', '_blank');
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-luxury text-4xl md:text-5xl text-primary mb-6">
            Transforma tu futuro financiero.
          </h2>
          <p className="font-elegant text-muted-foreground text-lg max-w-2xl mx-auto">
            Inicie su transformación financiera. Primera consulta de 30-40 minutos, sin costo y sin compromiso.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-luxury text-2xl text-primary mb-6">
                Información de contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-elegant text-foreground/90 font-medium">WhatsApp directo</p>
                    <button 
                      onClick={handleWhatsAppDirect}
                      className="font-elegant text-primary hover:text-primary-glow transition-colors duration-300"
                    >
                      +57 311 468 8067
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-elegant text-foreground/90 font-medium">Email privado</p>
                    <p className="font-elegant text-muted-foreground">amanda.cruz@axia.com.co</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-elegant text-foreground/90 font-medium">Oficinas</p>
                    <p className="font-elegant text-muted-foreground">Bogota</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/20 backdrop-blur-sm border border-border/20 rounded-lg p-6">
              <h4 className="font-luxury text-lg text-primary mb-3">Horarios de atención</h4>
              <div className="space-y-2 font-elegant text-sm text-muted-foreground">
                <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
                <p className="text-primary/80">Consultas urgentes: 24/7 WhatsApp</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-elegant text-sm text-muted-foreground mb-2">
                    Nombre completo *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-card/20 border-border/20 focus:border-primary/50"
                    placeholder="Su nombre"
                  />
                </div>
                
                <div>
                  <label className="block font-elegant text-sm text-muted-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-card/20 border-border/20 focus:border-primary/50"
                    placeholder="su@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-elegant text-sm text-muted-foreground mb-2">
                    Teléfono
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-card/20 border-border/20 focus:border-primary/50"
                    placeholder="+57 300 000 0000"
                  />
                </div>
                
                <div>
                  <GlassCombobox
                    label="Patrimonio aproximado (COP)"
                    placeholder="Seleccionar rango"
                    helpText="Nos ayuda a recomendar el plan correcto. Puedes no responder."
                    tooltip="Patrimonio = activos totales menos deudas. Si prefieres, indícanos solo lo invertible."
                    footerText="¿Manejas parte en USD? Calculamos al TRM del día automáticamente."
                    value={formData.patrimony}
                    onChange={(value) => setFormData({ ...formData, patrimony: value })}
                    options={[
                      { value: "$50-150M", label: "$50–$150 millones" },
                      { value: "$150-300M", label: "$150–$300 millones" },
                      { value: "$300-700M", label: "$300–$700 millones" },
                      { value: "$700M-1.5B", label: "$700 millones – $1.5 mil millones" },
                      { value: "$1.5-3B", label: "$1.5 – $3 mil millones" },
                      { value: "$3-5B", label: "$3 – $5 mil millones" },
                      { value: "$5B+", label: "Más de $5 mil millones" },
                      { value: "no-specify", label: "Prefiero no especificar" }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block font-elegant text-sm text-muted-foreground mb-2">
                  Mensaje
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="bg-card/20 border-border/20 focus:border-primary/50 resize-none"
                  placeholder="Cuéntenos sobre sus objetivos financieros y cómo podemos ayudarle..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="premium"
                className="w-full px-8 py-6 text-lg group"
              >
                <Send className="w-5 h-5 mr-3" />
                Enviar solicitud
              </Button>

              <p className="text-center font-elegant text-xs text-muted-foreground">
                Al enviar, acepta ser contactado via WhatsApp para consulta confidencial
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;