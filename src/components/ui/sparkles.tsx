"use client";
import React, { useCallback, useEffect, useRef } from "react";

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
  const animationRef = useRef<number>();

  const createParticles = useCallback((width: number, height: number): Particle[] => {
    const particleCount = Math.floor((width * height) / 8000 * (particleDensity / 100));
    
    return Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: Math.random() * 1.0 + 0.3,
      velocityX: (Math.random() - 0.5) * 1.2,
      velocityY: (Math.random() - 0.5) * 1.2,
    }));
  }, [minSize, maxSize, particleDensity]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.map(particle => {
      let newX = particle.x + particle.velocityX;
      let newY = particle.y + particle.velocityY;

      // Wrap around screen edges
      if (newX < 0) newX = canvas.width;
      if (newX > canvas.width) newX = 0;
      if (newY < 0) newY = canvas.height;
      if (newY > canvas.height) newY = 0;

      // Calculate dynamic opacity with enhanced brightness
      const time = Date.now() * 0.003;
      const dynamicOpacity = Math.sin(time + particle.x * 0.01) * 0.4 + 0.8;

      // Draw particle with proper RGBA color
      ctx.beginPath();
      ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
      
      // Convert hex to RGB and add alpha
      const hex = particleColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dynamicOpacity})`;
      ctx.fill();

      return {
        ...particle,
        x: newX,
        y: newY,
        opacity: dynamicOpacity,
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [particleColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      particlesRef.current = createParticles(canvas.width, canvas.height);
    };

    // Set up ResizeObserver for better resize handling
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    // Initial setup
    resizeCanvas();
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        background,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
};