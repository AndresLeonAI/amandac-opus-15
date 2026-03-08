"use client";
import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id = "sparkles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className = "",
  particleColor = "#FFFFFF",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);

  // Mobile: reduce density to 40% for thermal shield
  const effectiveDensity = IS_MOBILE ? particleDensity * 0.4 : particleDensity;

  const createParticles = useCallback((width: number, height: number): Particle[] => {
    const particleCount = Math.floor((width * height) / 8000 * (effectiveDensity / 100));

    return Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: Math.random() * 1.0 + 0.3,
      velocityX: (Math.random() - 0.5) * 1.2,
      velocityY: (Math.random() - 0.5) * 1.2,
    }));
  }, [minSize, maxSize, effectiveDensity]);

  // Pre-parse hex color once (avoid per-frame string ops)
  const colorRef = useRef({ r: 255, g: 255, b: 255 });
  useEffect(() => {
    const hex = particleColor.replace('#', '');
    colorRef.current = {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
    };
  }, [particleColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // IntersectionObserver for viewport culling
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Mobile: reduce canvas DPR to 1
    const dpr = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      particlesRef.current = createParticles(rect.width, rect.height);
    };

    // ResizeObserver with debounce for stable measurement
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    });
    ro.observe(canvas);

    // Initial setup
    resizeCanvas();

    // Render function — subordinated to gsap.ticker
    const { r, g, b } = colorRef.current;
    const render = () => {
      if (!isVisibleRef.current || document.hidden) return; // Skip frame if not visible

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const displayW = canvas.width / dpr;
      const displayH = canvas.height / dpr;
      ctx.clearRect(0, 0, displayW, displayH);

      const time = Date.now() * 0.003;

      particlesRef.current = particlesRef.current.map(particle => {
        let newX = particle.x + particle.velocityX;
        let newY = particle.y + particle.velocityY;

        if (newX < 0) newX = displayW;
        if (newX > displayW) newX = 0;
        if (newY < 0) newY = displayH;
        if (newY > displayH) newY = 0;

        const dynamicOpacity = Math.sin(time + particle.x * 0.01) * 0.4 + 0.8;

        ctx.beginPath();
        ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dynamicOpacity})`;
        ctx.fill();

        return { ...particle, x: newX, y: newY, opacity: dynamicOpacity };
      });
    };

    gsap.ticker.add(render);

    return () => {
      observer.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      gsap.ticker.remove(render);
    };
  }, [createParticles, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{ background, pointerEvents: "none", display: "block" }}
    />
  );
};