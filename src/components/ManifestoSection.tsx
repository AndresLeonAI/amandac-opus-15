import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowUpRight, Search, Target, Users, Loader2 } from 'lucide-react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

/* ==========================================
   1. UTILITY COMPONENTS (Splits, Cursors)
   ========================================== */

/**
 * Cinematographic Noise Background
 * Scoped to the ManifestoSection via absolute positioning
 */
const NoiseOverlay: React.FC = () => (
    <div className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <filter id="manifesto-noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#manifesto-noiseFilter)" />
        </svg>
    </div>
);

/**
 * Custom Smooth Cursor
 */
const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current && (window as any).gsap) {
                (window as any).gsap.to(cursorRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.5,
                    ease: "expo.out",
                });
            }
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 bg-blue-600 rounded-full mix-blend-difference pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            style={{ filter: "blur(1px)" }}
        />
    );
};

interface SplitTextProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    style?: React.CSSProperties; // Added to support inline clamp() styles
}

const SplitText: React.FC<SplitTextProps> = ({ children, className = "", delay = 0, style }) => {
    if (typeof children !== 'string') return null;
    const words = children.split(/\s+/);
    return (
        <span className={`split-text-wrapper ${className} inline-flex flex-wrap`} aria-label={children} style={style}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} aria-hidden="true" className="word-span inline-block whitespace-nowrap overflow-hidden pr-[0.3em] pb-2 -mb-2">
                    <span className="char-wrapper inline-block will-change-transform translate-y-full opacity-0">
                        {word}
                    </span>
                </span>
            ))}
        </span>
    );
};

interface CircledWordProps {
    children: React.ReactNode;
    className?: string;
}

const CircledWord: React.FC<CircledWordProps> = ({ children, className = "" }) => {
    return (
        <span className="relative inline-flex items-center justify-center whitespace-nowrap px-6 py-2 md:py-4 mx-2">
            <svg className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] text-blue-900 overflow-visible pointer-events-none z-0" viewBox="0 0 200 100" preserveAspectRatio="none">
                <path
                    d="M20,80 C40,95 160,95 180,75 C200,50 170,10 100,15 C40,20 15,45 25,65"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="draw-path"
                    filter="url(#manifesto-premium-glow)"
                />
            </svg>
            <span className={`relative z - 10 text - white font - serif italic drop - shadow - lg ${className} `}>
                {children}
            </span>
        </span>
    );
};

/* ==========================================
   2. HIGH-FIDELITY SVGS
   ========================================== */

interface SvgProps {
    className?: string;
    speed?: string;
}

const ProfitChartSVG: React.FC<SvgProps> = ({ className }) => (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
        <defs>
            <linearGradient id="manifesto-profitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1" />
            </linearGradient>
            <filter id="manifesto-sapphire-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {/* Architectural Grid */}
        <g stroke="rgba(255,255,255,0.02)" strokeWidth="0.5">
            {[10, 30, 50, 70, 90, 110].map(pos => (
                <React.Fragment key={pos}>
                    <line x1={pos} y1="10" x2={pos} y2="110" />
                    <line x1="10" y1={pos} x2="110" y2={pos} />
                </React.Fragment>
            ))}
        </g>
        {/* Axes */}
        <path d="M10 110 L110 110 M10 110 L10 10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        {/* Animated Chart Line */}
        <path className="draw-path" d="M10 100 C 40 100, 50 60, 70 65 C 90 70, 100 20, 110 15" stroke="url(#manifesto-profitGrad)" strokeWidth="1.5" strokeLinecap="round" filter="url(#manifesto-sapphire-glow)" />
        {/* Glowing Nodes */}
        <circle cx="70" cy="65" r="1.5" fill="#1e3a8a" className="animate-pulse" filter="url(#manifesto-sapphire-glow)" />
        <circle cx="110" cy="15" r="3" fill="#fff" className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
        <circle cx="110" cy="15" r="1.5" fill="#fff" filter="url(#manifesto-sapphire-glow)" />
    </svg>
);

const AstrolabeCoinSVG: React.FC<SvgProps> = ({ className, speed = "1" }) => (
    <svg viewBox="0 0 100 100" fill="none" className={className} data-speed={speed}>
        <defs>
            <filter id="manifesto-astro-glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="42" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" opacity="0.6" />
        <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="20" stroke="#fff" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_15s_linear_infinite_reverse]" filter="url(#manifesto-astro-glow)" opacity="0.8" />
        <circle cx="50" cy="50" r="3" fill="#1e3a8a" className="animate-pulse" filter="url(#manifesto-astro-glow)" />
    </svg>
);

