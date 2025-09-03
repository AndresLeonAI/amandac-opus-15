import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, TrendingUp } from 'lucide-react';

// Dynamically import createGlobe to avoid SSR issues
let createGlobe: any = null;

const GlobalFinancesCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);
  let phi = 0;

  useEffect(() => {
    let isMounted = true;

    const initGlobe = async () => {
      try {
        // Dynamic import for Cobe
        const cobeModule = await import('cobe');
        createGlobe = cobeModule.default;

        if (!isMounted || !canvasRef.current || !createGlobe) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        globeRef.current = createGlobe(canvasRef.current, {
          devicePixelRatio: Math.min(window.devicePixelRatio, 2),
          width: 1000,
          height: 1000,
          phi: 0,
          theta: 0.2,
          dark: 1,
          diffuse: 1.2,
          scale: 1.1,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.3, 0.3, 0.6], // Violet/indigo base
          markerColor: [0.7, 0.4, 1], // Violet markers
          glowColor: [0.6, 0.6, 1], // Light blue glow
          offset: [0, 0],
          markers: [
            { location: [4.7110, -74.0721], size: 0.06 }, // Bogotá
            { location: [40.4168, -3.7038], size: 0.04 }, // Madrid
            { location: [25.7617, -80.1918], size: 0.04 }, // Miami
            { location: [19.4326, -99.1332], size: 0.04 }, // CDMX
          ],
          onRender: (state) => {
            if (!prefersReducedMotion) {
              state.phi = phi;
              phi += 0.003;
            }
          },
        });
      } catch (error) {
        console.error('Error loading globe:', error);
      }
    };

    initGlobe();

    return () => {
      isMounted = false;
      if (globeRef.current) {
        globeRef.current.destroy?.();
      }
    };
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/573114688067?text=Hola%20Amanda,%20me%20interesa%20organizar%20mis%20finanzas%20en%20varias%20divisas.%20%C2%BFpodemos%20agendar%20una%20conversaci%C3%B3n%3F', '_blank');
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-background/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            {/* Globe Section */}
            <div className="relative h-80">
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
                width="1000"
                height="1000"
                className="absolute inset-0"
                aria-hidden="true"
              />
              
              {/* Title Overlay */}
              <div className="absolute top-6 left-6 z-10">
                <h2 className="font-luxury text-3xl md:text-4xl font-bold text-white mb-2">
                  Finanzas en cualquier divisa
                </h2>
                <p className="font-elegant text-white/80 text-lg max-w-md">
                  Protege tu ahorro y planifica entre USD · EUR · COP (y más) según tu realidad.
                </p>
              </div>
              
              {/* Legend Chips */}
              <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md rounded-lg p-3 z-10">
                <div className="flex flex-col space-y-2 text-xs text-white">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-violet-500 mr-2 flex-shrink-0"></span>
                    <span className="font-elegant">Ingreso/Gasto</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-400 mr-2 flex-shrink-0"></span>
                    <span className="font-elegant">Referencia/Cambio</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8 bg-background/40 backdrop-blur-sm">
              {/* Two Columns */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-5 h-5 text-primary" />
                    <h3 className="font-luxury text-lg font-semibold text-foreground">
                      Plan claro en varias divisas
                    </h3>
                  </div>
                  <p className="font-elegant text-muted-foreground leading-relaxed">
                    Orden para ingresos y gastos en distintas monedas.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-luxury text-lg font-semibold text-foreground">
                      Menos fricción cambiaria
                    </h3>
                  </div>
                  <p className="font-elegant text-muted-foreground leading-relaxed">
                    Evitamos pérdidas por tipo de cambio con reglas simples.
                  </p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6"></div>
              
              {/* Ethics Note */}
              <p className="font-elegant text-xs text-muted-foreground/80 mb-8 text-center">
                Orientación educativa. No es recomendación específica.
              </p>
              
              {/* CTA */}
              <div className="text-center">
                <Button 
                  onClick={handleWhatsApp}
                  size="lg"
                  className="bg-primary hover:bg-primary-glow text-primary-foreground px-10 py-6 text-lg shadow-elegant hover:shadow-glow transition-all duration-300 group hover:scale-102"
                >
                  <span className="font-elegant">Conversemos tu estrategia</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalFinancesCard;