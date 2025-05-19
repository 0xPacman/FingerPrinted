
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import { InfoCardItem } from "./InfoCardItem";
import { Skeleton } from "@/components/ui/skeleton";

interface HardwareInfo {
  cpuCores?: number;
  deviceMemory?: number;
  maxTouchPoints?: number;
}

export default function HardwareInfoCard() {
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);

  useEffect(() => {
    // Ensure navigator properties are accessed only on the client side
    const memory = (navigator as any).deviceMemory; // Keep as any for broader compatibility
    setHardwareInfo({
      cpuCores: navigator.hardwareConcurrency,
      deviceMemory: typeof memory === 'number' ? memory : undefined,
      maxTouchPoints: navigator.maxTouchPoints,
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" />
          Hardware Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hardwareInfo ? (
          <>
            <InfoCardItem label="CPU Cores" value={hardwareInfo.cpuCores} />
            <InfoCardItem label="Device Memory (approx.)" value={hardwareInfo.deviceMemory ? `${hardwareInfo.deviceMemory} GB` : "N/A"} />
            <InfoCardItem label="Max Touch Points" value={hardwareInfo.maxTouchPoints} />
          </>
        ) : (
          <div className="space-y-3">
            <InfoCardItem label="CPU Cores" value={<Skeleton className="h-4 w-1/4" />} />
            <InfoCardItem label="Device Memory (approx.)" value={<Skeleton className="h-4 w-1/2" />} />
            <InfoCardItem label="Max Touch Points" value={<Skeleton className="h-4 w-1/3" />} />
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Detailed hardware information is limited for privacy and security reasons.
        </p>
      </CardContent>
    </Card>
  );
}
