'use client';

import { getSpendingInsightsAndPrompts } from '@/ai/flows/spending-insights-and-prompts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Mic, AlertTriangle } from 'lucide-react';
import React from 'react';
import { AIResponseDialog } from './ai-response-dialog';
import { getFollowUpResponse } from '@/ai/flows/follow-up-response';

type AIInsightsProps = {
  spendingData: Record<string, number>;
  budgetGoals: Record<string, number>;
};

export function AIInsights({ spendingData, budgetGoals }: AIInsightsProps) {
    const [result, setResult] = React.useState<{data: any, error?: string} | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [aiResponse, setAiResponse] = React.useState<string | null>(null);
    const [isResponseLoading, setIsResponseLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        getSpendingInsightsAndPrompts({
            spendingData,
            budgetGoals,
        }).then(response => {
            setResult(response);
            setIsLoading(false);
        });
    }, [spendingData, budgetGoals]);

    const handlePromptClick = async (prompt: string) => {
        setSelectedPrompt(prompt);
        setIsDialogOpen(true);
        setIsResponseLoading(true);
        const response = await getFollowUpResponse(prompt);
        setAiResponse(response);
        setIsResponseLoading(false);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-primary" />
                    AI-Powered Insights
                    </CardTitle>
                    <CardDescription>
                    Your personal finance assistant is analyzing your spending.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Loading insights...</p>
                </CardContent>
            </Card>
        );
    }
    
    if (!result?.data || result?.error) {
      let errorMessage = "Could not load AI-powered insights at this time. Please try again later.";
      if (result?.error) {
        if (result.error.includes("429 Too Many Requests")) {
          errorMessage = "You've exceeded the request limit for AI insights. Please wait a moment before trying again.";
        } else if (result.error.includes("503 Service Unavailable")) {
            errorMessage = "The AI service is currently overloaded. Please try again in a few moments."
        }
      }


      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Insights Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </CardContent>
        </Card>
      )
    }

    const { insights, prompts } = result.data;

    return (
      <>
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
                            <div 
                                key={index} 
                                className="flex items-center gap-2 text-sm p-2 bg-accent/10 rounded-md text-green-900 dark:text-green-200 cursor-pointer hover:bg-accent/20"
                                onClick={() => handlePromptClick(prompt)}
                            >
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
        <AIResponseDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            prompt={selectedPrompt}
            response={aiResponse}
            isLoading={isResponseLoading}
        />
      </>
    );
}
