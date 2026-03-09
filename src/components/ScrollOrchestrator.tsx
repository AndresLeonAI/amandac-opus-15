import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
const PREFERS_REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ScrollOrchestratorProps {
    children: React.ReactNode;
}

const ScrollOrchestrator: React.FC<ScrollOrchestratorProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Respect prefers-reduced-motion: skip Lenis entirely
        if (PREFERS_REDUCED) return;

        const lenis = new Lenis({
            duration: IS_TOUCH ? 0.8 : 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: !IS_TOUCH,
            wheelMultiplier: 1.0,
            touchMultiplier: IS_TOUCH ? 1.0 : 2.0,
            syncTouch: true,
            infinite: false,
            autoRaf: false,
        });

        lenisRef.current = lenis;

        // Connect Lenis to GSAP Ticker — same reference for cleanup
        const update = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        // Termomechanical Sync: Recalculate heights post render and resolution changes
        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Initial forced ping
        setTimeout(() => ScrollTrigger.refresh(), 500);

        return () => {
            gsap.ticker.remove(update);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            clearTimeout(resizeTimer);
            lenis.destroy();
        };
    }, []);

    // Reset scroll on route change
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    return <>{children}</>;
};

export default ScrollOrchestrator;
