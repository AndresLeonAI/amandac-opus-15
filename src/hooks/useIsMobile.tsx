import { useState, useEffect } from 'react';

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    });

    useEffect(() => {
        const mql = window.matchMedia('(hover: none) and (pointer: coarse)');
        const onChange = () => setIsMobile(mql.matches);

        // Sincronización inmediata post-hidratación
        setIsMobile(mql.matches);

        // Observador para cambios de orientación/dispositivo
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return isMobile;
}
