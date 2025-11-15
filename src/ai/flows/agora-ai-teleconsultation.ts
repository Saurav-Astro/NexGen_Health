
'use server';
/**
 * @fileOverview Implements the Agora AI teleconsultation flow with voice input and sentiment analysis.
 *
 * - agoraAITeleconsultation - A function that initiates the teleconsultation process.
 * - AgoraAITeleconsultationInput - The input type for the agoraAITeleconsultation function.
 * - AgoraAITeleconsultationOutput - The return type for the agoraAITeleconsultation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgoraAITeleconsultationInputSchema = z.object({
  voiceInput: z.string().describe('Voice input from the user during the teleconsultation.'),
  userContext: z.string().describe('Contextual information about the user, e.g., medical history.')
});
export type AgoraAITeleconsultationInput = z.infer<typeof AgoraAITeleconsultationInputSchema>;

const AgoraAITeleconsultationOutputSchema = z.object({
  sentimentAnalysis: z.string().describe('Sentiment analysis of the user input.'),
  consultationSummary: z.string().describe('Summary of the teleconsultation, including recommendations.'),
});
export type AgoraAITeleconsultationOutput = z.infer<typeof AgoraAITeleconsultationOutputSchema>;

export async function agoraAITeleconsultation(input: AgoraAITeleconsultationInput): Promise<AgoraAITeleconsultationOutput> {
  return agoraAITeleconsultationFlow(input);
}

const agoraAITeleconsultationPrompt = ai.definePrompt({
  name: 'agoraAITeleconsultationPrompt',
  input: {schema: AgoraAITeleconsultationInputSchema},
  output: {schema: AgoraAITeleconsultationOutputSchema},
  prompt: `You are an AI assistant facilitating a teleconsultation. Analyze the user's voice input for sentiment and provide a consultation summary.

User Context: {{{userContext}}}
Voice Input: {{{voiceInput}}}

Sentiment Analysis:
Consultation Summary:`,
});

const agoraAITeleconsultationFlow = ai.defineFlow(
  {
    name: 'agoraAITeleconsultationFlow',
    inputSchema: AgoraAITeleconsultationInputSchema,
    outputSchema: AgoraAITeleconsultationOutputSchema,
  },
  async input => {
    try {
      const {output} = await agoraAITeleconsultationPrompt(input);
      return output!;
    } catch (error) {
      console.error("Error in agoraAITeleconsultationFlow:", error);
      // Return a default/fallback object if the AI call fails
      return {
        sentimentAnalysis: 'Unavailable',
        consultationSummary: 'AI analysis could not be completed at this time.'
      };
    }
  }
);
