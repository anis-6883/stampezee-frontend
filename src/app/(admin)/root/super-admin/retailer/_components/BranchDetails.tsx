'use client';

import { RootState } from '@/features/store';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { useSelector } from 'react-redux';
import BranchStatisticsTable from './BranchStatisticsTable';

export function BranchDetails({ id }: { id: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError } = useGetSingleRetailerQuery(id, { skip: !accessToken });

  return (
    <BranchStatisticsTable
      businessCurrency={data?.data?.businessCurrency}
      data={data?.data?.branches}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
