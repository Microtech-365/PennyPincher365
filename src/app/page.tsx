
import { Dashboard } from "@/components/dashboard/dashboard";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  // This page is now a Server Component.
  // We can't use client-side hooks like useUser() here directly.
  // The data logic will be handled inside the Dashboard client component.
  // For AIInsights, we'll pass it as a child to the Dashboard.
  
  // Note: Since we can't get user-specific data here on the server
  // without a proper server-side session, AIInsights might show insights
  // on empty data if no user is logged in. The data fetching for it
  // is now inside the Dashboard component.
  
  return (
    <Dashboard>
      <Suspense fallback={<Skeleton className="h-[430px]" />}>
        {/* The Dashboard component will now fetch the data and pass it to AIInsights */}
        {/* This is a placeholder as the real data fetching is in Dashboard */}
        <AIInsights spendingData={{}} budgetGoals={{}} />
      </Suspense>
    </Dashboard>
  );
}
