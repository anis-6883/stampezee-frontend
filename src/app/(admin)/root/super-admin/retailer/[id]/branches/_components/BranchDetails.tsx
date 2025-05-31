'use client';

import { RootState } from '@/features/store';
import { useGetAllBranchByAdminQuery } from '@/features/super-admin/retailer/retailerApi';
import { IQueryType } from '@/types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../../_components/Table';

export function BranchDetails({ id }: { id: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, isFetching } = useGetAllBranchByAdminQuery(
    {
      id,
      queries: {
        page: query.pageIndex + 1,
        limit: query.pageSize,
      },
    },
    { skip: !accessToken }
  );

  const structure = [
    {
      header: 'Branch Name',
      accessorKey: 'name',
    },
    {
      header: 'Branch Address',
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>{row?.original?.address.length > 60 ? `${row?.original?.address.substring(0, 60)}...` : row?.original?.address}</div>
      ),
      size: 250,
    },

    {
      header: 'Total Customers',
      accessorKey: 'totalCustomers',
    },
    {
      header: 'Total Stamp Cards',
      accessorKey: 'totalStampsCards',
    },
    {
      header: 'Total Stamps',
      accessorKey: 'totalStamps',
    },
    {
      header: `Total Revenue`,
      accessorKey: 'totalRevenue',
      Cell: ({ row }: any) => <div>{`${row?.original?.totalRevenue.toFixed(2)} ${row?.original?.currency}`}</div>,
    },
  ];

  return (
    <Table
      isFetching={isFetching}
      isLoading={isLoading}
      response={
        isLoading
          ? {
              data: [],
              pagination: {
                totalDocuments: 0,
              },
            }
          : {
              data: data?.data.docs || [],
              pagination: {
                totalDocuments: data?.data.totalDocs || 0,
              },
            }
      }
      structure={structure}
      setQuery={setQuery}
      query={query}
      showGlobalFilter={false}
      enableRowNumbers={true}
    />
  );
}
