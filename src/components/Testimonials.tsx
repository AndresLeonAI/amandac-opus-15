import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlareCard } from '@/components/ui/glare-card';

const testimonials = [
  {
    name: '[Nombre Cliente]',
    title: '[Cargo/Empresa]',
    content: '[Testimonio sobre la calidad excepcional del servicio y los resultados obtenidos]',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: '[Nombre Cliente]',
    title: '[Cargo/Empresa]',
    content: '[Testimonio sobre la confianza y profesionalismo en la gestión patrimonial]',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: '[Nombre Cliente]',
    title: '[Cargo/Empresa]',
    content: '[Testimonio sobre estrategias personalizadas y atención exclusiva recibida]',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonios" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-luxury text-4xl md:text-5xl text-primary mb-6">
            Confianza
            <span className="text-foreground"> comprobada</span>
          </h2>
          <p className="font-elegant text-muted-foreground text-lg max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es el reflejo de nuestro compromiso con la excelencia.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-silk"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <GlareCard className="p-12 mx-4">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-8">
                      <Quote className="w-12 h-12 text-primary/30" />
                    </div>

                    {/* Content */}
                    <blockquote className="font-elegant text-xl md:text-2xl text-foreground text-center leading-relaxed mb-8">
                      {testimonial.content}
                    </blockquote>

                    {/* Rating */}
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-primary fill-current" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-center space-x-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="text-center">
                        <div className="font-elegant text-foreground font-medium">
                          {testimonial.name}
                        </div>
                        <div className="font-luxury text-primary/80 text-sm">
                          {testimonial.title}
                        </div>
                      </div>
                    </div>
                  </GlareCard>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-border/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-border/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-foreground/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;