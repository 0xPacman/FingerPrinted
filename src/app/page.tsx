
import AppLayout from "@/components/layout/AppLayout";
import IpInfoCard from "@/components/features/data-probe/IpInfoCard";
import BrowserInfoCard from "@/components/features/data-probe/BrowserInfoCard";
import ScreenInfoCard from "@/components/features/data-probe/ScreenInfoCard";
import HardwareInfoCard from "@/components/features/data-probe/HardwareInfoCard";
import NetworkInfoCard from "@/components/features/data-probe/NetworkInfoCard";
import CookiesInfoCard from "@/components/features/data-probe/CookiesInfoCard";
import HttpHeadersInfoCard from "@/components/features/data-probe/HttpHeadersInfoCard";
import VpnDetectionClientCard from "@/components/features/data-probe/VpnDetectionClientCard";
import SensorDataClientCard from "@/components/features/data-probe/SensorDataClientCard";
import PrivacyConsiderationsCard from "@/components/features/data-probe/PrivacyConsiderationsCard";
import { headers } from "next/headers";

function getClientIp() {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || 
             headersList.get("x-real-ip") || 
             headersList.get("remote-addr") || // Fallback for direct connections or non-standard proxies
             "Not Found"; // Default if no IP found
  return ip;
}

function getHttpHeaders(): Record<string, string> {
  const headersList = headers();
  const httpHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    httpHeaders[key] = value;
  });
  return httpHeaders;
}

export default function DataProbePage() {
  const clientIp = getClientIp();
  const httpHeaders = getHttpHeaders();

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IpInfoCard ipAddress={clientIp} />
        <BrowserInfoCard />
        <ScreenInfoCard />
        <HardwareInfoCard />
        <NetworkInfoCard />
        <CookiesInfoCard />
        <VpnDetectionClientCard ipAddress={clientIp} httpHeaders={httpHeaders} />
        <SensorDataClientCard />
        <HttpHeadersInfoCard headers={httpHeaders} />
        <div className="md:col-span-2 lg:col-span-3">
         <PrivacyConsiderationsCard />
        </div>
      </div>
    </AppLayout>
  );
}
