"use client";

import React, { useRef, useEffect } from "react";

import { Link } from "react-router-dom";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);



/* ═══════════════════════════════════════════════════════════════

   TYPES

   ═══════════════════════════════════════════════════════════════ */

interface Product {

  title: string;

  link: string;

  thumbnail: string;

}



interface HeroParallaxProps {

  products: Product[];

}



/* ═══════════════════════════════════════════════════════════════

   SAFE DEFAULT PRODUCT (eliminates TS2339 errors)

   ═══════════════════════════════════════════════════════════════ */

const DEFAULT_PRODUCT: Product = { title: "", link: "#", thumbnail: "" };



/* ═══════════════════════════════════════════════════════════════

   EDITORIAL LAYOUT (ACT 2-4)

   ═══════════════════════════════════════════════════════════════ */

const EDITORIAL_LAYOUTS = [

  { top: "15%", left: "50%", w: "40%", aspect: "3/4", speed: 1.2, delay: 0.1 },

  { top: "45%", left: "6%", w: "45%", aspect: "16/9", speed: 0.8, delay: 0 },

  { top: "10%", left: "12%", w: "25%", aspect: "4/5", speed: 1.5, delay: 0.15 },

  { top: "65%", left: "45%", w: "30%", aspect: "16/10", speed: 0.6, delay: 0.05 },

  { top: "8%", left: "82%", w: "15%", aspect: "1/1", speed: 1.1, delay: 0.2 },

];



/* ═══════════════════════════════════════════════════════════════

   TEXT SPLITTER

   ═══════════════════════════════════════════════════════════════ */

const SplitChars: React.FC<{

  text: string;

  className?: string;

  charClass?: string;

}> = ({ text, className, charClass = "hero-char" }) => (

  <span className={className} aria-label={text} role="text">

    {text.split("").map((ch, i) => (

      <span

        key={i}

        className={`${charClass} inline-block`}

        aria-hidden="true"

        style={{ display: ch === " " ? "inline" : undefined }}

      >

        {ch === " " ? "\u00A0" : ch}

      </span>

    ))}

  </span>

);



/* ═══════════════════════════════════════════════════════════════

   MAIN COMPONENT — ULTRA BRUTAL SCROLLTELLING (800vh)

   Uses CSS height for scroll distance + GSAP pin for viewport lock

   ═══════════════════════════════════════════════════════════════ */

