import { z } from 'genkit';

export const AISymptomQueryInputSchema = z.object({
  query: z
    .string()
    .describe('The user query describing their symptoms or health concerns.'),
});
export type AISymptomQueryInput = z.infer<typeof AISymptomQueryInputSchema>;

export const AISymptomQueryOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The AI response providing health information or advice. The answer should be concise and to the point.'
    ),
});
export type AISymptomQueryOutput = z.infer<typeof AISymptomQueryOutputSchema>;
