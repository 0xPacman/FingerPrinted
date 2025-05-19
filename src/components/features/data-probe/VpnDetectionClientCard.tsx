
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { detectVpnAction } from "@/lib/actions";
import type { VpnDetectionOutput } from "@/ai/flows/vpn-detection";
import { InfoCardItem } from "./InfoCardItem";
import { useToast } from "@/hooks/use-toast";

interface VpnDetectionClientCardProps {
  ipAddress?: string;
  httpHeaders: Record<string, string>;
}

export default function VpnDetectionClientCard({ ipAddress, httpHeaders }: VpnDetectionClientCardProps) {
  const [vpnResult, setVpnResult] = useState<VpnDetectionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleVpnCheck = () => {
    if (!ipAddress) {
      toast({
        title: "Error",
        description: "IP address not available for VPN check.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      setError(null);
      setVpnResult(null);
      const result = await detectVpnAction(ipAddress, httpHeaders);
      if ("error" in result) {
        setError(result.error);
        toast({
          title: "VPN Detection Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setVpnResult(result);
         toast({
          title: "VPN Detection Complete",
          description: result.isVpn ? "VPN detected." : "VPN not detected.",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          VPN Detection
        </CardTitle>
        <CardDescription>
          Check if your connection appears to be using a VPN (Powered by AI).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleVpnCheck} disabled={isPending || !ipAddress} className="mb-4 w-full sm:w-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check VPN Status"
          )}
        </Button>
        {!ipAddress && <p className="text-sm text-destructive">IP address not available for check.</p>}
        
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/50 rounded-md text-destructive">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {vpnResult && (
          <div className="mt-4 space-y-2">
            <InfoCardItem label="Using VPN" value={vpnResult.isVpn ? "Yes" : "No"} />
            <InfoCardItem label="Confidence" value={`${(vpnResult.confidence * 100).toFixed(0)}%`} />
            <InfoCardItem label="Reason" value={vpnResult.reason} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
