
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { InfoCardItem } from "./InfoCardItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ScreenInfo {
  resolution: string;
  availableResolution: string;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  orientation: string;
}

export default function ScreenInfoCard() {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo | null>(null);
  // Initialize currentOrientation to null or a placeholder to avoid hydration mismatch
  const [currentOrientation, setCurrentOrientation] = useState<string | null>(null);

  useEffect(() => {
    const updateScreenInfo = () => {
      if (typeof window !== "undefined" && typeof window.screen !== "undefined") {
        const orientationType = window.screen.orientation?.type || "N/A";
        setScreenInfo({
          resolution: `${window.screen.width} x ${window.screen.height}`,
          availableResolution: `${window.screen.availWidth} x ${window.screen.availHeight}`,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth,
          devicePixelRatio: window.devicePixelRatio,
          orientation: orientationType,
        });
        setCurrentOrientation(orientationType);
      }
    };

    updateScreenInfo(); // Initial call

    const handleOrientationChange = () => {
      if (typeof window !== "undefined" && typeof window.screen !== "undefined") {
         const orientationType = window.screen.orientation?.type || "N/A";
        setCurrentOrientation(orientationType);
        updateScreenInfo(); // Update all info on orientation change
      }
    };
    
    let orientationApiAvailable = false;
    let mediaQuery: MediaQueryList | undefined;
    let fallbackListener: (() => void) | undefined;

    if (typeof window !== "undefined" && typeof window.screen !== "undefined" && window.screen.orientation) {
        window.screen.orientation.addEventListener("change", handleOrientationChange);
        orientationApiAvailable = true;
    } else if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
        // Fallback for older browsers or environments where screen.orientation is not available
        mediaQuery = window.matchMedia("(orientation: portrait)");
        fallbackListener = () => updateScreenInfo(); // updateScreenInfo will read the current orientation
        // Check if addEventListener is available, otherwise use addListener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', fallbackListener);
        } else {
            // Deprecated but necessary for some older browsers
            mediaQuery.addListener(fallbackListener);
        }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateScreenInfo);
    }

    return () => {
      if (typeof window !== "undefined") {
        if (orientationApiAvailable && window.screen.orientation) {
          window.screen.orientation.removeEventListener("change", handleOrientationChange);
        }
        if (mediaQuery && fallbackListener) {
            if (mediaQuery.removeEventListener) {
              mediaQuery.removeEventListener('change', fallbackListener);
            } else {
              // Deprecated but necessary for some older browsers
              mediaQuery.removeListener(fallbackListener);
            }
        }
        window.removeEventListener("resize", updateScreenInfo);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="mr-2 h-5 w-5 text-primary" />
          Screen Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {screenInfo && currentOrientation !== null ? (
          <>
            <InfoCardItem label="Screen Resolution" value={screenInfo.resolution} />
            <InfoCardItem label="Available Resolution" value={screenInfo.availableResolution} />
            <InfoCardItem label="Color Depth" value={screenInfo.colorDepth ? `${screenInfo.colorDepth}-bit` : 'N/A'} />
            <InfoCardItem label="Pixel Depth" value={screenInfo.pixelDepth ? `${screenInfo.pixelDepth}-bit` : 'N/A'} />
            <InfoCardItem label="Device Pixel Ratio" value={screenInfo.devicePixelRatio} />
            <InfoCardItem label="Orientation" value={currentOrientation} />
          </>
        ) : (
          <div className="space-y-3">
            <InfoCardItem label="Screen Resolution" value={<Skeleton className="h-4 w-3/4" />} />
            <InfoCardItem label="Available Resolution" value={<Skeleton className="h-4 w-3/4" />} />
            <InfoCardItem label="Color Depth" value={<Skeleton className="h-4 w-1/2" />} />
            <InfoCardItem label="Pixel Depth" value={<Skeleton className="h-4 w-1/2" />} />
            <InfoCardItem label="Device Pixel Ratio" value={<Skeleton className="h-4 w-1/3" />} />
            <InfoCardItem label="Orientation" value={<Skeleton className="h-4 w-1/2" />} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
