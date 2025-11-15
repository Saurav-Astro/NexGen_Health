'use server';
/**
 * @fileOverview An AI agent to handle user symptom queries and provide health information.
 *
 * - aiSymptomQuery - A function that processes user symptom queries and returns relevant health information.
 */

import { ai } from '@/ai/genkit';
import {
  AISymptomQueryInputSchema,
  AISymptomQueryOutputSchema,
  type AISymptomQueryInput,
  type AISymptomQueryOutput,
} from './schemas';

const DISCLAIMER = "Disclaimer: I am an AI assistant and not a real medical professional. This information is not a substitute for professional medical advice. Please consult a doctor or qualified healthcare provider for any health concerns.";

export async function aiSymptomQuery(
  input: AISymptomQueryInput
): Promise<AISymptomQueryOutput> {
  const result = await aiSymptomQueryFlow(input);
  return {
    response: `${result.response}\n\n${DISCLAIMER}`
  };
}

const symptomQueryPrompt = ai.definePrompt({
    name: 'symptomQueryPrompt',
    input: { schema: AISymptomQueryInputSchema },
    output: { schema: AISymptomQueryOutputSchema },
    prompt: `You are a specialized AI health assistant. Your purpose is to provide helpful information and answer questions related to medical and mental health topics only. Your answers must be concise, brief, and to the point.

User Query: {{{query}}}`,
});

const aiSymptomQueryFlow = ai.defineFlow(
    {
        name: 'aiSymptomQueryFlow',
        inputSchema: AISymptomQueryInputSchema,
        outputSchema: AISymptomQueryOutputSchema,
    },
    async (input) => {
        const { output } = await symptomQueryPrompt(input);
        return output!;
    }
);
