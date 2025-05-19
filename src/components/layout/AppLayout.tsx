
import type { ReactNode } from 'react';
import DataProbeHeader from './DataProbeHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <DataProbeHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
        FingerPrinted &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
