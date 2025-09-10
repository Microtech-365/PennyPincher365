'use client';

import { categories } from "@/lib/data";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { DollarSign, Wallet } from "lucide-react";
import { BudgetStatusChart } from "@/components/dashboard/budget-status-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { CategorySpendingChart } from "@/components/dashboard/category-spending-chart";
import { useUser } from "@/context/user-context";

const CHART_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
];

export default function Home() {
  const { transactions, budgets } = useUser();

  const totalSpending = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);

  const spendingPerCategory = categories.map(category => {
    const categorySpend = transactions
      .filter(t => t.categoryId === category.id)
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: category.name, spent: categorySpend };
  });

  const budgetChartData = categories.map(category => {
    const budget = budgets.find(b => b.categoryId === category.id)?.amount || 0;
    const spent = spendingPerCategory.find(s => s.name === category.name)?.spent || 0;
    return { name: category.name, spent, budget };
  });

  const categoryChartData = spendingPerCategory
    .filter(d => d.spent > 0)
    .map((d, index) => ({
      name: d.name,
      value: d.spent,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

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

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
              title="Total Spending"
              value={`$${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              description="Total for this month"
              icon={<DollarSign className="h-4 w-4 text-teal-200" />}
              className="bg-teal-950 text-white"
          />
          <OverviewCard
              title="Monthly Budget"
              value={`$${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              description={`${totalBudget > 0 && totalSpending > 0 ? ((totalSpending / totalBudget) * 100).toFixed(0) : 0}% of budget used`}
              icon={<Wallet className="h-4 w-4 text-purple-200" />}
              className="bg-purple-950 text-white"
          />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <BudgetStatusChart data={budgetChartData} />
        </div>
        <div className="col-span-3">
           <CategorySpendingChart data={categoryChartData} />
        </div>
        <div className="col-span-4">
           <RecentTransactions transactions={recentTransactions.slice(0,10)} categories={categories} showViewAll={true}/>
        </div>
         <div className="col-span-3">
             <AIInsights spendingData={spendingDataForAI} budgetGoals={budgetGoalsForAI} />
        </div>
      </div>
    </div>
  );
}
