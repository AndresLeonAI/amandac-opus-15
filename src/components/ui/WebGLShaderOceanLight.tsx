"use client";

/**
 * WebGLShaderOceanLight
 * -------------------------------------------------------------
 * Lovable-ready React + TypeScript component that renders a full-screen
 * Three.js RawShaderMaterial with an ocean-blue background and a chromatic
 * sine-wave glow (same effect as before), but with a **slightly lighter**
 * deep-blue gradient so it never looks black.
 *
 * ✅ No external deps beyond `three`
 * ✅ Default export (drop-in friendly)
 * ✅ Strong TS typings + JSDoc comments
 * ✅ Responsive to window resize
 * ✅ Optional props to tweak colors and animation speed
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/** Public props to integrate easily in Lovable */
export interface WebGLShaderOceanLightProps {
  /** Top color of the ocean gradient (lighter but still dark). HEX or CSS color. */
  topColor?: string;
  /** Bottom color of the ocean gradient (deeper tone). HEX or CSS color. */
  bottomColor?: string;
  /** Animation speed multiplier. 1 = default. */
  speed?: number;
  /** Intensity of the chromatic distortion. */
  distortion?: number;
  /** Horizontal wave frequency scale. */
  xScale?: number;
  /** Vertical wave amplitude scale. */
  yScale?: number;
  /** Optional className for the canvas element. */
  className?: string;
}

const WebGLShaderOceanLight: React.FC<WebGLShaderOceanLightProps> = ({
  topColor = "#2a4f86", // slightly lighter ocean blue (still dark)
  bottomColor = "#1a3e6d", // deeper, but not black
  speed = 1.0,
  distortion = 0.05,
  xScale = 1.0,
  yScale = 0.5,
  className = "fixed top-0 left-0 w-full h-full block",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Keep all Three.js refs bundled for easy cleanup */
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    uniforms: {
      resolution: { value: [number, number] };
      time: { value: number };
      xScale: { value: number };
      yScale: { value: number };
      distortion: { value: number };
      bgColorTop: { value: THREE.Color };
      bgColorBottom: { value: THREE.Color };
      speed: { value: number };
    } | null;
    animationId: number | null;
    isRunning: boolean;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    isRunning: true,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const { current: refs } = sceneRef;

    /** Minimal vertex shader: pass-through positions to clip-space */
    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    /**
     * Fragment shader:
     * - Builds an ocean-blue vertical gradient background.
     * - Adds a chromatic sine-wave glow with slight dispersion.
     */
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform vec3 bgColorTop;
      uniform vec3 bgColorBottom;
      uniform float speed; // animation speed multiplier

      void main() {
        // Pixel coords normalized, aspect-correct, centered at (0,0)
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        // Vertical gradient background (ocean blues)
        float v = clamp(gl_FragCoord.y / resolution.y, 0.0, 1.0);
        vec3 bg = mix(bgColorBottom, bgColorTop, v);

        // Chromatic sine arc with slight radial distortion
        float d = length(p) * distortion;
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float t = time * speed;
        float r = 0.05 / abs(p.y + sin((rx + t) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + t) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + t) * xScale) * yScale);

        // Additive blend to create the glow on top of the gradient
        vec3 glow = vec3(r, g, b);
        vec3 col = clamp(bg + glow, 0.0, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    /** Initialize Three.js scene, renderer, camera, material, and mesh */
    const initScene = () => {
      refs.scene = new THREE.Scene();

      // Create renderer on the provided canvas
      refs.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,                 // móviles: menos memoria y más FPS
        alpha: true,
        powerPreference: "high-performance"
      });
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      // Ensure correct output color space on modern Three.js
      // @ts-ignore - property name varies across Three versions
      refs.renderer.outputColorSpace = (THREE as any).SRGBColorSpace || undefined;

      // Convert incoming HEX/CSS colors to THREE.Color
      const topBlue = new THREE.Color(topColor);
      const bottomBlue = new THREE.Color(bottomColor);

      // Clear color matches bottom of gradient to avoid any black frame
      refs.renderer.setClearColor(bottomBlue);

      // Fullscreen orthographic camera
      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

      // Uniforms passed to the RawShaderMaterial
      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: xScale },
        yScale: { value: yScale },
        distortion: { value: distortion },
        bgColorTop: { value: topBlue },
        bgColorBottom: { value: bottomBlue },
        speed: { value: speed },
      };

      // Two triangles forming a full-screen quad
      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ];

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", positions);

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms!,
        side: THREE.DoubleSide,
      });

      refs.mesh = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.mesh);

      handleResize();
    };

    /** Animation loop with pause on hidden tab to save resources */
    const animate = () => {
      if (!refs.isRunning) {
        refs.animationId = requestAnimationFrame(animate);
        return;
      }
      if (refs.uniforms) refs.uniforms.time.value += 0.01;
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    /** Keep canvas and uniforms in sync with the window size */
    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      refs.renderer.setSize(width, height, false);
      refs.uniforms.resolution.value = [width, height];
    };

    /** Pause/resume when tab visibility changes (optional optimization) */
    const handleVisibility = () => {
      refs.isRunning = document.visibilityState === "visible";
    };

    initScene();
    animate();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    /** Thorough cleanup on unmount */
    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        const mat: any = refs.mesh.material as any;
        if (mat && typeof mat.dispose === "function") mat.dispose();
      }
      refs.renderer?.dispose();
    };
  }, [bottomColor, topColor, speed, distortion, xScale, yScale]);

  return <canvas ref={canvasRef} className={className} />;
};

export default WebGLShaderOceanLight;