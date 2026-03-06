import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Play, Video } from 'lucide-react';
import { useScrollToBooking } from '@/hooks/useScrollToBooking';

interface BlogCTAProps {
  title: string;
  description: string;
  buttonText: string;
}

export const BlogCTA = ({ title, description, buttonText }: BlogCTAProps) => {
  const scrollToBooking = useScrollToBooking();

  return (
    <Card className="glass-card border-primary/20 bg-primary/5 mb-8">
      <CardContent className="p-8 text-center">
        <h3 className="font-luxury text-2xl text-primary mb-4">
          {title}
        </h3>
        <p className="font-elegant text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            variant="premium"
            size="lg"
            className="w-full sm:w-auto px-8 group font-luxury tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500"
            onClick={scrollToBooking}
          >
            Agendar Consulta Privada
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};