import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

gsap.registerPlugin(ScrollTrigger);

const GRADIENT_TEXT = 'bg-gradient-to-b from-white via-white/90 to-white/65 bg-clip-text text-transparent';

const AnimatedCounter = ({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) => (
  <span className="js-animated-counter font-luxury text-5xl tabular-nums not-italic text-transparent bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text md:text-7xl" data-target={target} data-duration={duration}>
    <span className="js-counter-val">0</span>
    {suffix ? <span className="text-primary">{suffix}</span> : null}
  </span>
);

const TitleReveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <div className={`overflow-hidden js-title-reveal-container ${className}`}>
    <div className="js-title-reveal translate-y-[110%]" data-delay={delay}>
      {children}
    </div>
  </div>
);

const WordStagger = ({ text, className = '' }: { text: string; className?: string }) => (
  <p className={`js-word-stagger ${className}`}>
    {text.split(' ').map((word, i) => (
      <span key={i} className="mr-[0.3em] inline-block overflow-hidden">
        <span className="word-inner inline-block translate-y-[100%] opacity-0">{word}</span>
      </span>
    ))}
  </p>
);

const SpotlightCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--spot-x', `${x}%`);
    cardRef.current.style.setProperty('--spot-y', `${y}%`);
  }, []);

  const handleLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--spot-x', '50%');
    cardRef.current.style.setProperty('--spot-y', '50%');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-2xl transition-transform duration-300 hover:-translate-y-[5px] ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--spot-x': '50%', '--spot-y': '50%' } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl" style={{ background: 'radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(255,255,255,0.07), transparent 60%)' }} />
      {children}
    </div>
  );
};

const SECTIONS = [
  { id: 'trayectoria', stat: { value: 24, suffix: '+', label: 'AÃ±os de Trayectoria' }, body: 'Amanda Cruz es una asesora financiera con mÃ¡s de 24 aÃ±os de experiencia, especializada en la planeaciÃ³n de portafolios e inversiones internacionales. Desde BogotÃ¡, y como parte de AXIA, ha acompaÃ±ado a profesionales, empresarios y familias a transformar la manera en que protegen y hacen crecer su patrimonio.' },
  { id: 'impacto', stat: { value: 150, suffix: '+', label: 'Profesionales y Familias' }, body: 'A lo largo de su carrera, ha guiado a mÃ¡s de 150 profesionales y familias a fortalecer su patrimonio, mediante estrategias personalizadas que combinan diversificaciÃ³n global, optimizaciÃ³n del riesgo y un acompaÃ±amiento cercano en cada etapa.' },
  { id: 'reconocimiento', isAward: true, body: 'En 2024 fue nombrada "Mejor Asesor Financiero del AÃ±o" por United Financial Consultants (UFC), reconocimiento que consolida mÃ¡s de dos dÃ©cadas de resultados concretos y confianza construida cliente a cliente.' },
  { id: 'filosofia', body: 'Su filosofÃ­a es inquebrantable: cada cliente merece un plan financiero diseÃ±ado con precisiÃ³n quirÃºrgica, visiÃ³n global y resultados que se traduzcan en seguridad y crecimiento sostenible a largo plazo.' },
] as const;

