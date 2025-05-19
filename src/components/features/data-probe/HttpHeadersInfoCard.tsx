
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText } from "lucide-react";

interface HttpHeadersInfoCardProps {
  headers: Record<string, string>;
}

export default function HttpHeadersInfoCard({ headers }: HttpHeadersInfoCardProps) {
  const headerEntries = Object.entries(headers);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          HTTP Request Headers
        </CardTitle>
        <CardDescription>
          Headers sent by your browser with the request to this page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {headerEntries.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="headers-list">
              <AccordionTrigger>{headerEntries.length} header(s) received. Click to view.</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
                  {headerEntries.map(([key, value]) => (
                    <li key={key} className="p-2 bg-muted/50 rounded">
                      <strong>{key}:</strong> <span className="break-all">{value}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <p className="text-muted-foreground">No headers to display.</p>
        )}
      </CardContent>
    </Card>
  );
}
