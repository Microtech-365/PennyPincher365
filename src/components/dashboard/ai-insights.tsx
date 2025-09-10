import { getSpendingInsightsAndPrompts } from '@/ai/flows/spending-insights-and-prompts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Mic } from 'lucide-react';

type AIInsightsProps = {
  spendingData: Record<string, number>;
  budgetGoals: Record<string, number>;
};

export async function AIInsights({ spendingData, budgetGoals }: AIInsightsProps) {
  try {
    const { insights, prompts } = await getSpendingInsightsAndPrompts({
      spendingData,
      budgetGoals,
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Your personal finance assistant has analyzed your spending.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Spending Summary</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Suggested Actions</h3>
            <div className="space-y-2">
              {prompts.map(({ category, prompts: categoryPrompts }) => (
                  categoryPrompts.length > 0 && (
                  <div key={category}>
                      <h4 className="text-sm font-medium mb-1">{category}</h4>
                      <div className="space-y-1">
                      {categoryPrompts.map((prompt, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm p-2 bg-accent/10 rounded-md text-green-900 dark:text-green-200 cursor-pointer hover:bg-accent/20">
                              <Mic className="h-4 w-4 shrink-0 text-accent" />
                              <span>{prompt}</span>
                          </div>
                      ))}
                      </div>
                  </div>
                  )
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-destructive" />
            Insights Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Could not load AI-powered insights at this time. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }
}
