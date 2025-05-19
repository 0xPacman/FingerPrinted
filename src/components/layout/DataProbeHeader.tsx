
import { Fingerprint } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function DataProbeHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Fingerprint className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl font-semibold text-foreground">
            FingerPrinted
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
