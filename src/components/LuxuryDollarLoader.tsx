import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type LuxuryDollarLoaderProps = {
  className?: string;
};

export default function LuxuryDollarLoader({
  className,
}: LuxuryDollarLoaderProps) {
  const [loadingText, setLoadingText] = useState("INITIALIZING FIRMWARE");

  // Refs for GSAP animation targeting
  const loaderRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const svgLinesRef = useRef<(SVGPathElement | null)[]>([]);
  const svgCirclesRef = useRef<(SVGCircleElement | null)[]>([]);

  // We use a regular React state for the number so React handles the rendering of the text,
  // but GSAP drives the value mathematically to guarantee it stops at 100.
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Master Timeline for absolute control, timed precisely to finish before Index.tsx unmounts at 5.0s
    // We will build a 4.5s animation, leaving 0.5s for the exit transition.
    const tl = gsap.timeline();

    // 1. The Mathematical Counter (0 to 100 exactly)
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 4.5,
      ease: "power3.inOut", // Smooth acceleration and deceleration
      onUpdate: () => {
        const currentVal = Math.round(counterObj.val);
        setDisplayProgress(currentVal);

        // Narrative text updates based on exact mathematical progress
        if (currentVal < 20) setLoadingText("INITIALIZING FIRMWARE");
        else if (currentVal < 45) setLoadingText("ANALYZING MARKETS");
        else if (currentVal < 70) setLoadingText("PROJECTING GROWTH");
        else if (currentVal < 95) setLoadingText("SECURING ASSETS");
        else setLoadingText("ACCESS GRANTED");
      }
    }, 0);

    // 2. The Bottom Progress Line (Glowing Thread)
    if (progressLineRef.current) {
      tl.to(progressLineRef.current, {
        width: "100%",
        duration: 4.5,
        ease: "power3.inOut",
      }, 0);
    }

    // 3. The Financial SVG Animation (Drawing the exponential curve)
    // First, set all paths to be hidden via stroke-dasharray/offset
    svgLinesRef.current.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }
    });

    // Animate the axes first (0 to 1s)
    if (svgLinesRef.current[0]) { // X Axis
      tl.to(svgLinesRef.current[0], { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0);
    }
    if (svgLinesRef.current[1]) { // Y Axis
      tl.to(svgLinesRef.current[1], { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0);
    }

    // Animate the Exponential Bull Curve (1s to 4.5s)
    if (svgLinesRef.current[2]) { // The Curve
      tl.to(svgLinesRef.current[2], { strokeDashoffset: 0, duration: 3.5, ease: "power2.inOut" }, 1);
    }

    // Pulse the data nodes/circles as the curve passes them
    svgCirclesRef.current.forEach((circle, index) => {
      if (circle) {
        gsap.set(circle, { scale: 0, opacity: 0, transformOrigin: "center" });
        // Calculate dynamic delay based on position in the curve (rough approximation)
        tl.to(circle, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, 1.5 + (index * 0.7));
      }
    });

    // 4. The Unveiling (Exit Animation) at 4.6s (Index unmounts at 5.0s)
    // We animate the main container's clip-path to elegantly reveal the site underneath
    tl.to(loaderRef.current, {
      clipPath: "inset(0% 0% 100% 0%)", // Slices upwards
      duration: 0.8,
      ease: "power4.inOut"
    }, 4.6);

    // Optional: Subtle scale up of the typography just before exit for dramatic effect
    tl.to(".loader-typography-container", {
      scale: 1.05,
      filter: "blur(4px)",
      opacity: 0.5,
      duration: 0.6,
      ease: "power2.in"
    }, 4.4);


    return () => {
      tl.kill(); // Cleanup GSAP timeline on unmount
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      // PURE NAVY Lighweight background. No CSS blur or extreme layers affecting performance.
      className={[
        "fixed inset-0 flex flex-col items-center justify-between bg-[#040814] text-[#ededed] select-none z-[9999] overflow-hidden px-6 py-12 md:px-12 md:py-16",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
      style={{ clipPath: "inset(0% 0% 0% 0%)" }} // Initial state for the GSAP exit animation
    >
      {/* NOISE OVERLAY - Single clean layer */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* FINANCE SVG: THE EXPONENTIAL CURVE (Background Layer) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          viewBox="0 0 1000 800"
          className="w-[120%] md:w-[80%] max-w-none md:max-w-6xl opacity-15 stroke-white"
          fill="none"
        >
          {/* Grid Lines (Subtle Context) */}
          <path d="M100,200 L900,200 M100,400 L900,400 M100,600 L900,600" className="stroke-white/5" strokeWidth="1" strokeDasharray="10 10" />
          <path d="M300,100 L300,700 M500,100 L500,700 M700,100 L700,700" className="stroke-white/5" strokeWidth="1" strokeDasharray="10 10" />

          {/* X Axis */}
          <path
            ref={(el) => (svgLinesRef.current[0] = el)}
            d="M100,700 L900,700"
            className="stroke-white/30"
            strokeWidth="2"
          />
          {/* Y Axis */}
          <path
            ref={(el) => (svgLinesRef.current[1] = el)}
            d="M100,700 L100,100"
            className="stroke-white/30"
            strokeWidth="2"
          />

          {/* The Exponential Bull Curve */}
          {/* Starts flat, grows slowly, then sweeps exponentially upwards */}
          <path
            ref={(el) => (svgLinesRef.current[2] = el)}
            d="M100,700 C300,700 450,650 600,450 C700,316 800,100 900,100"
            className="stroke-white shadow-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Data Nodes (Valuation Points) */}
          <circle ref={(el) => (svgCirclesRef.current[0] = el)} cx="450" cy="650" r="6" className="fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <circle ref={(el) => (svgCirclesRef.current[1] = el)} cx="600" cy="450" r="8" className="fill-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
          <circle ref={(el) => (svgCirclesRef.current[2] = el)} cx="740" cy="240" r="10" className="fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          <circle ref={(el) => (svgCirclesRef.current[3] = el)} cx="900" cy="100" r="14" className="fill-white drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
        </svg>
      </div>

      {/* TOP BAR / METADATA */}
      <div className="relative z-10 w-full flex justify-between items-start text-[10px] md:text-[11px] font-elegant uppercase tracking-[0.25em] md:tracking-[0.4em] text-white/40">
        <div>
          <span className="block mb-1 opacity-50">LOCATION</span>
          <span className="text-white/80 font-medium tracking-[0.3em] md:tracking-[0.5em]">GLOBAL</span>
        </div>
        <div className="text-right">
          <span className="block mb-1 opacity-50">STATUS</span>
          <span className="block text-white/80 font-medium tracking-[0.3em] md:tracking-[0.5em] min-w-[120px]">
            {loadingText}
          </span>
        </div>
      </div>

      {/* CENTER: MASSIVE TYPOGRAPHY */}
      <div className="loader-typography-container relative z-10 flex flex-col items-center justify-center flex-grow w-full mix-blend-exclusion">
        <div className="relative flex items-center justify-center">
          <div
            className="font-luxury italic leading-none tracking-tighter"
            style={{
              fontSize: "clamp(8rem, 28vw, 30rem)",
              letterSpacing: "-0.04em",
              lineHeight: "0.75",
              color: "#ffffff",
              textShadow: "0 0 30px rgba(255,255,255,0.05)"
            }}
          >
            {displayProgress}
          </div>
          {/* Percentage Sign */}
          <span
            className="font-elegant font-light text-white/30 ml-2 md:ml-6 mb-[4vw] md:mb-[6vw]"
            style={{ fontSize: "clamp(1rem, 4.5vw, 4rem)" }}
          >
            %
          </span>
        </div>
      </div>

      {/* BOTTOM: SVG PROGRESS GEOMETRY & BRAND */}
      <div className="relative z-10 w-full flex flex-col gap-6 md:gap-8">
        <div className="flex justify-between items-end font-elegant text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.5em] text-white/40 uppercase">
          <div>AMANDA C.</div>
          <div>EST. WEALTH</div>
        </div>

        {/* The Brutal Progress Bar (Glowing Thread) */}
        <div className="w-full h-[1px] bg-white/5 relative overflow-hidden flex">
          <div
            ref={progressLineRef}
            className="absolute top-0 left-0 bottom-0 bg-white"
            style={{
              width: "0%", // Animated by GSAP
              boxShadow: "20px 0 20px 1px rgba(255,255,255,0.2)"
            }}
          />
        </div>
      </div>
    </div>
  );
}