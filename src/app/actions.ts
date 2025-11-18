'use server';

import { recommendMercedesModel, type RecommendMercedesModelInput } from '@/ai/flows/recommend-mercedes-model';
import type { Recommendation } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function isValidModel(model: string): boolean {
    return PlaceHolderImages.some(img => img.id === model);
}

export async function getRecommendation(answers: Record<string, string>): Promise<Recommendation> {
  console.log("Getting recommendation for answers:", answers);
  try {
    const input: RecommendMercedesModelInput = { answers };
    const result = await recommendMercedesModel(input);

    // Sanitize the model name from the AI response
    const sanitizedModel = result.model.replace('.', '');

    // Check if the recommended model is in our list of known models
    if (isValidModel(sanitizedModel)) {
      return {
        model: sanitizedModel,
        reason: result.reason,
      };
    } else {
        // If the model is not found, return a fallback with a helpful message.
        console.warn(`AI recommended an unknown model: "${result.model}". Falling back to C-Class.`);
        return {
            model: 'C-Class',
            reason: `While we couldn't match the specific recommendation, the C-Class is a versatile choice that blends luxury and performance, which may suit your tastes.`,
        };
    }
  } catch (error) {
    console.error('Error getting recommendation:', error);
    return {
      model: 'C-Class',
      reason: 'A versatile and popular choice for a refined driving experience. We encountered an issue generating your custom recommendation.',
      error: 'Failed to get a recommendation from the AI.'
    };
  }
}
