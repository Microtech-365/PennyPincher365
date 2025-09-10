'use client';

import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

type CategorySpendingChartProps = {
  data: ChartData[];
};

export function CategorySpendingChart({ data }: CategorySpendingChartProps) {
    const chartConfig = data.reduce((acc, item) => {
        acc[item.name] = { label: item.name, color: item.fill };
        return acc;
    }, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>A breakdown of your spending across different categories.</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center justify-center'>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              verticalAlign="bottom"
              height={50}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
