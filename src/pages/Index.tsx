import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import ContactForm from '@/components/ContactForm';
import CTASection from '@/components/CTASection';
import GlobalFinancesCard from '@/components/GlobalFinancesCard';
import Footer from '@/components/Footer';
import WebGLShaderOceanLight from '@/components/ui/WebGLShaderOceanLight';
import LuxuryDollarLoader from '@/components/LuxuryDollarLoader';

const Index = () => {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 3500); // 3.5s exactos
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Initialize scroll animations
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

    // Smooth scrolling for anchor links
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
      {/* WebGL detrás pero visible */}
      <WebGLShaderOceanLight className="pointer-events-none fixed inset-0 z-0" />

      {/* Contenido principal */}
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
          <ContactForm />
          <CTASection />
        </main>
        <Footer />
      </div>

      {/* Preloader sobre todo y con fade-out suave */}
      <AnimatePresence>
        {booting && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <LuxuryDollarLoader />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Index;