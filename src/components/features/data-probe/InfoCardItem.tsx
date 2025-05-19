
import type { ReactNode } from 'react';

interface InfoCardItemProps {
  label: string;
  value?: ReactNode;
  className?: string;
}

export function InfoCardItem({ label, value, className }: InfoCardItemProps) {
  return (
    <div className={`mb-2 ${className}`}>
      <span className="font-semibold text-foreground">{label}: </span>
      {typeof value === 'string' || typeof value === 'number' ? (
        <span className="text-muted-foreground break-all">{value !== undefined && value !== null && value !== '' ? value : 'N/A'}</span>
      ) : (
         value !== undefined && value !== null ? value : <span className="text-muted-foreground">N/A</span>
      )}
    </div>
  );
}
