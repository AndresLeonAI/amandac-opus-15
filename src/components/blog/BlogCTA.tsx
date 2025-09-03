import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BlogCTAProps {
  title: string;
  description: string;
  buttonText: string;
  whatsappMessage: string;
}

export const BlogCTA = ({ title, description, buttonText, whatsappMessage }: BlogCTAProps) => {
  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/573114688067?text=${encodedMessage}`, '_blank');
  };

  return (
    <Card className="glass-card border-primary/20 bg-primary/5 mb-8">
      <CardContent className="p-8 text-center">
        <h3 className="font-luxury text-2xl text-primary mb-4">
          {title}
        </h3>
        <p className="font-elegant text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
          {description}
        </p>
        <Button 
          onClick={handleWhatsApp}
          size="lg"
          className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg shadow-elegant hover:shadow-glow transition-all duration-300 group hover:scale-102"
        >
          <span className="font-elegant">{buttonText}</span>
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  );
};