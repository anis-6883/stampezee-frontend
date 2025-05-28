'use client';

import { RootState } from '@/features/store';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { IQueryType } from '@/types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../../_components/Table';

export function RevenueTable({ id }: { id: string }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 20, search: null });

  const searchQuery = query.search ? { search: query.search } : {};
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError, isFetching } = useGetSingleRetailerQuery(id, { skip: !accessToken });

  const structure = [
    {
      header: 'First Name',
      accessorKey: 'firstName',
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Branch Name',
      accessorKey: 'branchName',
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
