import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[109px]" />
          <Skeleton className="h-[109px]" />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Skeleton className="h-[410px]" />
            <Skeleton className="h-[430px]" />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Skeleton className="h-[500px]" />
            <Skeleton className="h-[380px]" />
          </div>
        </div>
      </main>
    </div>
  );
}
