
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { InfoCardItem } from "./InfoCardItem";
import { Skeleton } from "@/components/ui/skeleton";

interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
  doNotTrack: string;
  vendor: string;
}

export default function BrowserInfoCard() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    setBrowserInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      doNotTrack: navigator.doNotTrack === "1" ? "Enabled" : navigator.doNotTrack === "0" ? "Disabled" : "Unspecified",
      vendor: navigator.vendor,
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5 text-primary" />
          Browser & OS
        </CardTitle>
      </CardHeader>
      <CardContent>
        {browserInfo ? (
          <>
            <InfoCardItem label="User Agent" value={browserInfo.userAgent} />
            <InfoCardItem label="Operating System" value={browserInfo.platform} />
            <InfoCardItem label="Preferred Language" value={browserInfo.language} />
            <InfoCardItem label="Vendor" value={browserInfo.vendor} />
            <InfoCardItem
              label="Cookies Enabled"
              value={browserInfo.cookiesEnabled ? "Yes" : "No"}
            />
            <InfoCardItem
              label="Online Status"
              value={browserInfo.onlineStatus ? "Online" : "Offline"}
            />
            <InfoCardItem
              label="Do Not Track"
              value={browserInfo.doNotTrack}
            />
          </>
        ) : (
          <div className="space-y-3">
            <InfoCardItem label="User Agent" value={<Skeleton className="h-4 w-3/4" />} />
            <InfoCardItem label="Operating System" value={<Skeleton className="h-4 w-1/2" />} />
            <InfoCardItem label="Preferred Language" value={<Skeleton className="h-4 w-1/4" />} />
            <InfoCardItem label="Vendor" value={<Skeleton className="h-4 w-1/3" />} />
            <InfoCardItem label="Cookies Enabled" value={<Skeleton className="h-4 w-1/6" />} />
            <InfoCardItem label="Online Status" value={<Skeleton className="h-4 w-1/6" />} />
            <InfoCardItem label="Do Not Track" value={<Skeleton className="h-4 w-1/4" />} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
