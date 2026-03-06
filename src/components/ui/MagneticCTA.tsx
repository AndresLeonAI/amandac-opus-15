import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

export const MagneticCTA = ({ text = "Comienza tu camino hoy", className = "" }: { text?: string, className?: string }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [hovered, setHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Física viscosa y pesada de "Lujo"
    const springConfig = { damping: 18, stiffness: 120, mass: 0.8 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Distancia desde el cursor al centro
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Atracción controlada (peso del componente)
        x.set(distanceX * 0.25);
        y.set(distanceY * 0.25);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        x.set(0);
        y.set(0);
    };

    const scrollToBooking = useScrollToBooking();

    return (
        <motion.div
            className={`relative inline-flex p-4 -m-4 md:p-8 md:-m-8 z-50 ${className}`}
        >
            <motion.button
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
                onClick={scrollToBooking}
                style={{
                    x: springX,
                    y: springY,
                    padding: '24px 64px',
                    background: 'rgba(15, 23, 42, 0.95)', // Dark blue / Slate 900
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 1)' }} // Lighter slate on hover
                whileTap={{ scale: 0.96 }}
                className="group relative flex items-center justify-center rounded-full overflow-hidden"
                aria-label={text}
            >
                {/* Halo de luz que reacciona en hover */}
                <motion.div
                    animate={{
                        boxShadow: hovered
                            ? ['0 0 0px 0px rgba(255,255,255,0)', '0 0 45px 5px rgba(255,255,255,0.08)', '0 0 0px 0px rgba(255,255,255,0)']
                            : '0 0 0px 0px rgba(255,255,255,0)'
                    }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                />

                {/* Cristalizado de fondo */}
                <div className="absolute inset-0 backdrop-blur-[24px] -z-10 bg-gradient-to-br from-white/[0.04] to-transparent mix-blend-overlay" />

                {/* Destello metálico al hover */}
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: hovered ? '100%' : '-100%', opacity: hovered ? 0.3 : 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[25deg]"
                />

                {/* Cero Iconos, pura tipografía respondiendo inversamente */}
                <motion.span
                    style={{
                        x: useTransform(springX, (v) => -v * 0.4),
                        y: useTransform(springY, (v) => -v * 0.4)
                    }}
                    className="font-sans font-semibold text-[10px] md:text-xs tracking-[0.4em] text-white uppercase relative z-10 block whitespace-nowrap"
                >
                    {text}
                </motion.span>
            </motion.button>
        </motion.div >
    );
};
