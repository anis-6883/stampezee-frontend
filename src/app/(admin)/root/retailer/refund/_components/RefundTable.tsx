'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useAllRefundQuery } from '@/features/retailer/refund/refundApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoArrowDownCircle, IoCheckmarkCircle } from 'react-icons/io5';
import { Badge } from 'rizzui';

export default function RefundTable() {
  const { data: session }: any = useSession();
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
      accessorKey: 'plan',
      Cell: ({ row }: any) => <div className="text-md mx-auto text-start capitalize">{row?.original?.plan}</div>,
    },
    {
      header: t('validityDate'),
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">{t('startedAt')}:</span>{' '}
            {convertDateByOffset(row?.original?.enrollment?.validityFrom, session?.user?.timezone?.value || 0)}
          </p>
          <p>
            <span className="font-bold">{t('expiredAt')}:</span>{' '}
            {convertDateByOffset(row?.original?.enrollment?.validityTo, session?.user?.timezone?.value || 0)}
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
      accessorKey: 'reason',
      Cell: ({ row }: any) => (
        <Badge className="!bg-danger text-white">
          <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.reason)}
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
          <p>{convertDateByOffset(row?.original?.refundedAt, session?.user?.timezone?.value || 0)}</p>
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
