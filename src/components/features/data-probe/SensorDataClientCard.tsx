
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Move, Compass, Sun, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { InfoCardItem } from "./InfoCardItem";
import { useToast } from "@/hooks/use-toast";

interface MotionData {
  accelerationX?: number | null;
  accelerationY?: number | null;
  accelerationZ?: number | null;
  rotationAlpha?: number | null;
  rotationBeta?: number | null;
  rotationGamma?: number | null;
}

interface OrientationData {
  alpha?: number | null; // Compass heading
  beta?: number | null;  // Front-back tilt
  gamma?: number | null; // Left-right tilt
  absolute?: boolean;
}

interface LightData {
  illuminance?: number | null;
}

type SensorType = "motion" | "orientation" | "light";

export default function SensorDataClientCard() {
  const [motionData, setMotionData] = useState<MotionData | null>(null);
  const [orientationData, setOrientationData] = useState<OrientationData | null>(null);
  const [lightData, setLightData] = useState<LightData | null>(null);
  
  const [permissionStatus, setPermissionStatus] = useState<Record<SensorType, 'default' | 'granted' | 'denied' | 'unavailable'>>({
    motion: 'default',
    orientation: 'default',
    light: 'default',
  });

  const [isLoading, setIsLoading] = useState<Record<SensorType, boolean>>({
    motion: false,
    orientation: false,
    light: false,
  });

  const { toast } = useToast();

  const requestSensorPermission = async (sensorType: SensorType) => {
    setIsLoading(prev => ({ ...prev, [sensorType]: true }));
    try {
      if (sensorType === "motion") {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          const motionPerm = await (DeviceMotionEvent as any).requestPermission();
          if (motionPerm === 'granted') {
            setPermissionStatus(prev => ({...prev, motion: 'granted'}));
            window.addEventListener('devicemotion', handleDeviceMotion);
          } else {
            setPermissionStatus(prev => ({...prev, motion: 'denied'}));
            toast({ title: "Motion Sensor", description: "Permission denied.", variant: "destructive" });
          }
        } else { // For browsers that don't require explicit permission
          setPermissionStatus(prev => ({...prev, motion: 'granted'}));
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      } else if (sensorType === "orientation") {
         if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          const orientationPerm = await (DeviceOrientationEvent as any).requestPermission();
          if (orientationPerm === 'granted') {
            setPermissionStatus(prev => ({...prev, orientation: 'granted'}));
            window.addEventListener('deviceorientation', handleDeviceOrientation);
          } else {
            setPermissionStatus(prev => ({...prev, orientation: 'denied'}));
            toast({ title: "Orientation Sensor", description: "Permission denied.", variant: "destructive" });
          }
        } else {
          setPermissionStatus(prev => ({...prev, orientation: 'granted'}));
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      } else if (sensorType === "light") {
        if ('AmbientLightSensor' in window) {
          // @ts-ignore
          const lightSensor = new AmbientLightSensor({ frequency: 1 });
          lightSensor.onreading = () => {
            setLightData({ illuminance: lightSensor.illuminance });
            setPermissionStatus(prev => ({...prev, light: 'granted'}));
          };
          lightSensor.onerror = (event: any) => {
            if (event.error.name === 'NotAllowedError') {
              setPermissionStatus(prev => ({...prev, light: 'denied'}));
              toast({ title: "Light Sensor", description: "Permission denied.", variant: "destructive" });
            } else {
              setPermissionStatus(prev => ({...prev, light: 'unavailable'}));
              toast({ title: "Light Sensor", description: "Error or unavailable.", variant: "destructive" });
            }
            setLightData(null);
          };
          lightSensor.start();
        } else {
          setPermissionStatus(prev => ({...prev, light: 'unavailable'}));
          toast({ title: "Light Sensor", description: "AmbientLightSensor API not supported.", variant: "destructive" });
        }
      }
    } catch (error) {
      console.error(`Error requesting ${sensorType} permission:`, error);
      setPermissionStatus(prev => ({...prev, [sensorType]: 'unavailable'}));
      toast({ title: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensor`, description: "Error or unavailable.", variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, [sensorType]: false }));
    }
  };

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    setMotionData({
      accelerationX: event.acceleration?.x,
      accelerationY: event.acceleration?.y,
      accelerationZ: event.acceleration?.z,
      rotationAlpha: event.rotationRate?.alpha,
      rotationBeta: event.rotationRate?.beta,
      rotationGamma: event.rotationRate?.gamma,
    });
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    setOrientationData({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute,
    });
  };

  useEffect(() => {
    return () => { // Cleanup listeners
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      // AmbientLightSensor cleanup is handled by its own lifecycle if started
    };
  }, []);
  
  const renderSensorStatus = (type: SensorType, data: any, icon: React.ReactNode, fields: {label: string, key: string, unit?: string}[]) => (
    <div className="mt-2">
      {permissionStatus[type] === 'default' && (
        <Button onClick={() => requestSensorPermission(type)} disabled={isLoading[type]} className="w-full sm:w-auto">
          {isLoading[type] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}
          Access {type.charAt(0).toUpperCase() + type.slice(1)} Data
        </Button>
      )}
      {permissionStatus[type] === 'granted' && data && (
        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-md text-green-700 dark:text-green-400">
          {fields.map(field => (
             <InfoCardItem key={field.key} label={field.label} value={data[field.key] !== null && data[field.key] !== undefined ? `${parseFloat(data[field.key]).toFixed(2)}${field.unit || ''}` : 'N/A'} />
          ))}
        </div>
      )}
      {permissionStatus[type] === 'denied' && <p className="text-destructive flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />Permission denied for {type} sensor.</p>}
      {permissionStatus[type] === 'unavailable' && <p className="text-muted-foreground flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />{type.charAt(0).toUpperCase() + type.slice(1)} sensor unavailable or not supported.</p>}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Device Sensors
        </CardTitle>
        <CardDescription>
          Access data from your device's sensors (requires permission). Data updates in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-1">Motion Sensors (Accelerometer, Gyroscope)</h4>
          {renderSensorStatus("motion", motionData, <Move className="mr-2 h-4 w-4" />, [
            {label: "Accel X", key: "accelerationX", unit: " m/s²"}, {label: "Accel Y", key: "accelerationY", unit: " m/s²"}, {label: "Accel Z", key: "accelerationZ", unit: " m/s²"},
            {label: "Rotate Alpha", key: "rotationAlpha", unit: " °/s"}, {label: "Rotate Beta", key: "rotationBeta", unit: " °/s"}, {label: "Rotate Gamma", key: "rotationGamma", unit: " °/s"},
          ])}
        </div>
        <div>
          <h4 className="font-medium mb-1">Orientation Sensor (Magnetometer)</h4>
          {renderSensorStatus("orientation", orientationData, <Compass className="mr-2 h-4 w-4" />, [
            {label: "Alpha (Compass)", key: "alpha", unit: "°"}, {label: "Beta (Tilt F-B)", key: "beta", unit: "°"}, {label: "Gamma (Tilt L-R)", key: "gamma", unit: "°"},
            {label: "Absolute", key: "absolute"},
          ])}
        </div>
        <div>
          <h4 className="font-medium mb-1">Ambient Light Sensor</h4>
           {renderSensorStatus("light", lightData, <Sun className="mr-2 h-4 w-4" />, [
            {label: "Illuminance", key: "illuminance", unit: " lux"},
          ])}
        </div>
      </CardContent>
    </Card>
  );
}