const BlueprintSVG: React.FC<SvgProps> = ({ className, speed = "1" }) => (
    <svg viewBox="0 0 160 80" fill="none" className={className} data-speed={speed}>
        <defs>
            <filter id="manifesto-blue-glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <rect x="5" y="5" width="150" height="70" rx="4" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="rgba(30,58,138,0.02)" />
        <path d="M5 25 L155 25 M5 55 L155 55 M40 5 L40 75 M120 5 L120 75" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <circle cx="80" cy="40" r="15" stroke="#1e3a8a" strokeDasharray="2 4" strokeWidth="1" className="animate-[spin_10s_linear_infinite]" opacity="0.8" filter="url(#manifesto-blue-glow)" />
        <circle cx="80" cy="40" r="1.5" fill="#fff" />
        <path d="M20 15 L30 15 M130 65 L140 65" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

/* ==========================================
   3. GLASS CTA — MAGNETIC ELIPSE
   ========================================== */

const GlassCTA: React.FC = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const borderRef = useRef<SVGRectElement>(null);
    const controls = useAnimation();
    const inViewRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(inViewRef, { once: false, margin: "-100px" });
    const scrollToBooking = useScrollToBooking(); // Added this line

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    // Magnetic effect with GSAP
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const gsap = (window as any).gsap;
        if (!gsap || !buttonRef.current) return;

        const btn = buttonRef.current;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.15;
        const deltaY = (e.clientY - centerY) * 0.15;

        gsap.to(btn, {
            x: deltaX,
            y: deltaY,
            rotationX: -deltaY * 0.1,
            rotationY: deltaX * 0.1,
            duration: 0.8,
            ease: "power3.out",
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        const gsap = (window as any).gsap;
        if (!gsap || !buttonRef.current) return;

        // Snap back with elastic
        gsap.to(buttonRef.current, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)",
        });
    }, []);

    return (
        <section
            ref={inViewRef}
            className="manifesto-cta-section w-full h-full flex flex-col items-center justify-center text-center relative z-20 px-6 overflow-visible"
        >
            {/* Ambient Background Glow (Track the CTA area) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="w-[60vw] h-[40vw] max-w-[800px] max-h-[500px] bg-blue-900/[0.08] blur-[150px] rounded-[100%]"
                />
            </div>

            {/* Decorative orbit behind CTA */}
            <AstrolabeCoinSVG className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] text-blue-900/[0.08] pointer-events-none mix-blend-screen" speed="1.2" />

            {/* Magnetic CTA Container */}
            <div
                className="relative z-10 perspective-[1000px] w-full max-w-[800px] md:min-w-[700px] px-4"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* The Button Body */}
                <motion.button
                    onClick={scrollToBooking}
                    ref={buttonRef}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0, y: 40, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="group relative flex flex-col items-center justify-center rounded-[100px] md:rounded-full bg-white/[0.015] backdrop-blur-2xl py-12 md:py-20 px-8 md:px-24 overflow-hidden shadow-[0_20px_80px_-20px_rgba(30,58,138,0.2)]"
                    style={{ textDecoration: 'none', transformStyle: 'preserve-3d' }}
                >
                    {/* Inner glowing orbit on hover */}
                    <div className="absolute inset-0 rounded-[100px] md:rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
                        {/* Glow orb internal */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-blue-900/10 blur-[50px] rounded-full mix-blend-screen" />
                    </div>

                    {/* Animated SVG Border Ellipse */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gradient-glass-border" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                                <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                                <stop offset="100%" stopColor="rgba(30,58,138,0.3)" />
                            </linearGradient>
                            <linearGradient id="gradient-glass-hover" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(30,58,138,0.1)" />
                                <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                                <stop offset="100%" stopColor="rgba(30,58,138,0.1)" />
                            </linearGradient>
                        </defs>
                        <rect
                            ref={borderRef}
                            x="1" y="1"
                            width="calc(100% - 2px)" height="calc(100% - 2px)"
                            rx="100" ry="100"
                            fill="none"
                            stroke="url(#gradient-glass-border)"
                            strokeWidth="1"
                            className="transition-colors duration-700 group-hover:stroke-[url(#gradient-glass-hover)]"
                        />
                        {/* Tracking light around the border on hover */}
                        <rect
                            x="1" y="1"
                            width="calc(100% - 2px)" height="calc(100% - 2px)"
                            rx="100" ry="100"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeDasharray="150 2000"
                            strokeDashoffset="0"
                            className="opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite]"
                            filter="url(#manifesto-premium-glow)"
                            style={{ strokeLinecap: 'round', transformOrigin: 'center' }}
                        />
                    </svg>

                    {/* Micro label */}
                    <motion.span
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 1 } } }}
                        className="relative z-20 text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-blue-200/60 font-sans font-medium mb-6 flex items-center gap-4"
                    >
                        <span className="w-8 h-[1px] bg-blue-400/30"></span>
                        El siguiente nivel
                        <span className="w-8 h-[1px] bg-blue-400/30"></span>
                    </motion.span>

                    {/* Main text container */}
                    <div className="relative z-20 text-center flex flex-col items-center justify-center">
                        <span className="font-serif italic text-4xl sm:text-6xl md:text-[6rem] text-white leading-[1.1] tracking-tight drop-shadow-lg [text-wrap:balance] transition-all duration-700 group-hover:scale-[1.02] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-blue-200">
                            Comienza tu
                        </span>
                        <span className="font-serif italic text-4xl sm:text-6xl md:text-[6.5rem] text-white leading-[1] tracking-tight drop-shadow-xl [text-wrap:balance] transition-all duration-700 group-hover:scale-[1.02] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:via-white group-hover:to-white">
                            Camino a la
                        </span>
                        {/* Huge Libertdad emphasis with custom glow text */}
                        <div className="relative mt-2">
                            <span className="font-serif italic font-medium text-6xl sm:text-7xl md:text-[8rem] tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]">
                                Libertad
                            </span>
                            {/* Inner ambient light on text */}
                            <span className="absolute inset-0 font-serif italic font-medium text-6xl sm:text-7xl md:text-[8rem] tracking-tight text-white blur-[8px] opacity-0 group-hover:opacity-60 transition-opacity duration-1000 z-[-1]" aria-hidden="true">
                                Libertad
                            </span>
                        </div>
                    </div>

                    {/* Bottom abstract arrow / indicator */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.8, duration: 1, ease: "backOut" } } }}
                        className="relative z-20 mt-12 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md overflow-hidden group-hover:border-blue-400/40 transition-colors duration-500"
                    >
                        {/* Hover fill */}
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black transition-colors duration-500 relative z-10" strokeWidth={1.5} />
                    </motion.div>
                </motion.button>
            </div>
        </section>
    );
};

