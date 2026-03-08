import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { awards } from "@/data/awards";
import { TiltCard } from "@/components/TiltCard";
import { Helmet } from "react-helmet-async";
import WebGLShaderOceanLight from "@/components/ui/WebGLShaderOceanLight";

gsap.registerPlugin(ScrollTrigger);

const orderedAwards = [
  awards[3],
  awards[0],
  awards[1],
  awards[2],
  awards[4],
];

const Awards = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mainRef.current) return;
    // Hero reveal
    gsap.from(mainRef.current.querySelector('.awards-hero'), {
      opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
    });
    // Stagger card reveals
    gsap.from(mainRef.current.querySelectorAll('.award-card'), {
      opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: {
        trigger: mainRef.current.querySelector('.awards-grid'),
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: mainRef });

  return (
    <>
      <Helmet>
        <title>Premios y Reconocimientos - Amanda Cruz González</title>
        <meta name="description" content="Una trayectoria avalada por terceros. Estándares auditados, resultados verificables y servicio ejecutivo." />
        <link rel="canonical" href="/premios" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Premios y Reconocimientos",
            "description": "Lista de premios y reconocimientos obtenidos",
            "itemListElement": orderedAwards.map((award, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://tudominio.com${award.link}`,
              "name": award.officialTitle
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen" ref={mainRef}>
        <WebGLShaderOceanLight className="pointer-events-none fixed inset-0 z-0" />

        <Header />

        <main className="pt-24">
          <section className="py-16 bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-6">
              <div className="awards-hero text-center max-w-4xl mx-auto">
                <h1 className="font-luxury text-4xl md:text-6xl text-primary mb-6">
                  Premios y
                  <span className="text-foreground"> Reconocimientos</span>
                </h1>
                <p className="font-elegant text-muted-foreground text-lg max-w-2xl mx-auto">
                  Una trayectoria avalada por terceros. Estándares auditados, resultados verificables y servicio ejecutivo.
                </p>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="awards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {orderedAwards.map((award, index) => (
                  <div key={award.slug} className="award-card">
                    <TiltCard className="h-full" intensity={8}>
                      <Link
                        to={award.link}
                        className="block h-full p-6 hover:scale-102 transition-all duration-300"
                        data-analytics="premios_index_card_click"
                        data-award={award.slug}
                      >
                        <div className="relative mb-6 rounded-lg overflow-hidden">
                          <img
                            src={award.thumbnail}
                            alt={`Premio ${award.title}`}
                            className="w-full h-48 object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        <Badge variant="secondary" className="mb-3 font-luxury">
                          {award.badge}
                        </Badge>
                        <h3 className="font-luxury text-xl text-primary mb-3 leading-tight">
                          {award.officialTitle}
                        </h3>
                        <p className="font-elegant text-muted-foreground text-sm leading-relaxed">
                          {award.description.split('.')[0]}.
                        </p>
                      </Link>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Awards;