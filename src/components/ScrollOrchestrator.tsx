import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PREFERS_REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ScrollOrchestratorProps {
    children: React.ReactNode;
}

const ScrollOrchestrator: React.FC<ScrollOrchestratorProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();
    const isMobile = useIsMobile();

    useEffect(() => {
        // Respect prefers-reduced-motion OR isMobile: skip Lenis entirely
        // Abort Lenis strictly if mobile/touch device to fallback to iOS/Android Native Scrolling
        if (PREFERS_REDUCED || isMobile) {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2.0,
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
            lenisRef.current = null;
        };
    }, [isMobile]);

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
