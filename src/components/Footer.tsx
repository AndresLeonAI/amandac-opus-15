import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-background border-t border-border/20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="font-luxury text-3xl text-foreground">
              Amanda Cruz
            </div>
            <p className="font-luxury text-foreground/60 leading-relaxed">Asesorías financieras Personalizadas para patrimonios que exigen excelencia y discreción absoluta.</p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-luxury text-foreground font-medium text-lg">
              Contacto
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-foreground/60">
                <Mail className="w-5 h-5" />
                <span className="font-luxury">amanda.cruz@axia.com.co</span>
              </div>
              <div className="flex items-center space-x-3 text-foreground/60">
                <Phone className="w-5 h-5" />
                <span className="font-luxury">+57 311 468 8067</span>
              </div>
              <div className="flex items-center space-x-3 text-foreground/60">
                <MapPin className="w-5 h-5" />
                <span className="font-luxury">Grand Hyatt | Bogotá</span>
              </div>
            </div>
          </div>

          {/* Services & Legal */}
          <div className="space-y-6">
            <h3 className="font-luxury text-foreground font-medium text-lg">
              Servicios
            </h3>
            <div className="space-y-3">
              <a href="#" className="block font-luxury text-foreground/60 hover:text-foreground animated-underline transition-colors">
                Gestión de Carteras
              </a>
              <a href="#" className="block font-luxury text-foreground/60 hover:text-foreground animated-underline transition-colors">
                Planificación Patrimonial
              </a>
              <a href="#" className="block font-luxury text-foreground/60 hover:text-foreground animated-underline transition-colors">
                Inversiones Premium
              </a>
              <a href="#" className="block font-luxury text-foreground/60 hover:text-foreground animated-underline transition-colors">
                Consultoría Estratégica
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="#" className="text-foreground/40 hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-foreground/40 hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="flex space-x-8 text-sm">
            <span className="font-luxury text-foreground/40">
              Desarrollado Con mucho Amor Por <a href="https://andresleonai.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground animated-underline transition-colors">Andres Leon</a>
            </span>
            <a href="#" className="font-luxury text-foreground/40 hover:text-foreground animated-underline transition-colors">
              Privacidad
            </a>
            <a href="#" className="font-luxury text-foreground/40 hover:text-foreground animated-underline transition-colors">
              Términos
            </a>
            <span className="font-luxury text-foreground/40">© 2025 Amanda Cruz</span>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;