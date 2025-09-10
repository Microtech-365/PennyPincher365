import { Dashboard } from "@/components/dashboard/dashboard";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return <Dashboard>
      {(spendingData, budgetGoals) => (
          <Suspense fallback={<Skeleton className="h-[430px]" />}>
            <AIInsights spendingData={spendingData} budgetGoals={budgetGoals} />
          </Suspense>
      )}
  </Dashboard>;
}
