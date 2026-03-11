import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import gsap from 'gsap';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ManifestoSection from '@/components/ManifestoSection';
import AboutAmanda from '@/components/AboutAmanda';
import Services from '@/components/Services';
import TrustBanner from '@/components/TrustBanner';
import LuxuryDollarLoader from '@/components/LuxuryDollarLoader';
import { useIsMobile } from '@/hooks/useIsMobile';

// Below-fold: React.lazy for asymmetric hydration (TTI optimization)
const KPIs = lazy(() => import('@/components/KPIs'));
const Process = lazy(() => import('@/components/Process'));
const GlobalFinancesCard = lazy(() => import('@/components/GlobalFinancesCard'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const FAQ = lazy(() => import('@/components/FAQ'));
const SantuarioDelTiempo = lazy(() => import('@/components/SantuarioDelTiempo'));
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));
const WebGLShaderOceanLight = lazy(() => import('@/components/ui/WebGLShaderOceanLight'));

/* CLS-safe skeleton: approximates real component height on mobile/desktop */
const Skeleton = ({ mobileH, desktopH }: { mobileH: string; desktopH: string }) => (
  <div
    className="w-full bg-white/[0.02] animate-pulse rounded-xl"
    style={{ minHeight: `clamp(${mobileH}, 50vw, ${desktopH})` }}
  />
);

const Index = () => {
  const [booting, setBooting] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => setBooting(false),
        });
      } else {
        setBooting(false);
      }
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-in');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });
      elements.forEach(el => observer.observe(el));
    };
    observeElements();

    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };
    document.addEventListener('click', handleSmoothScroll);
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <>
      <div className="mobile-ocean-backdrop pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* WebGL background — desktop only */}
      {hasMounted && !isMobile ? (
        <Suspense fallback={null}>
          <WebGLShaderOceanLight className="pointer-events-none fixed inset-0 z-0" />
        </Suspense>
      ) : null}

      {/* Main content */}
      <div className="cursor-glow relative z-10">
        <Header />
        <main>
          {/* Above the fold — eagerly loaded */}
          <Hero />
          <ManifestoSection />
          <AboutAmanda />
          <Services />

          <section id="trust-section" className="py-16">
            <div className="container mx-auto px-6">
              <TrustBanner />
            </div>
          </section>

          {/* Below the fold — code-split with CLS-safe skeletons */}
          <Suspense fallback={<Skeleton mobileH="400px" desktopH="500px" />}>
            <KPIs />
          </Suspense>

          <Suspense fallback={<Skeleton mobileH="900px" desktopH="700px" />}>
            <Process />
          </Suspense>

          <Suspense fallback={<Skeleton mobileH="1200px" desktopH="800px" />}>
            <GlobalFinancesCard />
          </Suspense>

          <Suspense fallback={<Skeleton mobileH="600px" desktopH="500px" />}>
            <Testimonials />
          </Suspense>

          <Suspense fallback={<Skeleton mobileH="500px" desktopH="400px" />}>
            <FAQ />
          </Suspense>

          <Suspense fallback={<Skeleton mobileH="700px" desktopH="600px" />}>
            <SantuarioDelTiempo />
          </Suspense>

          <Suspense fallback={<Skeleton mobileH="300px" desktopH="250px" />}>
            <CTASection />
          </Suspense>
        </main>

        <Suspense fallback={<Skeleton mobileH="200px" desktopH="180px" />}>
          <Footer />
        </Suspense>
      </div>

      {/* Preloader — GSAP timeline replaces AnimatePresence */}
      {booting && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-50"
        >
          <LuxuryDollarLoader />
        </div>
      )}
    </>
  );
};
export default Index;
