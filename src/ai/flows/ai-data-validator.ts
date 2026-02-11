'use server';

/**
 * @fileOverview This file defines a Genkit flow for AI-powered data validation.
 *
 * - validateData - A function that validates input data using AI.
 * - ValidateDataInput - The input type for the validateData function.
 * - ValidateDataOutput - The return type for the validateData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateDataInputSchema = z.object({
  recordType: z.enum(['student', 'teacher']).describe('The type of record being validated.'),
  existingData: z.record(z.any()).optional().describe('The existing data for the record, if any.'),
  newData: z.record(z.any()).describe('The new data to be validated.'),
});
export type ValidateDataInput = z.infer<typeof ValidateDataInputSchema>;

const ValidateDataOutputSchema = z.object({
  suggestions: z.record(z.string()).describe('A map of field names to suggested corrections.'),
  anomalies: z.array(z.string()).describe('A list of detected anomalies in the data.'),
});
export type ValidateDataOutput = z.infer<typeof ValidateDataOutputSchema>;

export async function validateData(input: ValidateDataInput): Promise<ValidateDataOutput> {
  return validateDataFlow(input);
}

const validateDataPrompt = ai.definePrompt({
  name: 'validateDataPrompt',
  input: {schema: ValidateDataInputSchema},
  output: {schema: ValidateDataOutputSchema},
  prompt: `You are an AI data validator. Your task is to identify anomalies and suggest corrections in student or teacher records.

  Record Type: {{recordType}}

  {{#if existingData}}
  Existing Data: {{json existingData}}
  {{/if}}

  New Data: {{json newData}}

  Analyze the new data, compare it with the existing data if available, and provide suggestions for corrections and list any detected anomalies.

  Respond with a JSON object containing "suggestions" (a map of field names to suggested corrections) and "anomalies" (a list of detected anomalies).`,
});

const validateDataFlow = ai.defineFlow(
  {
    name: 'validateDataFlow',
    inputSchema: ValidateDataInputSchema,
    outputSchema: ValidateDataOutputSchema,
  },
  async input => {
    const {output} = await validateDataPrompt(input);
    return output!;
  }
);
