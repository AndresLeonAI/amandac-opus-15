import { useState, useEffect, useRef } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SparklesCore } from './ui/sparkles';

gsap.registerPlugin(ScrollTrigger);

const SantuarioDelTiempo = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isCalLoaded, setIsCalLoaded] = useState(false);

    // IntersectionObserver for lazy-loading Cal.com (replaces framer useInView)
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
            { rootMargin: '200px' }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Cal.com initialization
    useEffect(() => {
        if (isInView) {
            (async function () {
                const cal = await getCalApi();
                cal("ui", {
                    theme: "dark",
                    styles: { branding: { brandColor: "#D4AF37" } },
                    hideEventTypeDetails: true,
                    layout: "month_view"
                });
                setIsCalLoaded(true);
            })();
        }
    }, [isInView]);

    // GSAP ScrollTrigger reveals (replaces motion.div whileInView)
    useGSAP(() => {
        if (!containerRef.current) return;
        const reveals = containerRef.current.querySelectorAll('.gs-reveal');
        reveals.forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'expo.out',
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }, { scope: containerRef });

    return (
        <section
            id="santuario-del-tiempo"
            ref={containerRef}
            className="relative py-32 bg-background overflow-hidden"
        >
            {/* Dynamic Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
                <SparklesCore
                    id="santuario-sparkles"
                    background="transparent"
                    minSize={0.5}
                    maxSize={1.5}
                    particleDensity={30}
                    className="w-full h-full opacity-30"
                    particleColor="#D4AF37"
                />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <p className="gs-reveal text-primary tracking-widest uppercase text-sm font-semibold mb-4">
                        Santuario del Tiempo
                    </p>
                    <h2 className="gs-reveal text-4xl md:text-5xl font-luxury text-foreground mb-6">
                        Tu Legado Comienza Aquí
                    </h2>
                    <p className="gs-reveal text-foreground/60 text-lg md:text-xl font-light">
                        Reserva un espacio privado para diseñar la arquitectura de tu futuro financiero.
                    </p>
                </div>

                {/* Vault Glassmorphic Container for Cal.com */}
                <div
                    className="gs-reveal relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.05)] border border-primary/10 bg-black/40 backdrop-blur-3xl"
                >
                    {/* Subtle top glare */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                    <div className="min-h-[600px] w-full p-2 sm:p-6 md:p-8">
                        {!isCalLoaded && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
                                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                                <p className="text-primary/60 font-elegant animate-pulse">Abriendo la bóveda...</p>
                            </div>
                        )}

                        {isInView && (
                            <div className={`transition-opacity duration-1000 ${isCalLoaded ? 'opacity-100' : 'opacity-0'}`}>
                                <Cal
                                    namespace="15min"
                                    calLink="amanda-cruz-axiafinanzas/15min"
                                    style={{ width: "100%", height: "100%", overflow: "scroll" }}
                                    config={{ layout: 'month_view', theme: 'dark' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SantuarioDelTiempo;
