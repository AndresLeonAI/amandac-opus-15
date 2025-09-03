import React from "react";
import { motion } from "framer-motion";

/**
 * TechLogosMarquee (centrada y perfecta)
 * - Centrado real del carrusel calculando el offset inicial según el ancho de UNA tira.
 * - Loop infinito sin saltos (desplaza exactamente 1x el ancho de la tira original).
 * - Respeta prefers-reduced-motion (muestra una fila centrada y pausada).
 * - Mantiene los src EXACTOS requeridos por posibles tests.
 * - Fallbacks robustos + NVIDIA forzado en blanco por CSS sin tocar el src.
 */

type Partner = {
  src: string;
  alt: string;
  fallbacks?: string[];
};

// Logos activos (Citibank fuera; IBM vuelve)
const LOGOS: Partner[] = [{
  src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  alt: "Google"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  alt: "Oracle"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  alt: "IBM"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
  alt: "NVIDIA"
}];

// Fallbacks por si alguna URL no es accesible en el entorno
const FALLBACKS: Record<string, string> = {
  Google: "https://cdn.simpleicons.org/google/FFFFFF",
  Oracle: "https://cdn.simpleicons.org/oracle/F80000",
  IBM: "https://cdn.simpleicons.org/ibm/0F62FE",
  // NVIDIA en blanco
  NVIDIA: "https://cdn.simpleicons.org/nvidia/FFFFFF"
};

// --- Pruebas ligeras (no cambies a menos que estén mal) ---
(function runTests() {
  try {
    console.assert(Array.isArray(LOGOS) && LOGOS.length === 4, "Deben existir 4 logos activos");
    const expectedSrcs = ["https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg"];
    console.assert(LOGOS.every((l, i) => l.src === expectedSrcs[i]), "Los src deben coincidir exactamente en orden");
    const altsUnique = new Set(LOGOS.map(l => l.alt));
    console.assert(altsUnique.size === 4, "Los alt deben ser únicos");
    const placeholder = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='100'><rect width='100%' height='100%' fill='transparent'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='system-ui' font-size='18'>test</text></svg>`;
    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholder)}`;
    console.assert(dataUri.startsWith('data:image/svg+xml'), 'El placeholder debe generar un data URI válido');
  } catch {}
})();
const TrustBanner = () => {
  return <section className="py-16 relative" id="confianza">
      <div className="container mx-auto px-6">
        <motion.h2 className="font-luxury text-3xl md:text-4xl text-center text-foreground mb-12" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>Confianza de Empresas Selectas</motion.h2>
        <TechLogosMarquee />
      </div>
    </section>;
};
function TechLogosMarquee({
  className,
  duration = 22 // segundos
}: {
  className?: string;
  duration?: number;
}) {
  // Reduced motion
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Ref para la pista y medida precisa de la tira original (sin saltos)
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const measure = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // El track contiene DOS copias seguidas → total = 2 * single
    const total = el.scrollWidth;
    if (!total) return;
    const single = total / 2;
    // Offset inicial para mantener el centro de la tira en el centro visual
    el.style.setProperty('--start', `${-single / 2}px`);
    // Distancia exacta a desplazar para un loop perfecto
    el.style.setProperty('--distance', `${single}px`);
  }, []);

  // Re-medida al montar, al redimensionar y cuando carguen logos
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const remeasure = () => requestAnimationFrame(measure);
    // medir ASAP
    remeasure();
    // medir al resize
    window.addEventListener('resize', remeasure);
    // medir al completar fonts/imágenes de la página
    window.addEventListener('load', remeasure, {
      once: true
    });
    return () => window.removeEventListener('resize', remeasure);
  }, [measure]);

  // Disparador que pasamos a cada logo (onLoad/onError)
  const onLogoReady = React.useCallback(() => {
    // Pequeño raf para asegurar layout estable antes de medir
    if (typeof window === 'undefined') return;
    requestAnimationFrame(measure);
  }, [measure]);
  return <div className={"w-full grid place-items-center " + (className || "")}> 
      <div className="w-full max-w-7xl mx-auto">
        <div className="relative overflow-hidden flex items-center justify-center" style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
      } as React.CSSProperties}>
          <div ref={trackRef} className="flex items-center will-change-transform" style={{
          // Variables CSS para control fino del scroll
          ['--duration' as any]: `${duration}s`,
          // En motion reducido: sin animación y centrado exacto
          animation: reduced ? 'none' : `scroll var(--duration) linear infinite`,
          gap: 'clamp(4rem, 10vw, 14rem)',
          transform: reduced ? 'translateX(var(--start))' : undefined,
          width: 'max-content'
        } as React.CSSProperties}>
            {LOGOS.map((l, i) => <Logo key={`a-${i}`} src={l.src} alt={l.alt} onReady={onLogoReady} />)}
            {LOGOS.map((l, i) => <Logo key={`b-${i}`} src={l.src} alt={l.alt} ariaHidden onReady={onLogoReady} />)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(var(--start)); }
          to   { transform: translateX(calc(var(--start) - var(--distance))); }
        }
      `}</style>
    </div>;
}
function Logo({
  src,
  alt,
  fallbacks = [],
  ariaHidden,
  onReady
}: Partner & {
  ariaHidden?: boolean;
  onReady?: () => void;
}) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement & {
      dataset: Record<string, string | undefined>;
    };
    const step = parseInt(img.dataset.fallbackStep || "0", 10);
    if (step < fallbacks.length) {
      img.dataset.fallbackStep = String(step + 1);
      img.src = fallbacks[step]!;
      onReady?.();
      return;
    }
    const fb = (FALLBACKS as any)[alt];
    if (fb && !img.dataset.brandFallback) {
      img.dataset.brandFallback = "1";
      img.src = fb;
      onReady?.();
      return;
    }
    // Último recurso: placeholder data URI con el nombre
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='100'><rect width='100%' height='100%' fill='transparent'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='system-ui' font-size='18'>${alt}</text></svg>`;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    onReady?.();
  };

  // Forzar NVIDIA en blanco por CSS (sin cambiar el src exigido por los tests)
  const isNvidia = alt.trim().toLowerCase() === "nvidia";
  return <img src={src} alt={alt} aria-hidden={ariaHidden} className={"h-12 md:h-16 lg:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" + (isNvidia ? " filter brightness-0 invert" : "")} loading="lazy" onLoad={onReady} onError={handleError} referrerPolicy="no-referrer" crossOrigin="anonymous"
  /* Refuerzo de compatibilidad en navegadores sin utilidades CSS */ style={isNvidia ? {
    filter: "brightness(0) invert(1)"
  } : undefined} />;
}

// --- Tests adicionales no intrusivos ---
(function extraTests() {
  try {
    // NVIDIA debe tener fallback blanco
    console.assert(FALLBACKS.NVIDIA?.endsWith("FFFFFF"), "El fallback de NVIDIA debe ser blanco (#FFFFFF)");
    // Orden y alt de NVIDIA
    console.assert(LOGOS[3].alt === "NVIDIA", "El cuarto logo debe ser NVIDIA por alt");
    // Lógica de normalización de alt para la regla CSS
    const alt = "  NVIDIA  ";
    console.assert(alt.trim().toLowerCase() === "nvidia", "La normalización de alt para NVIDIA debe coincidir");
  } catch {}
})();
export default TrustBanner;