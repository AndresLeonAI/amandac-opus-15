import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
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
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const baseVariants: Variants = {
    hidden: {
      ...getInitialPosition(),
      ...(scale && { scale: 0.8 }),
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      ...(scale && { scale: 1 }),
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
        delay: stagger ? delay : delay,
      },
    },
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger ? staggerVariants : baseVariants}
      className={cn("", className)}
      {...props}
    >
      {children}
    </motion.div>
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