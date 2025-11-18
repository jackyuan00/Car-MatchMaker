'use server';
/**
 * @fileOverview This file defines a Genkit flow to recommend a Mercedes-Benz model based on user quiz answers.
 *
 * The flow takes user answers as input and returns a recommended car model with a reason.
 * - recommendMercedesModel - The main function to call to get a car recommendation.
 * - RecommendMercedesModelInput - The input type for the recommendMercedesModel function.
 * - RecommendMercedesModelOutput - The output type for the recommendMercedesModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMercedesModelInputSchema = z.object({
  answers: z.record(z.string(), z.string()).describe('A map of question IDs to user answers.'),
});
export type RecommendMercedesModelInput = z.infer<typeof RecommendMercedesModelInputSchema>;

const RecommendMercedesModelOutputSchema = z.object({
  model: z.string().describe('The recommended Mercedes-Benz model.'),
  reason: z.string().describe('The reasoning behind the recommendation.'),
});
export type RecommendMercedesModelOutput = z.infer<typeof RecommendMercedesModelOutputSchema>;

export async function recommendMercedesModel(input: RecommendMercedesModelInput): Promise<RecommendMercedesModelOutput> {
  return recommendMercedesModelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMercedesModelPrompt',
  input: {schema: RecommendMercedesModelInputSchema},
  output: {schema: RecommendMercedesModelOutputSchema},
  prompt: `You are a Mercedes-Benz car expert. Your task is to recommend a single Mercedes-Benz model based on the user's answers to a quiz.

You MUST choose one model from the following list:
- A-Class
- C-Class
- E-Class
- S-Class
- CLA
- CLS
- GLA
- GLC
- GLE
- GLS
- G-Class
- SL
- AMG GT

Analyze the user's answers carefully:
{{{answers}}}

Based on these answers, select the most suitable model from the provided list. Then, provide a concise, one-sentence explanation for your recommendation.

Return the result as a JSON object with the "model" and "reason" fields.`,
});

const recommendMercedesModelFlow = ai.defineFlow(
  {
    name: 'recommendMercedesModelFlow',
    inputSchema: RecommendMercedesModelInputSchema,
    outputSchema: RecommendMercedesModelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
