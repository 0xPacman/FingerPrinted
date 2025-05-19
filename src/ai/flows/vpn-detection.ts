// src/ai/flows/vpn-detection.ts
'use server';

/**
 * @fileOverview This file contains a Genkit flow for detecting if a user is using a VPN.
 *
 * - detectVpn - A function that uses AI to determine if a user is using a VPN.
 * - VpnDetectionInput - The input type for the detectVpn function.
 * - VpnDetectionOutput - The return type for the detectVpn function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VpnDetectionInputSchema = z.object({
  ipAddress: z
    .string()
    .describe('The IP address of the user.'),
  httpHeaders: z.record(z.string()).describe('HTTP headers from the request.'),
});
export type VpnDetectionInput = z.infer<typeof VpnDetectionInputSchema>;

const VpnDetectionOutputSchema = z.object({
  isVpn: z.boolean().describe('Whether or not the user is using a VPN.'),
  confidence: z.number().describe('A confidence score (0-1) for the VPN detection.'),
  reason: z.string().describe('The reason why the AI thinks the user is or is not using a VPN.'),
});
export type VpnDetectionOutput = z.infer<typeof VpnDetectionOutputSchema>;

export async function detectVpn(input: VpnDetectionInput): Promise<VpnDetectionOutput> {
  return detectVpnFlow(input);
}

const detectVpnPrompt = ai.definePrompt({
  name: 'detectVpnPrompt',
  input: {schema: VpnDetectionInputSchema},
  output: {schema: VpnDetectionOutputSchema},
  prompt: `You are an AI expert in detecting VPN usage.

You are given the user's IP address and HTTP headers.  Analyze this information to determine if the user is likely using a VPN.

IP Address: {{{ipAddress}}}
HTTP Headers: {{JSON.stringify httpHeaders}}

Based on this information, determine if the user is using a VPN.

Return a boolean value for isVpn. Also return a confidence score between 0 and 1, and a brief explanation for your reasoning.

Consider these factors:

*   IP address reputation: Is the IP address associated with known VPN providers?
*   Header analysis: Do the headers indicate VPN usage (e.g., missing headers, unusual configurations)?
*   Inconsistencies: Are there inconsistencies between the IP address location and the user's stated location (from headers)?
`,
});

const detectVpnFlow = ai.defineFlow(
  {
    name: 'detectVpnFlow',
    inputSchema: VpnDetectionInputSchema,
    outputSchema: VpnDetectionOutputSchema,
  },
  async input => {
    const {output} = await detectVpnPrompt(input);
    return output!;
  }
);
