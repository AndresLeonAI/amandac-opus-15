import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

interface ScrollOrchestratorProps {
    children: React.ReactNode;
}

const ScrollOrchestrator: React.FC<ScrollOrchestratorProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);
    const location = useLocation();

    useEffect(() => {
        // 1. Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expoOut
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2.0,
            infinite: false,
            // Auto-raf is disabled since we will hook into GSAP's ticker
            autoRaf: false,
        });

        lenisRef.current = lenis;

        // 2. Connect Lenis to GSAP Ticker for frame-perfect sync
        gsap.ticker.add((time) => {
            // time is in seconds, Lenis needs milliseconds
            lenis.raf(time * 1000);
        });

        // Disable lag smoothing to prevent visual jumps on initial load or severe thread-blocking
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
            lenis.destroy();
        };
    }, []);

    // Reset scroll specifically on route change
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
