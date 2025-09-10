'use client';

import { Dashboard } from "@/components/dashboard/dashboard";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/user-context";
import { categories } from "@/lib/data";

export default function HomePage() {
  const { transactions, budgets } = useUser();

  // This logic is now on the client-side to be passed to AIInsights
  const spendingPerCategory = categories.map(category => {
    const categorySpend = transactions
      .filter(t => t.categoryId === category.id)
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: category.name, spent: categorySpend };
  });
  
  const spendingDataForAI = spendingPerCategory.reduce((acc, item) => {
    acc[item.name] = item.spent;
    return acc;
  }, {} as Record<string, number>);

  const budgetGoalsForAI = budgets.reduce((acc, item) => {
    const categoryName = categories.find(c => c.id === item.categoryId)?.name;
    if (categoryName) {
      acc[categoryName] = item.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dashboard>
      <Suspense fallback={<Skeleton className="h-[430px]" />}>
        <AIInsights spendingData={spendingDataForAI} budgetGoals={budgetGoalsForAI} />
      </Suspense>
    </Dashboard>
  );
}
