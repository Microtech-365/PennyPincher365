import { Header } from "@/components/header";
import { categories, transactions, budgets } from "@/lib/data";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { DollarSign, Wallet } from "lucide-react";
import { BudgetStatusChart } from "@/components/dashboard/budget-status-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { CategorySpendingChart } from "@/components/dashboard/category-spending-chart";

const CHART_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
];

export default function Home() {
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
                title="Total Spending"
                value={`$${totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                description="Total for this month"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <OverviewCard
                title="Monthly Budget"
                value={`$${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                description={`${totalSpending > 0 ? ((totalSpending / totalBudget) * 100).toFixed(0) : 0}% of budget used`}
                icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <BudgetStatusChart data={budgetChartData} />
            <RecentTransactions transactions={recentTransactions} categories={categories} />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <AIInsights spendingData={spendingDataForAI} budgetGoals={budgetGoalsForAI} />
            <CategorySpendingChart data={categoryChartData} />
          </div>
        </div>
      </main>
    </div>
  );
}
