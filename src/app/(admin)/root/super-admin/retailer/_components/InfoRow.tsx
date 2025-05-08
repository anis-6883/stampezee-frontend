import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface InfoRowProps {
  label: string;
  value: string | number | React.ReactNode;
  isLoading?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, isLoading = false }) => (
  <div className="flex items-center justify-between font-medium">
    <span className="w-[30%] font-bold">{label}</span>
    {isLoading ? (
      <Skeleton className="h-6 w-32 rounded" />
    ) : (
      <span className="w-[70%] break-all text-end">{value !== undefined ? value : 'N/A'}</span>
    )}
  </div>
);
