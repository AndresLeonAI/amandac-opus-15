import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticGlassCTAProps {
    onClick: () => void;
    text: string;
    ariaLabel: string;
}

const MagneticGlassCTA: React.FC<MagneticGlassCTAProps> = ({ onClick, text, ariaLabel }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !buttonRef.current) return;

        const xTo = gsap.quickTo(buttonRef.current, "x", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(buttonRef.current, "y", { duration: 0.6, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = containerRef.current!.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * 0.4);
            yTo(y * 0.4);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        const container = containerRef.current;
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative p-8 md:p-12 flex items-center justify-center cursor-pointer"
            style={{ perspective: "1000px" }}
        >
            <button
                ref={buttonRef}
                onClick={onClick}
                aria-label={ariaLabel}
                className="group relative overflow-hidden rounded-full font-serif italic tracking-wide text-white transition-all will-change-transform"
                style={{
                    padding: '1.25rem 3rem',
                    fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                    background: 'radial-gradient(120% 120% at 50% -20%, rgba(255,255,255,0.1), rgba(0,0,0,0.4))',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
            >
                {/* Inner subtle glow that reacts on hover */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100 mix-blend-overlay"></span>

                {/* Volumetric Edge Laser using pseudo-element masking technique (depends on index.css Houdini @property --angle) */}
                <span
                    className="absolute inset-0 pointer-events-none rounded-full"
                    style={{
                        padding: '1px',
                        background: 'conic-gradient(from var(--angle), transparent 70%, rgba(212, 175, 55, 1) 100%)',
                        animation: 'spin-gradient 4s linear infinite',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                ></span>

                <span className="relative z-10 drop-shadow-md">
                    {text}
                </span>
            </button>
        </div>
    );
};

export default MagneticGlassCTA;
