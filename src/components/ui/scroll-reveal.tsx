import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: boolean;
  stagger?: boolean;
}

export const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  scale = false,
  stagger = false,
  ...props
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay,
    };

    switch (direction) {
      case 'up': fromVars.y = distance; break;
      case 'down': fromVars.y = -distance; break;
      case 'left': fromVars.x = distance; break;
      case 'right': fromVars.x = -distance; break;
    }

    if (scale) fromVars.scale = 0.8;

    if (stagger) {
      gsap.from(ref.current.children, {
        ...fromVars,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      gsap.from(ref.current, {
        ...fromVars,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: ref });

  return (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

// Preset components for common patterns
export const FadeInUp = ({ children, className, delay = 0, ...props }: Omit<ScrollRevealProps, 'direction'>) => (
  <ScrollReveal direction="up" delay={delay} className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const FadeInScale = ({ children, className, delay = 0, ...props }: Omit<ScrollRevealProps, 'scale'>) => (
  <ScrollReveal scale delay={delay} className={className} {...props}>
    {children}
  </ScrollReveal>
);

export const StaggerContainer = ({ children, className, delay = 0, ...props }: Omit<ScrollRevealProps, 'stagger'>) => (
  <ScrollReveal stagger delay={delay} className={className} {...props}>
    {children}
  </ScrollReveal>
);