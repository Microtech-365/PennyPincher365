import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type OverviewCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
  className?: string;
};

export function OverviewCard({ title, value, icon, description, className }: OverviewCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className={cn("text-xs", className ? "text-gray-300" : "text-muted-foreground")}>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
