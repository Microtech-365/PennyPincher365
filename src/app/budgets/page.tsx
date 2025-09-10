'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/user-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Budget } from '@/lib/types';
import { CategoryIcon } from '@/components/category-icon';

export default function BudgetsPage() {
  const { budgets, updateBudgets, categories } = useUser();
  const [localBudgets, setLocalBudgets] = useState<Budget[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Ensure there's a budget entry for every category
    const allBudgets = categories.map(category => {
        const existingBudget = budgets.find(b => b.categoryId === category.id);
        return existingBudget || { categoryId: category.id, amount: 0 };
    });
    setLocalBudgets(allBudgets);
  }, [budgets, categories]);

  const handleBudgetChange = (categoryId: string, amount: string) => {
    const newAmount = parseFloat(amount) || 0;
    setLocalBudgets(prevBudgets => {
      const existingBudget = prevBudgets.find(b => b.categoryId === categoryId);
      if (existingBudget) {
        return prevBudgets.map(b =>
          b.categoryId === categoryId ? { ...b, amount: newAmount } : b
        );
      }
      return [...prevBudgets, { categoryId, amount: newAmount }];
    });
  };
  
  const handleSave = () => {
    updateBudgets(localBudgets);
    toast({
      title: "Budgets Saved",
      description: "Your new budget allocations have been saved successfully.",
    });
  };

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">Set and manage your monthly budget goals.</p>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>Allocate your desired budget for each spending category.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => {
            const budget = localBudgets.find(b => b.categoryId === category.id);
            return (
              <div key={category.id} className="space-y-2">
                <Label htmlFor={`budget-${category.id}`} className="flex items-center gap-2">
                    <CategoryIcon name={category.name} className="h-5 w-5" />
                    <span className="text-lg font-medium">{category.name}</span>
                </Label>
                <div className="flex items-center">
                    <span className="text-xl p-2 text-muted-foreground">$</span>
                    <Input
                        id={`budget-${category.id}`}
                        type="number"
                        placeholder="0.00"
                        value={budget?.amount || ''}
                        onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                        className="text-lg"
                    />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
