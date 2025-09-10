'use server';
/**
 * @fileOverview AI-powered insights on spending, highlighting over-budget categories and suggesting follow-up actions.
 *
 * - getSpendingInsightsAndPrompts - A function that generates insights and prompts for spending.
 * - SpendingInsightsInput - The input type for the getSpendingInsightsAndPrompts function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsightsAndPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightsInputSchema = z.object({
  spendingData: z.record(z.string(), z.number()).describe('Spending data for each category.'),
  budgetGoals: z.record(z.string(), z.number()).describe('Budget goals for each category.'),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('Insights on spending.'),
  prompts: z.array(z.object({
    category: z.string().describe('The category for the follow-up prompts.'),
    prompts: z.array(z.string()).describe('A list of follow-up prompts for the category.'),
  })).describe('Follow-up prompts for each relevant category.'),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsightsAndPrompts(input: SpendingInsightsInput): Promise<SpendingInsightsOutput> {
  return spendingInsightsAndPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingInsightsAndPromptsPrompt',
  input: {schema: SpendingInsightsInputSchema},
  output: {schema: SpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the provided spending data and budget goals to identify areas where the user is significantly over budget. Provide insights and suggest follow-up actions for each category.

Spending Data: {{{spendingData}}}
Budget Goals: {{{budgetGoals}}}`,
});

const spendingInsightsAndPromptsFlow = ai.defineFlow(
  {
    name: 'spendingInsightsAndPromptsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
