import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareEffect?: boolean;
}

export const TiltCard = ({
  children,
  className,
  intensity = 15,
  glareEffect = true
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || IS_TOUCH) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = (x - centerX) / centerX * intensity;
      const rotateX = (y - centerY) / centerY * -intensity;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;

      if (glareEffect) {
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }
    };

    const handleMouseEnter = () => {
      card.style.transition = 'transform 0.1s ease-out';
    };

    const handleMouseLeave = () => {
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, glareEffect]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative overflow-hidden rounded-xl transform-gpu will-change-transform',
        'glass-card border border-border/20 bg-card/30 backdrop-blur-sm',
        'transition-all duration-500 hover:shadow-glow hover:-translate-y-1',
        className
      )}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Glare effects */}
      {glareEffect && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `
                  radial-gradient(
                    600px circle at var(--mouse-x) var(--mouse-y),
                    hsla(var(--primary), 0.15),
                    transparent 40%
                  )
                `,
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `
                  radial-gradient(
                    300px circle at var(--mouse-x) var(--mouse-y),
                    rgba(255, 255, 255, 0.1),
                    transparent 40%
                  )
                `,
              }}
            />
          </div>
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};