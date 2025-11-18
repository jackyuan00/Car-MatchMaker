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
  prompt: `You are a Mercedes-Benz car expert. Based on the user's answers to the following questions, recommend a Mercedes-Benz model and explain your reasoning.\n\nAnswers: {{{answers}}}\n\nConsider these Mercedes-Benz models: A-Class, C-Class, E-Class, S-Class, CLA, CLS, GLA, GLC, GLE, GLS, G-Class, SL, AMG GT.
Pick one model. Explain in one sentence why the model is picked. Return the model and reason as JSON.`, // Added instructions for output format
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
