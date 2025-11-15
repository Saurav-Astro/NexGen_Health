'use server';

/**
 * @fileOverview This file implements the Genkit flow for analyzing health data and identifying trends.
 *
 * It includes:
 * - healthTrendAnalysis: A function that takes health data as input and returns a trend analysis.
 * - HealthTrendAnalysisInput: The input type for the healthTrendAnalysis function.
 * - HealthTrendAnalysisOutput: The return type for the healthTrendAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthTrendAnalysisInputSchema = z.object({
  healthData: z
    .string()
    .describe("A stringified JSON array containing health data records. Each record should have a timestamp and health metrics (e.g., heart rate, blood pressure)."),
  userDescription: z.string().optional().describe("Additional information about the user's health history or concerns."),
});
export type HealthTrendAnalysisInput = z.infer<typeof HealthTrendAnalysisInputSchema>;

const HealthTrendAnalysisOutputSchema = z.object({
  trendSummary: z.string().describe('A summary of the identified health trends.'),
  anomalies: z.string().describe('A description of any anomalies detected in the health data.'),
  recommendations: z.string().describe('Recommendations based on the trend analysis and anomalies.'),
});
export type HealthTrendAnalysisOutput = z.infer<typeof HealthTrendAnalysisOutputSchema>;

export async function healthTrendAnalysis(input: HealthTrendAnalysisInput): Promise<HealthTrendAnalysisOutput> {
  return healthTrendAnalysisFlow(input);
}

const healthTrendAnalysisPrompt = ai.definePrompt({
  name: 'healthTrendAnalysisPrompt',
  input: {schema: HealthTrendAnalysisInputSchema},
  output: {schema: HealthTrendAnalysisOutputSchema},
  prompt: `You are an AI health analyst. Analyze the provided health data to identify trends, anomalies, and provide recommendations.

Health Data: {{{healthData}}}
User Description: {{{userDescription}}}

Analyze the health data, looking for patterns, anomalies, and potential health risks. Provide a summary of the trends, a description of any anomalies, and recommendations for the user.

Ensure that the output follows the schema, with trendSummary, anomalies, and recommendations fields populated with relevant information.
`,
});

const healthTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'healthTrendAnalysisFlow',
    inputSchema: HealthTrendAnalysisInputSchema,
    outputSchema: HealthTrendAnalysisOutputSchema,
  },
  async input => {
    const {output} = await healthTrendAnalysisPrompt(input);
    return output!;
  }
);
