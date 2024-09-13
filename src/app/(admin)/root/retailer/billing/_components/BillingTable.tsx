'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { useAllBillingQuery } from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { Badge } from 'rizzui';

export default function BillingTable({ offset }: { offset: number }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBillingQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: 'Plan/Add-on',
      accessorKey: 'planSnapshot.title',
      Cell: ({ row }: any) => {
        return row?.original?.planSnapshot?.type === 'subscription' ? (
          <div>
            <span className="font-semibold">Plan:</span> {`${row?.original?.planSnapshot?.title}`}
          </div>
        ) : (
          <div>
            <span className="font-semibold">Add-on:</span> {`${row?.original?.planSnapshot?.title}`}
          </div>
        );
      },
      size: 200,
    },
    {
      header: 'Subscription ID',
      accessorKey: 'stripe.subscriptionId',
    },
    {
      header: 'Balance',
      accessorKey: 'balanceInfo.planCurrentPrice',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-medium">
          {row?.original?.balanceInfo?.planCurrentPrice?.toFixed(2)} {row?.original?.balanceInfo?.currency}
        </div>
      ),
      size: 100,
    },
    {
      header: 'Plan Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        const validityTo = moment.utc(row?.original?.validityTo).utcOffset(Number(offset));
        console.log({ date: validityTo, isBefore: moment().isBefore(validityTo) });

        return (
          <div className="flex items-center justify-center gap-2">
            <div className="text-white">
              {row?.original?.status === true && moment().isBefore(validityTo) ? (
                <Badge className="!bg-success">
                  <GiSandsOfTime className="mr-1 text-xl" /> Running
                </Badge>
              ) : (
                <Badge className="!bg-danger">
                  <PiFlagCheckeredFill className="mr-1 text-xl" /> Ended
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
    },
    {
      header: 'Expire Date',
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
      header: 'Actions',
      Cell: ({ row }: any) => {
        return (
          <div>
            <Link href={'/'}>
              <Button
                className="!m-0 !px-2 !py-1.5"
                text="Payment Details"
                color="danger"
                preIcon={<FaInfoCircle className="text-base" />}
              />
            </Link>
          </div>
        );
      },
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
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
      searchPlaceHolder="Search By Subscription ID"
      searchFieldWidth="250px"
      enableRowNumbers={true}
    />
  );
}