export const HeroParallax: React.FC<HeroParallaxProps> = ({ products }) => {

  const sectionRef = useRef<HTMLDivElement>(null);

  const cameraRef = useRef<HTMLDivElement>(null);



  // Act Refs

  const hookRef = useRef<HTMLDivElement>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  const manifestoRef = useRef<HTMLDivElement>(null);

  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // SVG Refs
  const defsRef = useRef<SVGSVGElement>(null);
  const verticalWireRef = useRef<SVGPathElement>(null);
  const horizontalWireRef = useRef<SVGPathElement>(null);

  /* ─── Magnetic Hook Heading (subtle parallax on mouse) ─── */

  useEffect(() => {

    const hook = hookRef.current;

    if (!hook) return;



    const onMove = (e: MouseEvent) => {

      const nx = ((e.clientX / window.innerWidth) - 0.5) * 2;

      const ny = ((e.clientY / window.innerHeight) - 0.5) * 2;

      gsap.to(hook, { x: nx * 10, y: ny * 8, duration: 1, ease: "power2.out" });

    };



    window.addEventListener("mousemove", onMove);

    return () => window.removeEventListener("mousemove", onMove);

  }, []);



  /* ═══════════════════════════════════════════════════════════════

     GSAP 6-ACT MASTER TIMELINE

     trigger = outer section (800vh tall)

     pin = inner camera (h-screen), GSAP locks it via position:fixed

     ═══════════════════════════════════════════════════════════════ */

  useEffect(() => {

    const section = sectionRef.current;

    const camera = cameraRef.current;

    const hook = hookRef.current;

    const gallery = galleryRef.current;

    const manifesto = manifestoRef.current;

    const hTrack = horizontalTrackRef.current;
    const defs = defsRef.current;
    const vertWire = verticalWireRef.current;
    const horizWire = horizontalWireRef.current;

    if (!section || !camera || !hook || !gallery || !manifesto || !hTrack || !defs || !vertWire || !horizWire) return;



    const ctx = gsap.context(() => {

      const hookChars = hook.querySelectorAll(".hero-char");

      const images = gallery.querySelectorAll("[data-hero-img]");

      const maniChars1 = manifesto.querySelectorAll(".mani-l1 .hero-mask-char");

      const maniChars2 = manifesto.querySelectorAll(".mani-l2 .hero-mask-char");

      const hImages = hTrack.querySelectorAll(".inner-img");
      const clipPaths = defsRef.current?.querySelectorAll("path[class^='clip-path-anim']");
      // const vertWire = verticalWireRef.current; // Already defined above
      // const horizWire = horizontalWireRef.current; // Already defined above

      /* ── Initial States ── */

      gsap.set(hookChars, { y: 100, opacity: 0, skewY: 10, scale: 1.1, filter: "blur(0px)" });
      gsap.set([maniChars1, maniChars2], { y: "150%", rotateX: -60, opacity: 0, filter: "blur(12px)" });
      gsap.set(hTrack, { autoAlpha: 0 });
      gsap.set(hImages, { xPercent: -15 });

      // Images (Clip path logic initial)
      gsap.set(images, { z: -1000, scale: 1.1, opacity: 1, filter: "brightness(2) blur(15px)" });
      if (clipPaths) gsap.set(clipPaths, { attr: { d: "M 0.499 0 L 0.501 0 L 0.501 1 L 0.499 1 Z" } });
      if (vertWire) gsap.set(vertWire, { strokeDasharray: 1, strokeDashoffset: 1 });
      if (horizWire) gsap.set(horizWire, { strokeDasharray: 1, strokeDashoffset: 1 });



      /* ══════════════ THE TIMELINE ══════════════ */

      const master = gsap.timeline({

        scrollTrigger: {

          trigger: section,          // 800vh tall container = scroll distance

          start: "top top",

          end: "bottom bottom",      // scrub through the entire 800vh

          pin: camera,               // pin the CAMERA (h-screen inner div)

          pinSpacing: false,         // parent already has the height, no extra space needed

          scrub: 1.5,

          anticipatePin: 1,

          invalidateOnRefresh: true,

        },

      });



      /* ── ACT 1: LA DECLARACIÓN (0.00 - 0.12) ── */

      master.to(hookChars, {

        y: 0, opacity: 1, skewY: 0, scale: 1,

        stagger: 0.02, duration: 0.03, ease: "power4.out"

      }, 0);

      master.to(hookChars, {

        z: -1000, scale: 0.4, opacity: 0, filter: "blur(15px)",

        stagger: 0.01, duration: 0.08, ease: "power2.in"

      }, 0.04);



      /* ── ACT 1.5: HILO CONDUCTOR VERTICAL (0.00 - 0.45) ── */
      if (vertWire) {
        master.to(vertWire, {
          strokeDashoffset: 0,
          duration: 0.45,
          ease: "none"
        }, 0.0);
      }

      /* ── ACT 2: EL SURGIMIENTO (Advanced Clip-Path Morphing) (0.10 - 0.20) ── */
      images.forEach((img, i) => {
        const layout = EDITORIAL_LAYOUTS[i] || EDITORIAL_LAYOUTS[0];
        const clipNode = defsRef.current?.querySelector(`.clip-path-anim-${i}`);

        // Restaurar atributos físicos de la imagen (fade in brutal)
        master.to(img, {
          z: 0, scale: 1, filter: "brightness(1) blur(0px)",
          duration: 0.12, ease: "power2.out"
        }, 0.10 + (layout.delay * 0.15));

        // Expansión visceral del clip-path desde el centro
        if (clipNode) {
          master.to(clipNode, {
            attr: { d: "M 0 0 L 1 0 L 1 1 L 0 1 Z" },
            duration: 0.12, ease: "expo.out"
          }, 0.10 + (layout.delay * 0.15));
        }
      });



      /* ── ACT 3: LA GALERÍA VERTICAL (0.20 - 0.35) ── */

      images.forEach((img, i) => {

        const layout = EDITORIAL_LAYOUTS[i] || EDITORIAL_LAYOUTS[0];

        master.to(img, {

          y: -layout.speed * 150,

          duration: 0.15, ease: "none"

        }, 0.20);



        master.to(img, {

          y: -window.innerHeight * 1.5,

          scale: 0.8, filter: "blur(10px)", opacity: 0,

          duration: 0.07, ease: "power2.in"

        }, 0.28 + (layout.delay * 0.1));

      });



      /* ── ACT 4: PRIMERA PROMESA (0.35 - 0.48) ── */

      master.to(maniChars1, {

        y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)",

        stagger: 0.01, duration: 0.05, ease: "expo.out"

      }, 0.35);

      master.to(maniChars2, {

        y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)",

        stagger: 0.01, duration: 0.05, ease: "expo.out"

      }, 0.38);



      // Fade out to setup Horizon

      master.to(manifesto, {

        opacity: 0, filter: "blur(20px)", scale: 1.1,

        duration: 0.06, ease: "power2.inOut"

      }, 0.44);



      /* ── ACT 5: "SERIFS PASANDO" (HORIZON SCROLL) (0.50 - 0.95) ── */

      master.to(hTrack, { autoAlpha: 1, duration: 0.01 }, 0.49);



      const getScrollAmount = () => -(hTrack.scrollWidth - window.innerWidth + 150);



      master.fromTo(hTrack,

        { x: () => window.innerWidth },

        { x: getScrollAmount, duration: 0.45, ease: "none" },

        0.50

      );



      // Deep Inner Image Parallax inside the track

      master.to(hImages, {

        xPercent: 15, duration: 0.45, ease: "none"

      }, 0.50);

      // Horizontal Wire Tracing Sync
      if (horizWire) {
        master.to(horizWire, {
          strokeDashoffset: 0,
          duration: 0.45,
          ease: "none"
        }, 0.50);
      }

      /* ── KINETIC STROKE TEXT SPATIAL MODIFIER (onUpdate) ── */
      master.eventCallback("onUpdate", () => {
        if (!hTrack) return;
        const texts = hTrack.querySelectorAll(".text-kinetic");
        const center = window.innerWidth / 2;

        texts.forEach((text: any) => {
          const rect = text.getBoundingClientRect();
          const elementCenter = rect.left + rect.width / 2;
          const dist = Math.abs(center - elementCenter);
          const maxDist = window.innerWidth / 1.5;

          let progress = 1 - (dist / maxDist);
          if (progress < 0) progress = 0;
          if (progress > 1) progress = 1;

          // Curva de interpolación visual (expo)
          const easeProgress = Math.pow(progress, 3);

          // Mutaciones SVG (Proximidad altera el stroke y fill)
          const strokeW = 1 + (easeProgress * 5); // Grosor de 1 a 6
          const fillAlpha = easeProgress * 0.95;  // Core de relleno
          const strokeAlpha = 0.2 + (progress * 0.8);

          gsap.set(text, {
            strokeWidth: strokeW,
            fill: `rgba(255,255,255,${fillAlpha})`,
            stroke: `rgba(255,255,255,${strokeAlpha})`,
            scale: 1 + (easeProgress * 0.05), // Pulso volumétrico
            transformOrigin: "center center"
          });
        });
      });


      /* ── ACT 6: EL VACÍO FINAL (0.95 - 1.00) ── */

      master.to(camera.querySelector(".bg-dimmer"), {

        opacity: 1, duration: 0.05, ease: "power2.inOut"

      }, 0.95);



    }, section);



    return () => ctx.revert();

  }, [products]);



  /* ─── Safe product accessors ─── */

  const displayProducts = products.slice(0, 5);

  const safeProduct = (i: number): Product => displayProducts[i] ?? DEFAULT_PRODUCT;

  const p0 = safeProduct(0);

  const p1 = safeProduct(1);

  const p2 = safeProduct(2);

  const p3 = safeProduct(3);

  const p4 = safeProduct(4);



  return (

    <div

      ref={sectionRef}

      className="hero-parallax-section relative w-full bg-black"

      style={{ height: "800vh" }}

    >

      {/* ══════ Camera — pinned by GSAP (position:fixed while scrolling) ══════ */}

      <div

        ref={cameraRef}

        className="relative w-full h-screen overflow-hidden"

        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}

      >

        {/* ── Atmospheric Void ── */}

        <div className="absolute inset-0 z-0 bg-black" />

        {/* ── SVG Global Definitions ── */}
        <svg ref={defsRef} width="0" height="0" className="absolute pointer-events-none">
          <defs>
            {displayProducts.map((_, i) => (
              <clipPath key={`reveal-mask-${i}`} id={`reveal-mask-${i}`} clipPathUnits="objectBoundingBox">
                <path className={`clip-path-anim-${i}`} d="M 0.499 0 L 0.501 0 L 0.501 1 L 0.499 1 Z" />
              </clipPath>
            ))}
          </defs>
        </svg>

        {/* ── Vertical Wire (Hilo Conductor) ── */}
        <svg className="absolute inset-0 w-full h-full z-[3] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path
            ref={verticalWireRef}
            d="M 50 0 L 50 100"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.1"
            fill="none"
            pathLength="1"
          />
        </svg>

        <div

          className="absolute inset-0 z-[1] opacity-[0.08] mix-blend-overlay pointer-events-none"

          style={{

            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,

            backgroundSize: "128px",

          }}

        />

        <div

          className="absolute inset-0 z-[1] pointer-events-none"

          style={{

            background:

              "radial-gradient(ellipse at 50% 50%, hsl(220 30% 12% / 0.4) 0%, transparent 60%)",

          }}

        />



        {/* ══════════ ACT 2/3: VERTICAL EDITORIAL GALLERY ══════════ */}

        <div ref={galleryRef} className="absolute inset-0 z-[2]" style={{ transformStyle: "preserve-3d" }}>

          {displayProducts.map((product, i) => {

            const layout = EDITORIAL_LAYOUTS[i] || EDITORIAL_LAYOUTS[0];

            return (

              <div

                key={`vert-${i}`}

                data-hero-img

                className="hero-image-wrapper absolute rounded-sm md:rounded-md shadow-2xl"

                style={{

                  top: layout.top,

                  left: layout.left,

                  width: layout.w,

                  aspectRatio: layout.aspect,
                  clipPath: `url(#reveal-mask-${i})`,
                  willChange: "transform, opacity, filter, clip-path",

                }}

              >

                <Link

                  to={product.link}

                  className="block w-full h-full relative"

                  aria-label={`Ver detalle: ${product.title}`}

                >

                  <img

                    src={product.thumbnail}

                    alt={`Premio ${product.title}`}

                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-[2s] hover:scale-110"

                    loading={i < 2 ? "eager" : "lazy"}

                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-5 right-5 z-10 opacity-0 translate-y-4 hover:translate-y-0 hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">

                    <p className="text-white text-xs font-light tracking-[0.1em] uppercase border-b border-white/20 pb-2 inline-block">

                      {product.title}

                    </p>

                  </div>

                </Link>

              </div>

            );

          })}

        </div>



        {/* ══════════ ACT 1: THE HOOK ══════════ */}

        <div

          ref={hookRef}

          className="absolute inset-0 z-[5] flex flex-col justify-center items-center pointer-events-none"

          style={{ transformStyle: "preserve-3d" }}

        >

          <span className="text-[10px] md:text-sm uppercase tracking-[0.5em] text-white/40 font-light mb-6">

            Trayectoria de Impacto

          </span>

          <div className="text-center">

            <h1 className="hero-heading text-5xl sm:text-7xl md:text-[6rem] lg:text-[8rem] xl:text-[10rem] leading-[0.85] tracking-[-0.05em]">

              <SplitChars text="EXCELENCIA" className="hero-char-main" />

            </h1>

            <div className="mt-2 md:mt-4">

              <span className="hero-heading text-5xl sm:text-7xl md:text-[6rem] lg:text-[8rem] xl:text-[10rem] leading-[0.85] tracking-[-0.05em]">

                <SplitChars text="VERIFICADA" className="hero-char-accent" />

              </span>

            </div>

          </div>

        </div>



        {/* ══════════ ACT 4: THE PROMISE (First Manifesto) ══════════ */}

        <div

          ref={manifestoRef}

          className="absolute inset-0 z-[6] flex flex-col justify-center items-center px-4 md:px-12 pointer-events-none"

          style={{ transformStyle: "preserve-3d" }}

        >

          <div className="text-center w-full max-w-[90vw]">

            <div className="mask-line mani-l1">

              <h2 className="text-monumental font-luxury italic text-white/95 pb-4">

                <SplitChars text="Cada distinción," charClass="hero-mask-char" />

              </h2>

            </div>

            <div className="mask-line mani-l2 mt-[-2vw] md:mt-[-1vw]">

              <h2 className="text-monumental font-luxury italic text-white/80 pb-6">

                <SplitChars text="una promesa cumplida." charClass="hero-mask-char" />

              </h2>

            </div>

          </div>

        </div>



        {/* ══════════ ACT 5: "SERIFS PASANDO" (Horizontal Track) ══════════ */}

        <div

          ref={horizontalTrackRef}

          className="absolute top-0 left-0 h-screen flex items-center flex-nowrap gap-12 sm:gap-24 md:gap-32 w-max will-change-transform z-[15]"

        >
          {/* ── Horizontal Wire (Hilo Conductor Acto 5) ── */}
          <svg className="absolute top-[50%] left-0 w-[1000vw] h-[100px] -translate-y-1/2 z-[-1] pointer-events-none overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <path
              ref={horizontalWireRef}
              d="M 0 50 L 1000 50"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.5"
              fill="none"
              pathLength="1"
            />
          </svg>

          {/* spacer */}
          <div className="w-[10vw] flex-shrink-0" />

          {/* Product 0 */}
          <div className="w-[70vw] md:w-[35vw] h-[50vh] md:h-[70vh] flex-shrink-0 relative overflow-hidden rounded-md shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <Link to={p0.link} aria-label={`Ver ${p0.title}`} className="w-full h-full block">
              <img src={p0.thumbnail} alt={p0.title} className="absolute top-0 left-[-15%] w-[130%] h-full object-cover inner-img" />
              <div className="absolute inset-0 bg-black/30" />
            </Link>
          </div>

          <svg viewBox="0 0 350 300" className="h-[25vw] md:h-[18vw] w-auto overflow-visible flex-shrink-0" style={{ transformStyle: 'preserve-3d' }}>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
              className="font-luxury italic text-kinetic"
              fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" style={{ fontSize: '250px' }}>
              LA
            </text>
          </svg>

          <svg viewBox="0 0 1400 300" className="h-[25vw] md:h-[18vw] w-auto overflow-visible flex-shrink-0" style={{ transformStyle: 'preserve-3d' }}>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
              className="font-luxury text-kinetic"
              fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" style={{ fontSize: '250px' }}>
              EXCELENCIA
            </text>
          </svg>

          {/* Product 1 */}
          <div className="w-[85vw] md:w-[45vw] h-[40vh] md:h-[50vh] flex-shrink-0 relative overflow-hidden rounded-md mt-64 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <Link to={p1.link} aria-label={`Ver ${p1.title}`} className="w-full h-full block">
              <img src={p1.thumbnail} alt={p1.title} className="absolute top-0 left-[-15%] w-[130%] h-full object-cover inner-img" />
            </Link>
          </div>

          <svg viewBox="0 0 750 300" className="h-[25vw] md:h-[18vw] w-auto overflow-visible flex-shrink-0" style={{ transformStyle: 'preserve-3d' }}>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
              className="font-luxury italic text-kinetic"
              fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" style={{ fontSize: '250px' }}>
              NO SE
            </text>
          </svg>

          {/* Product 2 */}
          <div className="w-[60vw] md:w-[30vw] h-[45vh] md:h-[60vh] flex-shrink-0 relative overflow-hidden rounded-md mb-64 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <Link to={p2.link} aria-label={`Ver ${p2.title}`} className="w-full h-full block">
              <img src={p2.thumbnail} alt={p2.title} className="absolute top-0 left-[-15%] w-[130%] h-full object-cover inner-img filter grayscale border border-white/5" />
            </Link>
          </div>

          <svg viewBox="0 0 1200 300" className="h-[25vw] md:h-[18vw] w-auto overflow-visible flex-shrink-0" style={{ transformStyle: 'preserve-3d' }}>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
              className="font-luxury text-kinetic"
              fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" style={{ fontSize: '250px' }}>
              PROCLAMA
            </text>
          </svg>

          {/* Product 3 */}
          <div className="w-[70vw] md:w-[40vw] h-[55vh] flex-shrink-0 relative overflow-hidden rounded-md shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <Link to={p3.link} aria-label={`Ver ${p3.title}`} className="w-full h-full block">
              <img src={p3.thumbnail} alt={p3.title} className="absolute top-0 left-[-15%] w-[130%] h-full object-cover inner-img" />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            </Link>
          </div>

          <div className="flex items-center gap-12 md:gap-24 flex-shrink-0">
            <div className="w-[20vw] h-[1px] bg-white/30" />
            <svg viewBox="0 0 1900 300" className="h-[25vw] md:h-[18vw] w-auto overflow-visible flex-shrink-0" style={{ transformStyle: 'preserve-3d' }}>
              <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
                className="font-luxury italic text-kinetic"
                fill="rgba(255,255,255,0)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" style={{ fontSize: '250px' }}>
                SE DEMUESTRA.
              </text>
            </svg>
          </div>



          {/* Product 4 (Final shot) */}

          <div className="w-[90vw] md:w-[50vw] h-[50vh] flex-shrink-0 relative overflow-hidden rounded-md mt-32 shadow-[0_0_80px_rgba(0,0,0,0.8)]">

            <Link to={p4.link} aria-label={`Ver ${p4.title}`} className="w-full h-full block">

              <img src={p4.thumbnail} alt={p4.title} className="absolute top-0 left-[-15%] w-[130%] h-full object-cover inner-img filter brightness-110" />

            </Link>

          </div>



          {/* buffer space */}

          <div className="w-[30vw] flex-shrink-0" />

        </div>



        {/* ── Dimmer for transition to next section ── */}

        <div className="bg-dimmer absolute inset-0 z-[50] bg-black opacity-0 pointer-events-none" />

      </div>

    </div>

  );

};



/* ═══════════════════════════════════════════════════════════════

   LEGACY EXPORTS

   ═══════════════════════════════════════════════════════════════ */

export const Header = () => null;

export const ProductCard = ({ }: { product: Product; translate: any }) => null;