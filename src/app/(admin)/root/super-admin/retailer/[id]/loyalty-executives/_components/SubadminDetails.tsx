'use client';

import { RootState } from '@/features/store';
import { useGetAllSubAdminByAdminQuery } from '@/features/super-admin/retailer/retailerApi';
import { IQueryType } from '@/types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Table from '../../../../../_components/Table';

export function SubAdminDetails({ id }: { id: string }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 20 });
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError, isFetching } = useGetAllSubAdminByAdminQuery(
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
      header: 'First Name',
      accessorKey: 'firstName',
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
      Cell: ({ row }: any) => <div>{row?.original?.lastName ? row?.original?.lastName : 'N/A'}</div>,
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Branch Name',
      accessorKey: 'branch.name',
    },
    {
      header: 'Branch Address',
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.branch?.address.length > 60
            ? `${row?.original?.branch?.address.substring(0, 60)}...`
            : row?.original?.branch?.address}
        </div>
      ),
      size: 250,
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
              data: data?.data?.docs || [],
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
