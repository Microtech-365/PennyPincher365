'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';

type ChartData = {
  name: string;
  spent: number;
  budget: number;
};

type BudgetStatusChartProps = {
  data: ChartData[];
};

export function BudgetStatusChart({ data }: BudgetStatusChartProps) {
  const chartConfig = {
    spent: {
      label: "Spent",
      color: "hsl(var(--secondary-foreground))",
    },
    budget: {
      label: "Budget",
      color: "hsl(var(--primary))",
    },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Spending</CardTitle>
        <CardDescription>A comparison of your spending against your budget for each category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend />
                <Bar dataKey="spent" fill="var(--color-spent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
