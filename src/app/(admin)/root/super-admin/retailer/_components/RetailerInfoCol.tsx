import { Skeleton } from '@/components/ui/skeleton';

interface RetailerInfoColProps {
  label: string;
  value: string | number | React.ReactNode;
  isLoading?: boolean;
}

export function RetailerInfoCol({ label, value, isLoading = false }: RetailerInfoColProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-base font-bold">{label}</span>
      {isLoading ? <Skeleton className="h-6 w-32 rounded" /> : <span className="">{value !== undefined ? value : 'N/A'}</span>}
    </div>
  );
}
