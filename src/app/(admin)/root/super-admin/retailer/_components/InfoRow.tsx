import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  isLoading?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, isLoading = false }) => (
  <div className="flex items-center justify-between font-medium">
    <span className="font-bold">{label}</span>
    {isLoading ? <Skeleton className="h-6 w-32 rounded" /> : <span>{value !== undefined ? value : 'N/A'}</span>}
  </div>
);
