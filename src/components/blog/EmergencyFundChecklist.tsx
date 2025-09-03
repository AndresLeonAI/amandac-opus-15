import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckSquare } from 'lucide-react';

const checklistItems = [
  { id: 'expenses', text: 'Cifra de gastos esenciales clara' },
  { id: 'months', text: 'Meta de meses definida' },
  { id: 'account', text: 'Contenedor exclusivo creado' },
  { id: 'automation', text: 'Aportes automáticos activos' },
  { id: 'review', text: 'Próxima revisión agendada (90 días)' }
];

export const EmergencyFundChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('emergencyFundChecklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading checklist:', error);
      }
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem('emergencyFundChecklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleItemChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <Card className="glass-card border-border/20 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span className="font-luxury text-xl text-foreground">Checklist de implementación</span>
          </div>
          <div className="text-sm font-elegant text-muted-foreground">
            {completedCount}/{totalCount} completado
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="w-full bg-background/50 rounded-full h-2 mb-6">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => handleItemChange(item.id, checked as boolean)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor={item.id} 
                className={`font-elegant flex-1 cursor-pointer transition-all duration-200 ${
                  checkedItems[item.id] 
                    ? 'text-foreground/70 line-through' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.text}
              </Label>
            </div>
          ))}
        </div>

        {completedCount === totalCount && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="font-elegant text-primary text-center">
              ¡Felicitaciones! Has completado todos los pasos para implementar tu fondo de emergencia.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};