
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, AlertTriangle, Eye } from "lucide-react";

export default function PrivacyConsiderationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scale className="mr-2 h-5 w-5 text-primary" />
          Privacy Considerations
        </CardTitle>
        <CardDescription>
          Understanding what your revealed data means for your privacy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
          <p>
            <strong>Digital Fingerprinting:</strong> The combination of your IP address, browser details, screen size, OS, language, and installed fonts/plugins can create a unique "fingerprint." Websites can use this to track you across the internet, even if you clear cookies.
          </p>
        </div>
        <div className="flex items-start">
          <Eye className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />
          <p>
            <strong>Targeted Advertising:</strong> Information like your location (derived from IP), browsing habits (from cookies), and system details helps advertisers build a profile about you to show targeted ads.
          </p>
        </div>
         <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
          <p>
            <strong>VPNs & Anonymity:</strong> While VPNs can mask your IP address, sophisticated tracking can sometimes still identify users through other means or detect VPN usage itself, potentially leading to restricted access on some services.
          </p>
        </div>
        <div className="flex items-start">
          <Eye className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />
          <p>
            <strong>Data Collection by Extensions:</strong> Browser extensions can access and collect a wide range of data. While this app cannot directly list your extensions for security reasons, be mindful of the permissions they request.
          </p>
        </div>
         <p className="text-xs text-muted-foreground mt-4">
           This application demonstrates data your browser may expose. Being aware is the first step to managing your digital privacy.
        </p>
      </CardContent>
    </Card>
  );
}
