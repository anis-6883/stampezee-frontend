'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetSubscriptionPaymentsQuery } from '@/features/super-admin/payment/paymentApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { Badge } from 'rizzui';

export default function PaymentTable({ offset }: { offset: number }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetSubscriptionPaymentsQuery({
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
      header: 'Plan/Add-on',
      accessorKey: 'planSnapshot.title',
      Cell: ({ row }: any) => {
        return row?.original?.enrollSubscriptions?.map((subscription: any) => {
          return (
            <div className="my-1" key={subscription?._id}>
              {subscription?.deletedByRetailerAt ? (
                <span className="line-through">{subscription?.title}</span>
              ) : (
                <span>{subscription?.title}</span>
              )}
            </div>
          );
        });
      },
      size: 220,
    },
    {
      header: 'Subscription ID',
      accessorKey: 'stripe.subscriptionId',
      size: 200,
    },
    {
      header: 'Billing Cycle',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        const validityTo = moment.utc(row?.original?.validityTo).utcOffset(Number(offset));

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
      header: 'Enroll Date',
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
      size: 200,
    },

    {
      header: 'Enroll Status',
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
      size: 120,
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => {
        return (
          <Link href={routes.privateRoutes.superAdmin.payment?.details(row?.original?._id)}>
            <Button className="!m-0 !px-2 !py-1.5" text="Payment Details" color="danger" preIcon={<FaInfoCircle className="text-base" />} />
          </Link>
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
      searchPlaceHolder="Search By Subscription ID or Store Name"
      searchFieldWidth="340px"
      enableRowNumbers={true}
    />
  );
}
