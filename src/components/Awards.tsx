import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { products } from "@/data/awards";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Awards = () => {
  return (
    <section id="premios" className="relative bg-background">
      <HeroParallax products={products} />
      
      {/* CTA Section */}
      <div className="relative z-10 -mt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <Button 
            asChild
            variant="premium"
            size="lg"
            className="px-8 py-6 text-lg font-elegant tracking-wide hover:scale-102 transition-all duration-200 group"
          >
            <Link to="/premios" data-analytics="premios_cta_click">
              <span>Ver todos los premios</span>
              <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Awards;