import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import { useEffect, useState } from 'react'

interface SmoothScrollProps {
    children: React.ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
    // Verificamos "prefers-reduced-motion" para suspender animaciones fluidas 
    // en favor de accesibilidad inmediata.
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    if (reducedMotion) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.05,        // Un lerp suave pero responsivo, ideal para scroll-triggers.
                duration: 1.5,     // Interpolación extendida para ese "peso" lujoso.
                smoothWheel: true,
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                touchMultiplier: 2, // Ligeramente más aceleración en táctil para compensar el "peso".
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    )
}
