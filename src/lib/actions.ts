
"use server";

import { detectVpn, type VpnDetectionInput, type VpnDetectionOutput } from "@/ai/flows/vpn-detection";

export async function detectVpnAction(
  ipAddress: string,
  httpHeaders: Record<string, string>
): Promise<VpnDetectionOutput | { error: string }> {
  if (!ipAddress) {
    return { error: "IP address is required for VPN detection." };
  }

  try {
    const input: VpnDetectionInput = {
      ipAddress,
      httpHeaders,
    };
    const result = await detectVpn(input);
    return result;
  } catch (error) {
    console.error("VPN detection error:", error);
    return { error: "Failed to perform VPN detection." };
  }
}
