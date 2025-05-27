'use client';

import { RootState } from '@/features/store';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { useSelector } from 'react-redux';
import SubAdminListTable from './SubAdminListTable';

export function SubAdminDetails({ id }: { id: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError } = useGetSingleRetailerQuery(id, { skip: !accessToken });

  return <SubAdminListTable data={data?.data?.sub_admins} isLoading={isLoading} isError={isError} />;
}
