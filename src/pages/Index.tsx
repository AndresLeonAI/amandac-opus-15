import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutAmanda from '@/components/AboutAmanda';
import Services from '@/components/Services';
import TrustBanner from '@/components/TrustBanner';
import KPIs from '@/components/KPIs';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
const Index = () => {
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
  return <div className="cursor-glow overflow-x-hidden relative">
      
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <AboutAmanda />
          <Services />
          <section id="trust-section" className="py-16">
            <div className="container mx-auto px-6">
              
              <TrustBanner />
            </div>
          </section>
          <KPIs />
          <Process />
          <Testimonials />
          <FAQ />
          <ContactForm />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>;
};
export default Index;