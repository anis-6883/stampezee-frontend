'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useSuperAdminNotificationsQuery } from '@/features/super-admin/notification/notificationApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useState } from 'react';
import { Badge } from 'rizzui';

export default function NotificationTable({ offset }: { offset: number }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useSuperAdminNotificationsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: 'Retailer Store',
      accessorKey: 'retailer.storeName',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div>
            {row?.original?.retailer?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row?.original?.retailer?.image}`}
                  alt="image"
                  className="h-8 w-8 rounded"
                />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
            )}
          </div>
          <div>
            <div className="text-md">
              <p className="text-center font-semibold">{row?.original?.retailer?.storeName}</p>
            </div>
          </div>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Title',
      accessorKey: 'title',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{row?.original?.title}</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{row?.original?.description?.length >= 60 ? `${row?.original?.description?.slice(0, 60)}....` : row?.original?.description}</p>
        </div>
      ),
    },
    {
      header: 'Notification Type',
      accessorKey: 'type',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.type === 'all' ? (
            <Badge className="!bg-danger text-white">{_.capitalize(row?.original?.type)}</Badge>
          ) : (
            <Badge className="bg-primary text-white">{_.capitalize(row?.original?.type)}</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Image',
      accessorKey: 'image',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <img src={row.original.image ?? '/images/no-img.png'} alt="image" className="h-16 w-16 rounded-md" />
        </div>
      ),
    },
    {
      header: 'Send Time',
      Cell: ({ row }: any) => <div className="text-md mx-auto text-start">{convertDateByOffset(row?.original?.createdAt, offset)}</div>,
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 150,
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
      searchPlaceHolder="Search by Notification Title or Store Name"
      searchFieldWidth="350px"
      enableRowNumbers={true}
    />
  );
}
