'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllRetailerCustomerQuery } from '@/features/retailer/customer/customerApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

export default function CustomerTable({ offset }: { offset: number }) {
  const { data: session }: any = useSession();

  // Query State
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllRetailerCustomerQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  useEffect(() => {
    if (!session?.user?.plan) {
      return redirect(routes.privateRoutes.retailer.dashboard);
    }
  }, [session]);

  const structure = [
    {
      header: 'Info',
      accessorKey: 'name',
      Cell: ({ row }: any) => (
        <div className="">
          <p>
            <span className="font-bold">Name:</span> {row?.original?.fullName}
          </p>
          <p>
            <span className="font-bold">Email:</span> {row?.original?.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {row?.original?.dialCode}
            {row?.original?.phone}
          </p>
          <p>
            <span className="font-bold">Country:</span> {row?.original?.country}
          </p>
        </div>
      ),
      size: 250,
    },
    {
      header: 'Joined Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p> {convertDateByOffset(row?.original?.createdAt, offset)}</p>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Statistics',
      accessorKey: 'totalCollectStamp',
      Cell: ({ row }: any) => (
        <div className="">
          <p>
            <span className="font-bold">Total Collect Stamp:</span> {row?.original?.totalCollectStamp}
          </p>
          <p>
            <span className="font-bold">Total Scan:</span> {row?.original?.totalScan}
          </p>
          <p>
            <span className="font-bold">Total Reward Collect:</span> {row?.original?.totalRewardCollect}
          </p>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={routes.privateRoutes.retailer.customer?.details(row?.original?._id)}>
            <Button color="primary" preIcon={<FaInfoCircle className="text-base" />} tooltip="Details" />
          </Link>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
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
        searchPlaceHolder="Search By Customer Name or Email"
        searchFieldWidth="300px"
      />
    </>
  );
}
