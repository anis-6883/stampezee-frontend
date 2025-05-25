'use client';

import Spinner from '@/components/ui/spinner';
import { RootState } from '@/features/store';
import {
  useGetCustomerStatsWithCountryWiseQuery,
  useGetRetailerStatsWithCountryWiseQuery,
} from '@/features/super-admin/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useSelector } from 'react-redux';
import ActiveUsers from './ActiveUser';

export default function RetailerAndCustomerStats({ className, dateRange }: { className?: string; dateRange: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const {
    data: retailerWiseData,
    isLoading: isRetailerWiseDataLoading,
    isFetching: isRetailerFetching,
  } = useGetRetailerStatsWithCountryWiseQuery({ dateRange }, { skip: !accessToken });
  const {
    data: customerWiseData,
    isLoading: isCustomerWiseDataLoading,
    isFetching: isCustomerFetching,
  } = useGetCustomerStatsWithCountryWiseQuery({ dateRange }, { skip: !accessToken });

  if (isRetailerWiseDataLoading || isCustomerWiseDataLoading) {
    return (
      <div className="m-auto">
        <Spinner size="lg" />
      </div>
    );
  }

  const transformedData = customerWiseData?.data?.countries?.filter((country: any) => country?.name && country?.country);

  return (
    <div className={cn('grid grid-cols-12 gap-5', className)}>
      <ActiveUsers
        className="col-span-12 md:col-span-12"
        title="Active Retailers"
        data={retailerWiseData?.data?.countries || []}
        isLoading={isRetailerWiseDataLoading || isRetailerFetching}
      />
      <ActiveUsers
        className="col-span-12 md:col-span-12"
        title="Active Customers"
        data={transformedData || []}
        isLoading={isCustomerWiseDataLoading || isCustomerFetching}
      />
    </div>
  );
}