/* ==========================================
   4. MAIN COMPONENT & ANIMATIONS
   ========================================== */

const useScript = (src: string): boolean => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (document.querySelector(`script[src = "${src}"]`)) {
            setLoaded(true); return;
        }
        const script = document.createElement('script');
        script.src = src; script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
    }, [src]);
    return loaded;
};

export default function ManifestoSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const gsapLoaded = useScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
    const stLoaded = useScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (gsapLoaded && stLoaded && (window as any).gsap && (window as any).ScrollTrigger) {
            (window as any).gsap.registerPlugin((window as any).ScrollTrigger);
            setIsReady(true);
        }
    }, [gsapLoaded, stLoaded]);

    useLayoutEffect(() => {
        if (!isReady) return;
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;

        const ctx = gsap.context(() => {

            // Horizontal Scroll Setup
            const track = trackRef.current!;
            const trackWidth = track.scrollWidth;
            const windowWidth = window.innerWidth;
            const xMovement = -(trackWidth - windowWidth);

            const scrollTween = gsap.to(track, {
                x: xMovement,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+= ${Math.abs(xMovement)} `,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            // 1. Text Reveals (Clip Path style)
            gsap.utils.toArray(".word-span").forEach((word: Element) => {
                const char = word.querySelector(".char-wrapper");
                gsap.to(char, {
                    y: "0%",
                    opacity: 1,
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: word,
                        containerAnimation: scrollTween,
                        start: "left 85%",
                        toggleActions: "play none none reverse",
                    }
                });
            });

            // 2. High-End Image Reveals (Mask + Parallax + Ken Burns)
            gsap.utils.toArray(".image-container").forEach((container: Element) => {
                const img = container.querySelector("img");

                // Initial state: masked out and scaled up heavily
                gsap.set(container, { clipPath: "inset(0 100% 0 0)" });
                gsap.set(img, { scale: 1.6, transformOrigin: "left center" });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        containerAnimation: scrollTween,
                        start: "left 85%",
                        end: "left 20%",
                        scrub: 1.5,
                    }
                });

                // Unmask quickly, but slow down the image scale globally for a constant Ken Burns effect
                tl.to(container, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power3.inOut" })
                    .to(img, { scale: 1.05, x: "5%", duration: 3.5, ease: "none" }, "<");
            });

            // 3. SVG Path Drawing
            gsap.utils.toArray(".draw-path").forEach((path: SVGPathElement) => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: path,
                        containerAnimation: scrollTween,
                        start: "left 80%",
                        end: "left 40%",
                        scrub: 1.2,
                    }
                });
            });

            // 4. Floating Elements Parallax
            gsap.utils.toArray(".parallax-el").forEach((item: HTMLElement) => {
                const speed = parseFloat(item.dataset.speed || "1");
                gsap.to(item, {
                    x: 300 * speed,
                    rotation: 15 * speed,
                    ease: "none",
                    scrollTrigger: { trigger: item, containerAnimation: scrollTween, scrub: true }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [isReady]);

    if (!gsapLoaded || !stLoaded) {
        return (
            <div className="h-screen w-full bg-[#030303] flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-red-600" />
            </div>
        );
    }

    return (
        <div
            data-manifesto
            className={`bg - [#030303] text - [#ececec] selection: bg - red - 600 / 30 selection: text - white transition - opacity duration - 1000 overflow - x - hidden relative ${isReady ? 'opacity-100' : 'opacity-0'} `}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <CustomCursor />
            <NoiseOverlay />

            <style>{`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@200;300;400;600&display=swap');
[data - manifesto].font - serif { font - family: 'Instrument Serif', serif; }
[data - manifesto].font - sans { font - family: 'Inter', sans - serif; }
[data - manifesto]:: -webkit - scrollbar { display: none; }
[data - manifesto].glass - panel {
    background: rgba(255, 255, 255, 0.02);
    backdrop - filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
}
`}</style>

            {/* Global SVG Filters — namespaced IDs to prevent collisions */}
            <svg className="hidden">
                <defs>
                    <filter id="manifesto-premium-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Enhanced gradient for LIBERTAD */}
                    <linearGradient id="manifesto-libertad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="35%" stopColor="#e5e7eb" stopOpacity="1" />
                        <stop offset="70%" stopColor="#6b7280" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#374151" stopOpacity="0.5" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Section: Horizontal Track */}
            <section ref={containerRef} className="h-screen w-full relative overflow-hidden bg-[#030303]">
                {/* Cinematic Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                    style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                    aria-hidden="true"
                >
                    <source src="https://ik.imagekit.io/owke186g5/MANSION%202%20.mp4?updatedAt=1772143250901" type="video/mp4" />
                </video>
                {/* Darkness Overlay for Legibility */}
                <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

                <div ref={trackRef} className="relative z-10 flex items-center h-full flex-nowrap pl-[15vw] pr-[20vw] select-none">

                    {/* Segment 1: Decisión */}
                    <div className="flex items-center shrink-0 h-full px-4 md:px-10">
                        <div className="flex flex-col mt-[-10vh] md:mt-0">
                            <SplitText className="text-4xl md:text-7xl lg:text-9xl font-sans font-light tracking-tight text-white/90">Cada</SplitText>
                            <div className="flex flex-col md:flex-row items-start md:items-center -mt-2 md:-mt-4">
                                <CircledWord className="text-5xl md:text-8xl lg:text-[10rem] ml-[-0.5rem] md:ml-[-1rem]">decisión</CircledWord>
                                <SplitText className="text-3xl md:text-5xl lg:text-7xl font-serif italic text-gray-500 ml-2 md:ml-4 mt-4 md:mt-8">es una semilla.</SplitText>
                            </div>
                        </div>

                        <div className="image-container mx-8 md:mx-24 w-[250px] md:w-[350px] lg:w-[420px] h-[400px] md:h-[600px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group transform-gpu">
                            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply z-10 transition-colors duration-1000 group-hover:bg-transparent"></div>
                            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800" alt="Capital" className="w-full h-full object-cover grayscale blur-[1px] brightness-75 group-hover:blur-none group-hover:grayscale-0 transition-all duration-1000 will-change-transform" />
                            {/* Inner glass border */}
                            <div className="absolute inset-0 rounded-[2rem] border border-white/10 z-20 pointer-events-none mix-blend-overlay"></div>
                        </div>
                    </div>

                    {/* Segment 2: Potencial */}
                    <div className="flex items-center shrink-0 h-full relative px-10 md:px-20">
                        <ProfitChartSVG className="parallax-el absolute -top-10 md:-top-20 left-0 md:left-10 w-[250px] md:w-[450px] h-[250px] md:h-[450px] text-white/5 -z-10 opacity-70" data-speed="0.2" />

                        <div className="flex flex-col gap-1 md:gap-2">
                            <SplitText className="text-2xl md:text-4xl lg:text-6xl font-sans font-light text-gray-400">revelando el</SplitText>
                            <SplitText className="font-sans font-semibold tracking-tighter text-white uppercase mix-blend-difference drop-shadow-2xl leading-none" style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}>POTENCIAL</SplitText>
                            <div className="flex items-center justify-start md:justify-end w-full md:pr-12 mt-2 md:mt-0">
                                <div className="hidden md:block h-[1px] w-24 bg-blue-900/40 mr-6"></div>
                                <SplitText className="text-3xl md:text-4xl lg:text-6xl font-serif italic text-blue-100 drop-shadow-md">oculto del capital.</SplitText>
                            </div>
                        </div>
                    </div>

                    {/* Segment 3: Arquitectura */}
                    <div className="flex flex-col-reverse md:flex-row items-center justify-center shrink-0 h-full px-10 md:px-24 gap-8 md:gap-0">
                        <div className="image-container w-[280px] md:w-[500px] lg:w-[700px] h-[280px] md:h-[450px] rounded-full overflow-hidden border border-white/5 relative transform-gpu">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Ciudad" className="w-full h-full object-cover grayscale brightness-50 will-change-transform" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-transparent opacity-80 z-10"></div>
                            <BlueprintSVG className="parallax-el absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-64 h-20 md:h-32 text-white/20 z-20" data-speed="0.1" />
                        </div>

                        <div className="flex flex-col md:ml-20 relative">
                            <AstrolabeCoinSVG className="parallax-el hidden md:block absolute -left-12 -top-12 w-20 h-20 text-blue-900/30" data-speed="-0.3" />
                            <SplitText className="text-2xl md:text-4xl lg:text-6xl font-sans font-light text-gray-400">trazando tu propia</SplitText>
                            <CircledWord className="text-4xl md:text-7xl lg:text-9xl mt-2 ml-[-1rem] md:ml-0">ruta estratégica.</CircledWord>
                        </div>
                    </div>

                    {/* Segment 4: Libertad — Typographic Climax */}
                    <div className="flex items-center shrink-0 h-full relative pl-10 md:pl-32 pr-[10vw] md:pr-[15vw]">
                        {/* Atmospheric glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-[80vw] h-[120vw] md:h-[80vw] bg-red-600/[0.06] blur-[100px] md:blur-[180px] rounded-full pointer-events-none"></div>
                        <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] bg-white/[0.02] blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="flex flex-col relative z-10">
                            {/* Tracking label */}
                            <SplitText className="text-sm md:text-2xl lg:text-4xl font-sans font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-600 mb-4 md:mb-8">Guiando tus pasos</SplitText>

                            {/* "Hacia la" — elegant serif intro */}
                            <SplitText className="text-4xl md:text-6xl lg:text-8xl font-serif italic text-white mb-0 md:mb-2 drop-shadow-md">Hacia la</SplitText>

                            {/* LIBERTAD — MASSIVE, serif, commanding */}
                            <div className="relative transform-gpu will-change-transform">
                                <SplitText
                                    className="font-serif italic text-white leading-[0.85] tracking-tight drop-shadow-2xl"
                                    style={{ fontSize: 'clamp(5rem, 20vw, 22rem)' }}
                                >
                                    Libertad
                                </SplitText>
                                {/* Subtle glow layer behind the text */}
                                <div
                                    className="absolute inset-0 font-serif italic text-white/[0.04] blur-[10px] md:blur-[15px] pointer-events-none select-none"
                                    style={{ fontSize: 'clamp(5rem, 20vw, 22rem)' }}
                                    aria-hidden="true"
                                >
                                    Libertad
                                </div>
                            </div>

                            {/* "financiera." — Elegant Blue Badge */}
                            <div className="flex justify-end w-full pr-[5%] mt-4 md:mt-8 will-change-transform">
                                <span className="inline-flex items-center bg-transparent backdrop-blur-md border border-blue-900/40 rounded-full px-8 py-3 shadow-[0_0_40px_rgba(30,58,138,0.2)]">
                                    <SplitText className="text-3xl md:text-5xl font-sans font-black text-white tracking-widest uppercase">
                                        financiera.
                                    </SplitText>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Segment 5: The Action (GlassCTA incrustado) */}
                    <div className="flex items-center shrink-0 h-full relative pl-[5vw] pr-[20vw]">
                        <GlassCTA />
                    </div>

                </div>
            </section>

        </div>
    );
}
