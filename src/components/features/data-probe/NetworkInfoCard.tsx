
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { InfoCardItem } from "./InfoCardItem";
import { Skeleton } from "@/components/ui/skeleton";

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
  };
  mozConnection?: NavigatorWithConnection["connection"];
  webkitConnection?: NavigatorWithConnection["connection"];
}

interface NetworkState {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

export default function NetworkInfoCard() {
  const [networkState, setNetworkState] = useState<NetworkState | null>(null);

  useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    const updateNetworkInfo = () => {
      if (connection) {
        setNetworkState({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          type: connection.type,
        });
      } else {
        setNetworkState({}); // Set to empty object if connection is not available
      }
    };

    updateNetworkInfo(); // Initial call
    
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wifi className="mr-2 h-5 w-5 text-primary" />
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {networkState ? (
          <>
            <InfoCardItem label="Connection Type" value={networkState.type?.toUpperCase()} />
            <InfoCardItem label="Effective Type" value={networkState.effectiveType} />
            <InfoCardItem label="Downlink Speed (Mbps approx.)" value={networkState.downlink} />
            <InfoCardItem label="Round Trip Time (ms)" value={networkState.rtt} />
            <InfoCardItem label="Data Saver Mode" value={networkState.saveData === undefined ? "N/A" : networkState.saveData ? "Enabled" : "Disabled"} />
          </>
        ) : (
           <div className="space-y-3">
            <InfoCardItem label="Connection Type" value={<Skeleton className="h-4 w-1/3" />} />
            <InfoCardItem label="Effective Type" value={<Skeleton className="h-4 w-1/4" />} />
            <InfoCardItem label="Downlink Speed (Mbps approx.)" value={<Skeleton className="h-4 w-1/2" />} />
            <InfoCardItem label="Round Trip Time (ms)" value={<Skeleton className="h-4 w-1/3" />} />
            <InfoCardItem label="Data Saver Mode" value={<Skeleton className="h-4 w-1/4" />} />
          </div>
        )}
         <p className="text-xs text-muted-foreground mt-2">
          Network information accuracy can vary. Some values may not be available in all browsers.
        </p>
      </CardContent>
    </Card>
  );
}
