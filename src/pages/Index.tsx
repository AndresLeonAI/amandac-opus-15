import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import gsap from 'gsap';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ManifestoSection from '@/components/ManifestoSection';
import AboutAmanda from '@/components/AboutAmanda';
import Services from '@/components/Services';
import TrustBanner from '@/components/TrustBanner';
import KPIs from '@/components/KPIs';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
const SantuarioDelTiempo = lazy(() => import('@/components/SantuarioDelTiempo'));
import CTASection from '@/components/CTASection';
import GlobalFinancesCard from '@/components/GlobalFinancesCard';
import Footer from '@/components/Footer';
const WebGLShaderOceanLight = lazy(() => import('@/components/ui/WebGLShaderOceanLight'));
import LuxuryDollarLoader from '@/components/LuxuryDollarLoader';

const Index = () => {
  const [booting, setBooting] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      // GSAP fadeout replaces AnimatePresence exit
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
      {/* WebGL background — lazy loaded */}
      <Suspense fallback={null}>
        <WebGLShaderOceanLight className="pointer-events-none fixed inset-0 z-0" />
      </Suspense>

      {/* Main content */}
      <div className="cursor-glow relative z-10">
        <Header />
        <main>
          <Hero />
          <ManifestoSection />
          <AboutAmanda />
          <Services />
          <section id="trust-section" className="py-16">
            <div className="container mx-auto px-6">
              <TrustBanner />
            </div>
          </section>
          <KPIs />
          <Process />
          <GlobalFinancesCard />
          <Testimonials />
          <FAQ />
          <Suspense fallback={null}>
            <SantuarioDelTiempo />
          </Suspense>
          <CTASection />
        </main>
        <Footer />
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