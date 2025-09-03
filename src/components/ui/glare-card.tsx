import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { motion } from "framer-motion";

export interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlareCard = ({ children, className }: GlareCardProps) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    glare: {
      x: 0,
      y: 0,
    },
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!refElement.current || !isPointerInside.current) return;

    const element = refElement.current;
    const elementRect = element.getBoundingClientRect();
    const relativeX = e.clientX - elementRect.left;
    const relativeY = e.clientY - elementRect.top;
    const xRange = elementRect.width;
    const yRange = elementRect.height;

    const xRatio = relativeX / xRange;
    const yRatio = relativeY / yRange;

    state.current.glare.x = xRatio;
    state.current.glare.y = yRatio;

    element.style.setProperty("--pointer-x", `${xRatio * 100}%`);
    element.style.setProperty("--pointer-y", `${yRatio * 100}%`);
  };

  const handlePointerEnter = () => {
    isPointerInside.current = true;
    if (refElement.current) {
      refElement.current.style.setProperty("--pointer-from-center", "0");
      refElement.current.style.setProperty("--pointer-from-top", "0");
    }
  };

  const handlePointerLeave = () => {
    isPointerInside.current = false;
    if (refElement.current) {
      refElement.current.style.setProperty("--pointer-from-center", "1");
      refElement.current.style.setProperty("--pointer-from-top", "1");
    }
  };

  return (
    <motion.div
      ref={refElement}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/20 bg-card/30 backdrop-blur-sm p-8 transition-all duration-500 hover:shadow-card hover:-translate-y-1",
        className
      )}
      style={{
        "--pointer-x": "50%",
        "--pointer-y": "50%",
        "--pointer-from-center": "1",
        "--pointer-from-top": "1",
      } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              650px circle at var(--pointer-x) var(--pointer-y),
              rgba(59, 130, 246, 0.15),
              transparent 40%
            )`,
          }}
        />
      </div>
      
      <div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 group-hover:opacity-30 opacity-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              400px circle at var(--pointer-x) var(--pointer-y),
              rgba(255, 255, 255, 0.1),
              transparent 40%
            )`,
          }}
        />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};