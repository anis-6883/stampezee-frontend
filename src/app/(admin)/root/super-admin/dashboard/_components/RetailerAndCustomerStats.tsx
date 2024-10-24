'use client';

import {
  useGetCustomerStatsWithCountryWiseQuery,
  useGetRetailerStatsWithCountryWiseQuery,
} from '@/features/super-admin/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import ActiveUsers from './ActiveUser';

export default function RetailerAndCustomerStats({ className }: { className?: string }) {
  const { data: retailerWiseData, isLoading: isRetailerWiseDataLoading } = useGetRetailerStatsWithCountryWiseQuery({});
  const { data: customerWiseData, isLoading: isCustomerWiseDataLoading } = useGetCustomerStatsWithCountryWiseQuery({});

  const transformedData = customerWiseData?.data?.countries?.filter((country: any) => country?.name);
  return (
    <div className={cn('grid grid-cols-12 gap-5', className)}>
      <ActiveUsers
        className="col-span-12 md:col-span-6"
        title="Active Retailers"
        data={retailerWiseData?.data?.countries}
        isLoading={isRetailerWiseDataLoading}
      />
      <ActiveUsers
        className="col-span-12 md:col-span-6"
        title="Active Customers"
        data={transformedData}
        isLoading={isCustomerWiseDataLoading}
      />
    </div>
  );
}
