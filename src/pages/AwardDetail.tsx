import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { awards } from "@/data/awards";
import { TiltCard } from "@/components/TiltCard";
import { Helmet } from "react-helmet-async";

const AwardDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const award = awards.find(a => a.slug === slug);

  if (!award) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{award.officialTitle} – Amanda Cruz González</title>
        <meta name="description" content={award.description.substring(0, 160)} />
        <link rel="canonical" href={award.link} />
        <meta property="og:title" content={award.officialTitle} />
        <meta property="og:description" content={award.description.substring(0, 200)} />
        <meta property="og:image" content={award.thumbnail} />
        <meta property="og:url" content={`https://tudominio.com${award.link}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": award.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://tudominio.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Premios",
                "item": "https://tudominio.com/premios"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": award.officialTitle,
                "item": `https://tudominio.com${award.link}`
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24">
          {/* Breadcrumb */}
          <section className="py-6 border-b border-border/20">
            <div className="container mx-auto px-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Inicio</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/premios">Premios</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{award.officialTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </section>

          {/* Hero Section */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <TiltCard intensity={12}>
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={award.thumbnail}
                        alt={`Premio ${award.title}`}
                        className="w-full h-96 object-cover"
                        loading="eager"
                      />
                    </div>
                  </TiltCard>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <Badge variant="secondary" className="font-luxury text-sm">
                    {award.badge}
                  </Badge>

                  <h1 className="font-luxury text-3xl md:text-4xl text-primary leading-tight">
                    {award.officialTitle}
                  </h1>

                  <p className="font-elegant text-muted-foreground text-lg leading-relaxed">
                    {award.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="py-16 bg-background/50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center mb-12"
                >
                  <h2 className="font-luxury text-2xl md:text-3xl text-primary mb-4">
                    Preguntas Frecuentes
                  </h2>
                  <p className="font-elegant text-muted-foreground">
                    Todo lo que necesitas saber sobre este reconocimiento
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Accordion type="single" collapsible className="space-y-4">
                    {award.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`}
                        className="border border-border/20 rounded-lg px-6 bg-card/30 backdrop-blur-sm"
                      >
                        <AccordionTrigger className="font-luxury text-lg text-primary hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="font-elegant text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/premios">
                    Ver todos los premios
                  </Link>
                </Button>
                
                {award.organization === "UFC" && (
                  <Button 
                    asChild 
                    variant="premium" 
                    size="lg" 
                    className="w-full sm:w-auto group"
                  >
                    <a 
                      href="https://www.unitedfinconsultants.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-analytics="premios_detail_external_link_click"
                      data-award={award.slug}
                    >
                      Ver organismo otorgante
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AwardDetail;