import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

export const EmergencyFundCalculator = () => {
  const [expenses, setExpenses] = useState<string>('');
  const [months, setMonths] = useState<string>('4');
  const [result, setResult] = useState<{
    total: number;
    milestone30: number;
    milestone60: number;
    milestone100: number;
  } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('emergencyFundCalc');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setExpenses(data.expenses || '');
        setMonths(data.months || '4');
      } catch (error) {
        console.error('Error loading saved calculation:', error);
      }
    }
  }, []);

  // Save to localStorage and calculate when values change
  useEffect(() => {
    if (expenses && months) {
      localStorage.setItem('emergencyFundCalc', JSON.stringify({ expenses, months }));
      
      const expensesNum = parseFloat(expenses.replace(/[^0-9.]/g, ''));
      const monthsNum = parseFloat(months);
      
      if (!isNaN(expensesNum) && !isNaN(monthsNum) && expensesNum > 0 && monthsNum > 0) {
        const total = expensesNum * monthsNum;
        setResult({
          total,
          milestone30: total * 0.3,
          milestone60: total * 0.6,
          milestone100: total
        });
      } else {
        setResult(null);
      }
    }
  }, [expenses, months]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="glass-card border-border/20 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="font-luxury text-xl text-foreground">Mini calculadora de fondo de emergencia</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="expenses" className="font-elegant text-foreground">
              Gastos esenciales mensuales (COP)
            </Label>
            <Input
              id="expenses"
              type="text"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              placeholder="1,600,000"
              className="font-elegant"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="months" className="font-elegant text-foreground">
              Meses objetivo
            </Label>
            <Input
              id="months"
              type="number"
              min="3"
              max="12"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="font-elegant"
            />
          </div>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-luxury text-lg text-primary mb-4">Resultado del cálculo</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-elegant text-foreground">Meta total:</span>
                <span className="font-elegant text-xl font-semibold text-primary">
                  {formatCurrency(result.total)}
                </span>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-primary/20">
                <h5 className="font-elegant text-sm font-medium text-foreground mb-2">Hitos de progreso:</h5>
                <div className="flex justify-between">
                  <span className="font-elegant text-sm text-muted-foreground">30% (básico):</span>
                  <span className="font-elegant text-sm text-foreground">{formatCurrency(result.milestone30)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-elegant text-sm text-muted-foreground">60% (intermedio):</span>
                  <span className="font-elegant text-sm text-foreground">{formatCurrency(result.milestone60)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-elegant text-sm text-muted-foreground">100% (ideal):</span>
                  <span className="font-elegant text-sm font-semibold text-primary">{formatCurrency(result.milestone100)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};