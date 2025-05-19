
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";

interface CookieInfo {
  name: string;
  value: string;
}

export default function CookiesInfoCard() {
  const [cookies, setCookies] = useState<CookieInfo[]>([]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookieString = document.cookie;
      if (cookieString) {
        const parsedCookies = cookieString.split(';').map(cookie => {
          const parts = cookie.split('=');
          const name = parts[0]?.trim();
          const value = parts.slice(1).join('='); // Handle cases where value might contain '='
          return { name, value };
        }).filter(cookie => cookie.name); // Ensure cookie name is not empty
        setCookies(parsedCookies);
      }
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cookie className="mr-2 h-5 w-5 text-primary" />
          Browser Cookies
        </CardTitle>
        <CardDescription>
          Cookies stored by websites in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cookies.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cookies-list">
              <AccordionTrigger>{cookies.length} cookie(s) found. Click to view.</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
                  {cookies.map((cookie, index) => (
                    <li key={index} className="p-2 bg-muted/50 rounded">
                      <strong>{cookie.name}:</strong> <span className="break-all">{cookie.value}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="text-muted-foreground">No cookies found or access is restricted.</p>
        )}
      </CardContent>
    </Card>
  );
}
