import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export const MagneticCTA = ({ text = "Comienza tu camino hoy", className = "" }: { text?: string, className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const haloRef = useRef<HTMLDivElement>(null);
    const sheenRef = useRef<HTMLDivElement>(null);
    const hoveredRef = useRef(false);
    const scrollToBooking = useScrollToBooking();

    // GSAP quickTo springs for magnetic attraction
    useGSAP(() => {
        if (!buttonRef.current || !textRef.current || IS_TOUCH) return;

        const xTo = gsap.quickTo(buttonRef.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const yTo = gsap.quickTo(buttonRef.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const textXTo = gsap.quickTo(textRef.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
        const textYTo = gsap.quickTo(textRef.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });

        const container = containerRef.current!;
        const halo = haloRef.current;
        const sheen = sheenRef.current;

        const onMove = (e: MouseEvent) => {
            const { left, top, width, height } = buttonRef.current!.getBoundingClientRect();
            const distanceX = e.clientX - (left + width / 2);
            const distanceY = e.clientY - (top + height / 2);

            xTo(distanceX * 0.25);
            yTo(distanceY * 0.25);
            textXTo(-distanceX * 0.1);
            textYTo(-distanceY * 0.1);
        };

        const onEnter = () => {
            if (hoveredRef.current) return;
            hoveredRef.current = true;
            // Halo pulse
            if (halo) {
                gsap.to(halo, {
                    boxShadow: '0 0 45px 5px rgba(255,255,255,0.08)',
                    duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut',
                });
            }
            // Sheen effect
            if (sheen) {
                gsap.to(sheen, { x: '200%', opacity: 0.3, duration: 1.2, ease: 'power2.inOut' });
            }
        };

        const onLeave = () => {
            hoveredRef.current = false;
            xTo(0); yTo(0);
            textXTo(0); textYTo(0);
            // Kill halo pulse
            if (halo) {
                gsap.killTweensOf(halo);
                gsap.to(halo, { boxShadow: '0 0 0px 0px rgba(255,255,255,0)', duration: 0.3 });
            }
            // Reset sheen
            if (sheen) {
                gsap.to(sheen, { x: '-100%', opacity: 0, duration: 1.2, ease: 'power2.inOut' });
            }
        };

        container.addEventListener("mousemove", onMove);
        container.addEventListener("mouseleave", onLeave);
        container.addEventListener("mouseenter", onEnter);

        return () => {
            container.removeEventListener("mousemove", onMove);
            container.removeEventListener("mouseleave", onLeave);
            container.removeEventListener("mouseenter", onEnter);
        };
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex p-4 -m-4 md:p-8 md:-m-8 z-50 ${className}`}
        >
            <button
                ref={buttonRef}
                onClick={scrollToBooking}
                className="group relative flex items-center justify-center rounded-full overflow-hidden will-change-transform transition-colors duration-300 hover:scale-105 active:scale-95"
                style={{
                    padding: '24px 64px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                }}
                aria-label={text}
            >
                {/* Halo light */}
                <div
                    ref={haloRef}
                    className="absolute inset-0 rounded-full pointer-events-none"
                />

                {/* Glass layer */}
                <div className="absolute inset-0 backdrop-blur-[24px] -z-10 bg-gradient-to-br from-white/[0.04] to-transparent mix-blend-overlay" />

                {/* Metallic sheen */}
                <div
                    ref={sheenRef}
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[25deg] opacity-0"
                    style={{ transform: 'translateX(-100%)' }}
                />

                {/* Text with inverse magnetic offset */}
                <span
                    ref={textRef}
                    className="font-sans font-semibold text-[10px] md:text-xs tracking-[0.4em] text-white uppercase relative z-10 block whitespace-nowrap will-change-transform"
                >
                    {text}
                </span>
            </button>
        </div>
    );
};
