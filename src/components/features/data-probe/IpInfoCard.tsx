
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Wifi, Building } from "lucide-react";
import { InfoCardItem } from "./InfoCardItem";
import { useEffect, useState } from "react";

interface IpInfoCardProps {
  ipAddress?: string;
}

interface IpDetails {
  isp?: string;
  city?: string;
  regionName?: string;
  country?: string;
  query?: string;
  status: "success" | "fail";
  message?: string;
}

export default function IpInfoCard({ ipAddress }: IpInfoCardProps) {
  const [ipDetails, setIpDetails] = useState<IpDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ipAddress && ipAddress !== "Not Found") {
      const fetchIpDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://ip-api.com/json/${ipAddress}?fields=status,message,country,regionName,city,isp,query`);
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          const data: IpDetails = await response.json();
          if (data.status === 'success') {
            setIpDetails(data);
          } else {
            throw new Error(data.message || "Failed to fetch IP details");
          }
        } catch (e: any) {
          console.error("Failed to fetch IP details:", e);
          setError(e.message || "Could not load IP geolocation data.");
          setIpDetails(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchIpDetails();
    } else if (ipAddress === "Not Found") {
      setError("IP address could not be determined.");
      setIpDetails(null);
      setIsLoading(false);
    }
  }, [ipAddress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          IP Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InfoCardItem label="Your IP Address" value={ipAddress || "Loading..."} />
        {isLoading && <p className="text-sm text-muted-foreground mt-2">Loading location details...</p>}
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        {ipDetails && ipDetails.status === 'success' && (
          <>
            <InfoCardItem
              label="Location"
              value={`${ipDetails.city || "N/A"}, ${ipDetails.regionName || "N/A"}, ${ipDetails.country || "N/A"}`}
              className="flex items-center"
            />
            <InfoCardItem
              label="ISP"
              value={ipDetails.isp || "N/A"}
              className="flex items-center"
            />
          </>
        )}
        {!isLoading && !error && !ipDetails && ipAddress && ipAddress !== "Not Found" && (
          <p className="text-xs text-muted-foreground mt-2">
            Detailed IP information will appear here.
          </p>
        )}
         <p className="text-xs text-muted-foreground mt-2">
          Your IP address can be used to approximate your geographical location and identify your Internet Service Provider. Location accuracy may vary.
        </p>
      </CardContent>
    </Card>
  );
}
