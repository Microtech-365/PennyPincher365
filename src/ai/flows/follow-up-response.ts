'use server';
/**
 * @fileOverview Generates a response to a follow-up financial question.
 *
 * - getFollowUpResponse - A function that generates a response to a follow-up question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


export async function getFollowUpResponse(promptText: string): Promise<string> {
    const response = await followUpResponseFlow(promptText);
    return response;
}

const followUpResponseFlow = ai.defineFlow(
  {
    name: 'followUpResponseFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
        prompt: `You are a personal finance advisor. Answer the following question: ${prompt}`,
        model: 'googleai/gemini-2.5-flash',
    });
    
    return llmResponse.text;
  }
);
