'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useAllBillingQuery } from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

export default function BillingTable({ offset }: { offset: number }) {
  const t = useTranslations('RetailerBillingTable');
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBillingQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: t('planAndAddOn'),
      accessorKey: 'planSnapshot.title',
      Cell: ({ row }: any) => {
        return row?.original?.subscriptions?.map((subscription: any) => (
          <div className="my-1" key={subscription?._id}>
            {subscription?.title}
          </div>
        ));
      },
      size: 200,
    },
    {
      header: t('paymentInfo'),
      accessorKey: 'stripe.subscriptionId',
    },
    {
      header: t('totalAmount'),
      accessorKey: 'balanceInfo.planCurrentPrice',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-medium">
          {row?.original?.balanceInfo?.planCurrentPrice?.toFixed(2)} {row?.original?.balanceInfo?.currency}
        </div>
      ),
      size: 100,
    },
    {
      header: t('paymentDate'),
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{convertDateByOffset(row?.original?.validityTo, offset)}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 230,
    },
    {
      header: t('actions'),
      Cell: ({ row }: any) => {
        return (
          <Link href={routes.privateRoutes.retailer.billing.details(row?.original?._id)}>
            <Button
              className="!m-0 !px-2 !py-1.5"
              text={t('subscriptionDetails')}
              color="danger"
              preIcon={<FaInfoCircle className="text-base" />}
            />
          </Link>
        );
      },
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 200,
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
      enableRowNumbers={true}
    />
  );
}
