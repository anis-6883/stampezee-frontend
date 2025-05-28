'use client';

import { RootState } from '@/features/store';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { IQueryType } from '@/types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../../_components/Table';

export function BranchDetails({ id }: { id: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 20, search: null });

  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isError, isFetching } = useGetSingleRetailerQuery(id, { skip: !accessToken });

  const structure = [
    {
      header: 'Branch Name',
      accessorKey: 'name',
    },
    {
      header: 'Branch Address',
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.address.name.length > 60 ? `${row?.original?.address.name.substring(0, 60)}...` : row?.original?.address.name}
        </div>
      ),
    },

    {
      header: 'Total Customer',
      accessorKey: 'totalCustomer',
    },
    {
      header: 'Total Stamps',
      accessorKey: 'totalStamps',
    },
    {
      header: `Total Revenue (${data?.data?.businessCurrency})`,
      accessorKey: 'totalRevenue',
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
      searchPlaceHolder={'Search..'}
      enableRowNumbers={true}
    />
  );
}
