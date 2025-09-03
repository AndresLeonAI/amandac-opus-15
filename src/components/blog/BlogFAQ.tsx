import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  items: FAQItem[];
  title?: string;
}

export const BlogFAQ = ({ items, title = "Preguntas frecuentes" }: BlogFAQProps) => {
  return (
    <Card className="glass-card border-border/20 mb-8">
      <CardContent className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-luxury text-xl text-foreground">{title}</h3>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/20">
              <AccordionTrigger className="text-left font-elegant text-foreground hover:text-primary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-elegant text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};