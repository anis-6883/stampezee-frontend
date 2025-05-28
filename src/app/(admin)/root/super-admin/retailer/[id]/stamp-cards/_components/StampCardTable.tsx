'use client';

import { RootState } from '@/features/store';
import { useGetAllStampCardByAdminQuery } from '@/features/super-admin/retailer/retailerApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'rizzui';
import Table from '../../../../../_components/Table';

export function StampCardTable({ id, timezone = '' }: { id: string; timezone: string }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 20 });

  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError, isFetching } = useGetAllStampCardByAdminQuery({ id, queries: query }, { skip: !accessToken });

  const structure = [
    {
      header: 'Info',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div>
            {row.original?.stampImage?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original?.stampImage?.image}`}
                  alt="image"
                  className="h-10 w-10 rounded"
                />
              </div>
            ) : (
              <img src={'/images/logo.png'} alt="image" className="h-10 w-10 rounded" />
            )}
          </div>
          <div>
            <div className="text-md mx-auto text-start">
              <p>
                <span className="font-bold">{'Title'}:</span>{' '}
                {row?.original.title?.length >= 21 ? `${row?.original.title.slice(0, 22)}..` : row?.original.title}
              </p>
              <p>
                <span className="font-bold">{'Category'}:</span> {_.startCase(_.toLower(row?.original?.category?.name))}
              </p>
              <p>
                <span className="font-bold">{'Branch'}:</span> {row?.original?.branch?.name}
              </p>
              <p>
                <span className="font-bold">{'No. of stamp cards to collect'}:</span> {row?.original?.noOfStampsToCollect}
              </p>
            </div>
          </div>
        </div>
      ),
      size: 300,
    },
    {
      header: 'Reward',
      accessorKey: 'rewardType',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Reward type:</span> {row?.original?.rewardType}
          </p>
          <p>
            <span className="font-bold">Reward:</span>{' '}
            {row?.original?.rewardType === 'discount' ? `${row?.original?.discountReward}%` : row?.original?.promotionReward}
          </p>
          <p>
            <span className="font-bold">Min. purchase amount:</span> {row?.original?.minPurchaseAmount} {'CAD'}
          </p>
        </div>
      ),
      size: 250,
    },
    {
      header: 'Source',
      accessorKey: 'source',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.source === 'addon' ? (
              <Badge className="!bg-danger">{_.capitalize(row?.original?.source)}</Badge>
            ) : (
              <Badge className="bg-primary">{_.capitalize(row?.original?.source)}</Badge>
            )}
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 200,
    },
    {
      header: 'Validity date',
      Cell: ({ row }: any) => {
        return row?.original?.hasValidity ? (
          <div className="text-md mx-auto text-start">
            <p>
              <span className="font-bold">{'Started at'}:</span> {getFormatDateByTimezone(row?.original?.startedAt, timezone || '')}
            </p>
            <p>
              <span className="font-bold">{'Expired at'}:</span> {getFormatDateByTimezone(row?.original?.expiredAt, timezone || '')}
            </p>
          </div>
        ) : (
          <div className="text-md mx-auto text-start font-bold">{'No Expiration'}</div>
        );
      },
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
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
