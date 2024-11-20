'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useAllBillingQuery } from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { Badge } from 'rizzui';

export default function BillingTable({ offset }: { offset: number }) {
  const t = useTranslations('RetailerBillingTable');
  const t3 = useTranslations('RetailerBranchTable');
  const t1 = useTranslations('RetailerBillingDetailsCard');
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
        return row?.original?.enrollSubscriptions?.map((subscription: any) => {
          if (subscription?.deletedByRetailer) return null;

          return (
            <div className="my-1" key={subscription?._id}>
              {subscription?.title}
            </div>
          );
        });
      },
      size: 200,
    },
    {
      header: t('subscriptionId'),
      accessorKey: 'stripe.subscriptionId',
      size: 200,
    },
    {
      header: t3('status'),
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="text-white">
              {row?.original?.status === true ? (
                <Badge className="!bg-success text-white">
                  <GiSandsOfTime className="mr-1 text-xl" /> {t('running')}
                </Badge>
              ) : (
                <Badge className="!bg-danger text-white">
                  <PiFlagCheckeredFill className="mr-1 text-xl" /> {t('ended')}
                </Badge>
              )}
            </div>
          </div>
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

    {
      header: t('paymentDate'),
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{convertDateByOffset(row?.original?.createdAt, offset)}</p>
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
      header: t1('enrollStatus'),
      Cell: ({ row }: any) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="text-white">
              {row?.original?.enrollStatus === 'purchase' ? (
                <Badge className="bg-primary text-white">
                  <HiShoppingCart className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollStatus)}
                </Badge>
              ) : row?.original?.enrollStatus === 'upgrade' ? (
                <Badge className="!bg-success text-white">
                  <IoArrowUpCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollStatus)}
                </Badge>
              ) : (
                <Badge className="!bg-danger text-white">
                  <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollStatus)}
                </Badge>
              )}
            </div>
          </div>
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
    <>
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
    </>
  );
}
