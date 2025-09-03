import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import createGlobe from 'cobe';

const GlobalFinancesCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    let phi = 0;
    let isReducedMotion = false;

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };
    checkReducedMotion();

    if (canvasRef.current) {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 1000,
        height: 1000,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        scale: 1.1,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.6], // Violet/indigo base matching brand
        markerColor: [0.6, 0.4, 1], // Purple for "Ingreso/Gasto"
        glowColor: [0.7, 0.7, 1], // Light glow
        offset: [0, 0],
        markers: [
          { location: [4.7110, -74.0721], size: 0.06 }, // Bogotá
          { location: [40.4168, -3.7038], size: 0.04 }, // Madrid
          { location: [25.7617, -80.1918], size: 0.04 }, // Miami
          { location: [19.4326, -99.1332], size: 0.03 }, // CDMX
        ],
        onRender: (state) => {
          if (!isReducedMotion) {
            state.phi = phi;
            phi += 0.003;
          }
        },
      });
    }

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
      }
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola Amanda, me interesa organizar mis finanzas en varias divisas. ¿podemos agendar una conversación?');
    window.open(`https://wa.me/573114688067?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-md w-full mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden shadow-elegant border border-white/20 backdrop-blur-xl">
            {/* Globe Canvas Section */}
            <div className="relative h-64">
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
                width="1000"
                height="1000"
                className="absolute inset-0"
                aria-hidden="true"
              />
              
              {/* Title Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <h2 className="font-luxury text-2xl font-bold text-white mb-1">
                  Finanzas en cualquier divisa
                </h2>
                <p className="font-elegant text-white/70 text-sm">
                  Protege tu ahorro y planifica entre USD · EUR · COP (y más) según tu realidad.
                </p>
              </div>
              
              {/* Legend Chips */}
              <div className="absolute bottom-3 right-4 bg-black/30 backdrop-blur-md rounded-lg p-2 z-10">
                <div className="flex space-x-3 text-xs text-white">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-violet-500 mr-1"></span>
                    <span className="font-elegant">Ingreso/Gasto</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-400 mr-1"></span>
                    <span className="font-elegant">Referencia/Cambio</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 bg-black/40">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-luxury text-base font-medium text-white mb-1">
                    Plan claro en varias divisas
                  </h3>
                  <p className="font-elegant text-xs text-white/60">
                    Orden para ingresos y gastos en distintas monedas.
                  </p>
                </div>
                <div>
                  <h3 className="font-luxury text-base font-medium text-white mb-1">
                    Menos fricción cambiaria
                  </h3>
                  <p className="font-elegant text-xs text-white/60">
                    Evitamos pérdidas por tipo de cambio con reglas simples.
                  </p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-white/10 pt-4 mb-4">
                <p className="font-elegant text-white/70 text-sm">
                  Nuestra presencia global permite servir clientes con expertise local y soporte integral.
                </p>
              </div>
              
              {/* Ethical Note */}
              <p className="font-elegant text-white/50 text-xs mb-4">
                Orientación educativa. No es recomendación específica.
              </p>
              
              {/* CTA Button */}
              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-elegant px-6 py-3 shadow-elegant hover:shadow-glow transition-all duration-300 group hover:scale-102"
              >
                <span>Conversemos tu estrategia</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalFinancesCard;