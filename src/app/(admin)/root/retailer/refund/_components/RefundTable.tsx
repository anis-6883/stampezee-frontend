'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useAllRefundQuery } from '@/features/retailer/refund/refundApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoArrowDownCircle, IoCheckmarkCircle } from 'react-icons/io5';
import { Badge } from 'rizzui';

export default function RefundTable({ offset }: { offset: number }) {
  const t = useTranslations('RetailerRefundTable');
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllRefundQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: t('plan'),
      accessorKey: 'enrollsubscription.planSnapshot.title',
    },
    {
      header: t('validityDate'),
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Started At:</span> {convertDateByOffset(row?.original?.enrollsubscription?.validityFrom, offset)}
          </p>
          <p>
            <span className="font-bold">Expired At:</span> {convertDateByOffset(row?.original?.enrollsubscription?.validityTo, offset)}
          </p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 300,
    },
    {
      header: t('enrollStatus'),
      accessorKey: 'enrollsubscription.enrollStatus',
      Cell: ({ row }: any) => (
        <Badge className="!bg-danger text-white">
          <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollsubscription?.enrollStatus)}
        </Badge>
      ),
    },
    {
      header: t('refundAmount'),
      accessorKey: 'refundAmount',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">
              {row?.original?.refundAmount?.toFixed(2)} {row?.original?.currency}
            </h2>
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: t('refundStatus'),
      accessorKey: 'refundStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.refundStatus === 'pending' ? (
              <Badge className="!bg-warning">
                <GiSandsOfTime className="text-xl" /> {_.capitalize(row?.original?.refundStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize(row?.original?.refundStatus)}
              </Badge>
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
    },
    {
      header: t('refundDate'),
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{convertDateByOffset(row?.original?.refundedAt, offset)}</p>
        </div>
      ),
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
              data: data?.data.docs || [],
              pagination: {
                totalDocuments: data?.data.totalDocs || 0,
              },
            }
      }
      structure={structure}
      setQuery={setQuery}
      query={query}
      searchPlaceHolder={t('placeHolder')}
      searchFieldWidth="250px"
      showGlobalFilter={false}
    />
  );
}