const NarrativeBlock = ({ section, className = '' }: { section: (typeof SECTIONS)[number]; className?: string }) => {
  const hasStat = 'stat' in section && section.stat;

  return (
    <div
      className={`js-narrative-block about-narrative-block invisible translate-x-[-12px] scale-[0.985] py-10 opacity-0 will-change-transform md:py-16 ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {hasStat && section.stat ? (
        <div className="mb-6">
          <AnimatedCounter target={section.stat.value} suffix={section.stat.suffix} duration={2.2} />
          <p className="mt-2 font-elegant text-sm uppercase tracking-[0.25em] text-white/30">{section.stat.label}</p>
        </div>
      ) : null}

      {'isAward' in section && section.isAward ? (
        <SpotlightCard className="px-8 py-7">
          <div className="about-breathing-orb pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ background: 'radial-gradient(circle, hsl(220 100% 60% / 0.2), transparent 70%)' }} />
          <p className="relative z-20 mb-3 font-elegant text-xs uppercase tracking-[0.3em] text-primary/60">Reconocimiento 2024</p>
          <div className="relative z-20">
            <WordStagger text={section.body} className={`font-elegant text-lg leading-[1.8] ${GRADIENT_TEXT}`} />
          </div>
        </SpotlightCard>
      ) : (
        <WordStagger text={section.body} className={`font-elegant text-lg leading-[1.85] md:text-xl ${GRADIENT_TEXT}`} />
      )}
    </div>
  );
};

const AboutAmanda = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const counters = gsap.utils.toArray<HTMLElement>('.js-animated-counter');
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const duration = parseFloat(el.getAttribute('data-duration') || '2');
      const valEl = el.querySelector('.js-counter-val');

      if (!valEl) return;

      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        onUpdate: () => {
          valEl.innerHTML = String(Math.round(proxy.val));
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('.js-word-stagger').forEach((el) => {
      const spans = el.querySelectorAll('.word-inner');
      gsap.to(spans, {
        y: '0%',
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
        stagger: 0.025,
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });

    gsap.utils.toArray<HTMLElement>('.js-title-reveal').forEach((el) => {
      const delay = parseFloat(el.getAttribute('data-delay') || '0');
      gsap.to(el, {
        y: '0%',
        duration: 0.9,
        delay,
        ease: 'expo.out',
        scrollTrigger: { trigger: el.parentElement, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });

    const accentLine = containerRef.current.querySelector('.js-accent-line');
    if (accentLine) {
      gsap.to(accentLine, {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: accentLine, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }

    const cta = containerRef.current.querySelector('.js-cta-reveal');
    if (cta) {
      gsap.to(cta, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: cta, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }

    const mm = gsap.matchMedia(containerRef);

    mm.add('(min-width: 1024px)', () => {
      const leftCol = containerRef.current?.querySelector('.js-left-col') as HTMLElement | null;
      const progressShell = containerRef.current?.querySelector('.about-progress-shell') as HTMLElement | null;
      const progressDot = containerRef.current?.querySelector('.about-progress-dot') as HTMLElement | null;
      const blocks = gsap.utils.toArray<HTMLElement>('.about-narrative-block');

      gsap.set('.js-narrative-block', { autoAlpha: 1, x: 0, scale: 1, clearProps: 'transform' });

      blocks.forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            end: 'bottom 28%',
            scrub: true,
          },
        });

        tl.fromTo(
          el,
          { opacity: 0.22, x: -18, scale: 0.985 },
          { opacity: 1, x: 0, scale: 1, ease: 'none' }
        ).to(
          el,
          { opacity: 0.22, x: -12, scale: 0.985, ease: 'none' },
          0.68
        );
      });

      if (leftCol && progressShell && progressDot) {
        const syncTravel = () => {
          const travel = Math.max(progressShell.offsetHeight - progressDot.offsetHeight, 0);
          leftCol.style.setProperty('--about-progress-travel', `${travel}px`);
        };

        syncTravel();

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onRefresh: syncTravel,
          onUpdate: (self) => {
            leftCol.style.setProperty('--about-progress', self.progress.toFixed(4));
          },
        });
      }

      const imageWrap = containerRef.current?.querySelector('.js-image-wrap');
      if (imageWrap) {
        gsap.fromTo(
          imageWrap.querySelector('.about-image-outer'),
          { opacity: 0, x: 40, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: imageWrap, start: 'top 80%', toggleActions: 'play none none none' } }
        );

        gsap.fromTo(
          imageWrap.querySelector('.about-image-inner'),
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1.4, delay: 0.15, ease: 'power2.out', scrollTrigger: { trigger: imageWrap, start: 'top 80%', toggleActions: 'play none none none' } }
        );

        gsap.fromTo(
          imageWrap.querySelector('.about-name-badge'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power2.out', scrollTrigger: { trigger: imageWrap, start: 'top 80%', toggleActions: 'play none none none' } }
        );

        gsap.to(imageWrap.querySelector('.about-image-inner'), {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom bottom', scrub: true },
        });

        const glowPrimary = imageWrap.querySelector('.about-glow-primary');
        const glowSecondary = imageWrap.querySelector('.about-glow-secondary');
        const orb = containerRef.current.querySelector('.about-breathing-orb');
        if (glowPrimary) gsap.to(glowPrimary, { scale: 1.15, opacity: 0.45, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        if (glowSecondary) gsap.to(glowSecondary, { scale: 1, opacity: 0.2, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
        if (orb) gsap.to(orb, { scale: 1.2, opacity: 0.14, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        const tiltEl = imageWrap.querySelector('.about-tilt-target') as HTMLElement | null;
        const outer = imageWrap.querySelector('.about-image-outer') as HTMLElement | null;
        if (tiltEl && outer) {
          const xTo = gsap.quickTo(tiltEl, 'rotateX', { duration: 0.4, ease: 'power2.out' });
          const yTo = gsap.quickTo(tiltEl, 'rotateY', { duration: 0.4, ease: 'power2.out' });
          const onMove = (e: MouseEvent) => {
            const rect = outer.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            yTo(px * 4);
            xTo(-py * 3);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          outer.addEventListener('mousemove', onMove, { passive: true });
          outer.addEventListener('mouseleave', onLeave);

          return () => {
            outer.removeEventListener('mousemove', onMove);
            outer.removeEventListener('mouseleave', onLeave);
          };
        }
      }

      return undefined;
    });

    mm.add('(max-width: 1023px)', () => {
      ScrollTrigger.batch('.js-narrative-block', {
        onEnter: (elements) => gsap.fromTo(
          elements,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, stagger: 0.15, duration: 1.2, ease: 'power4.out', overwrite: true }
        ),
        start: 'top 90%',
      });

      const imageWrap = containerRef.current?.querySelector('.js-image-wrap');
      if (imageWrap) {
        gsap.fromTo(
          imageWrap.querySelector('.about-image-outer'),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: imageWrap, start: 'top 85%', toggleActions: 'play none none none' } }
        );

        gsap.fromTo(
          imageWrap.querySelector('.about-image-inner'),
          { autoAlpha: 0, scale: 1.05 },
          { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: imageWrap, start: 'top 85%', toggleActions: 'play none none none' } }
        );

        gsap.fromTo(
          imageWrap.querySelector('.about-name-badge'),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: imageWrap, start: 'top 85%', toggleActions: 'play none none none' } }
        );
      }

      gsap.set('.about-glow-primary, .about-glow-secondary, .about-breathing-orb', { opacity: 0.05, clearProps: 'animation' });
      gsap.set('.about-tilt-target, .about-image-inner', { clearProps: 'transform' });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="relative lg:min-h-[300vh]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, hsl(220 100% 50% / 0.07), transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, hsl(220 80% 40% / 0.05), transparent 60%), radial-gradient(ellipse 40% 40% at 50% 20%, hsl(210 60% 30% / 0.03), transparent 50%)' }}
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="js-left-col relative order-2 pb-24 pt-24 lg:order-1 lg:pt-32" style={{ '--about-progress': 0, '--about-progress-travel': '0px' } as React.CSSProperties}>
            <div className="absolute bottom-24 left-0 top-32 hidden w-px lg:block">
              <div className="about-progress-shell absolute inset-0 overflow-visible">
                <div className="absolute inset-0 rounded-full bg-white/[0.05]" />
                <div
                  className="about-progress-fill absolute inset-0 origin-top rounded-full will-change-transform"
                  style={{
                    transform: 'scaleY(var(--about-progress, 0))',
                    background: 'linear-gradient(to bottom, hsl(220 100% 55% / 0.5), hsl(220 100% 65% / 0.15))',
                    boxShadow: '0 0 10px hsl(220 100% 55% / 0.2)',
                    willChange: 'transform',
                  }}
                />
                <div
                  className="about-progress-dot absolute left-1/2 top-0 h-[7px] w-[7px] rounded-full will-change-transform"
                  style={{
                    transform: 'translate3d(-50%, calc(var(--about-progress, 0) * var(--about-progress-travel, 0px)), 0)',
                    background: 'radial-gradient(circle, hsl(220 100% 70%) 30%, hsl(220 100% 55%) 100%)',
                    boxShadow: '0 0 8px hsl(220 100% 60% / 0.6), 0 0 20px hsl(220 100% 55% / 0.25), 0 0 40px hsl(220 100% 55% / 0.1)',
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>

            <div className="lg:pl-8">
              <TitleReveal className="mb-1">
                <h2 className={`font-luxury text-4xl leading-[1.08] md:text-5xl lg:text-6xl ${GRADIENT_TEXT}`}>Estrategia Global.</h2>
              </TitleReveal>
              <TitleReveal delay={0.12} className="mb-5">
                <h2 className="font-luxury text-4xl leading-[1.08] text-primary md:text-5xl lg:text-6xl">Seguridad Patrimonial.</h2>
              </TitleReveal>
              <div className="js-accent-line mb-14 h-px w-16 origin-left scale-x-0 opacity-0" style={{ background: 'linear-gradient(to right, hsl(220 100% 55% / 0.6), transparent)' }} />
              {SECTIONS.map((section) => (
                <NarrativeBlock key={section.id} section={section} />
              ))}
              <div className="js-cta-reveal mt-12 flex translate-y-[30px] justify-center opacity-0 md:mt-16 lg:justify-start">
                <MagneticCTA text="DiseÃ±emos tu impacto" className="self-start" />
              </div>
            </div>
          </div>

          <div className="js-image-wrap order-1 pt-24 lg:order-2 lg:sticky lg:top-20 lg:h-fit lg:self-start lg:pt-32">
            <div className="about-image-outer relative overflow-hidden rounded-2xl lg:[perspective:1200px]">
              <div className="about-tilt-target will-change-transform lg:[transform-style:preserve-3d]" style={{ willChange: 'transform' }}>
                <div className="about-image-inner relative will-change-transform" style={{ willChange: 'transform, opacity' }}>
                  <img
                    src="/lovable-uploads/5ce75e4d-ecd2-4490-8c38-8289c7e3a6e9.png"
                    alt="Amanda Cruz, asesora financiera especializada en inversiones internacionales"
                    className="h-auto w-full rounded-2xl object-cover"
                    loading="lazy"
                    style={{
                      maskImage: 'radial-gradient(ellipse 120% 90% at 50% 40%, black 50%, transparent 90%), linear-gradient(to bottom, black 55%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 120% 90% at 50% 40%, black 50%, transparent 90%), linear-gradient(to bottom, black 55%, transparent 100%)',
                      maskComposite: 'intersect',
                      WebkitMaskComposite: 'source-in' as unknown as string,
                    }}
                  />
                </div>
              </div>
              <div className="about-glow-primary absolute inset-0 hidden rounded-2xl lg:block" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 35%, hsl(220 100% 55% / 0.2), transparent 70%)', filter: 'blur(40px)', opacity: 0.25 }} />
              <div className="about-glow-secondary absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse 50% 50% at 60% 70%, hsl(200 80% 50% / 0.1), transparent 60%)', filter: 'blur(50px)', opacity: 0.1, transform: 'scale(1.1)' }} />
            </div>
            <div className="about-name-badge mt-6 text-center lg:text-left">
              <p className={`font-luxury text-2xl ${GRADIENT_TEXT}`}>Amanda Cruz</p>
              <p className="mt-1 font-elegant text-sm uppercase tracking-[0.2em] text-white/30">Senior Financial Advisor Â· AXIA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAmanda;
