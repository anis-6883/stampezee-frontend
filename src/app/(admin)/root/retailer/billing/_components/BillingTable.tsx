'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useAllBillingQuery } from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useState } from 'react';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoCheckmarkCircle } from 'react-icons/io5';
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
      header: 'Enroll ID',
      accessorKey: 'enrollSubscriptionId',
    },
    {
      header: 'Grand Total (CAD)',
      accessorKey: 'amountTotal',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">${row?.original?.amountTotal?.toFixed(2)}</h2>
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
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.paymentStatus === 'pending' ? (
              <Badge className="!bg-warning">
                <GiSandsOfTime className="text-xl" /> {_.capitalize(row?.original?.paymentStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize(row?.original?.paymentStatus)}
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
      header: 'Payment Date',
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
      size: 150,
    },
  ];

  const renderDetailPanel = ({ row }: any) => {
    const total = row?.original?.amountTotal || 0;
    const totalPurchasedAmount = row?.original?.enrollSubscriptions?.reduce((acc: number, item: any) => acc + item?.planSnapshot?.price, 0);
    let totalTax: number = 0;
    let remainingBalance = 0;
    const vatPercentage = row?.original?.enrollSubscriptions[0]?.taxSnapshot?.taxCost;

    const upgradeOrDowngradeEnroll = row?.original?.enrollSubscriptions?.find((item: any) => {
      if (item?.enrollStatus === 'upgrade' || item?.enrollStatus === 'downgrade') {
        return true;
      }
      return false;
    });

    if (upgradeOrDowngradeEnroll) {
      remainingBalance = upgradeOrDowngradeEnroll?.balanceInfo?.currentBalance;
    }

    if (upgradeOrDowngradeEnroll) {
      totalTax = (Math.abs(totalPurchasedAmount - remainingBalance) * vatPercentage) / 100;
    } else {
      totalTax = (Math.abs(totalPurchasedAmount) * vatPercentage) / 100;
    }

    const totalCouponDiscount = row?.original?.enrollSubscriptions?.reduce((acc: number, item: any) => {
      if (item?.couponSnapshot?.discount) {
        if (item?.couponSnapshot?.discountType === 'percentage') {
          return acc + (item?.planSnapshot?.price * item?.couponSnapshot?.discount) / 100;
        } else {
          return acc + item?.couponSnapshot?.discount;
        }
      }
      return acc;
    }, 0);

    const planChangeCost = upgradeOrDowngradeEnroll?.planChangeCost;

    return (
      <div className=" flex justify-center">
        <div className="w-[500px]">
          <h2 className="pb-2 text-center text-lg font-medium">Plan & Add-Ons</h2>
          <hr className="p-2 text-lg font-bold" />

          <div>
            <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
              <span className="col-span-6 font-medium">Title</span>
              <span className="col-span-4 justify-self-end font-medium">Price</span>
              <span className="col-span-2 justify-self-end font-medium">Duration</span>
            </div>
            <hr className="p-2 text-lg font-bold" />
            {row?.original?.enrollSubscriptions?.map((enroll: any, index: number) => (
              <>
                <div key={index} className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                  <span className="col-span-6">{enroll?.planSnapshot?.title}</span>
                  <span className="col-span-4 justify-self-end">
                    {enroll ? parseFloat(enroll?.planSnapshot?.price?.toFixed(2)).toFixed(2) : 0} CAD
                  </span>
                  <span className="col-span-2 justify-self-end">{enroll?.planSnapshot?.duration} days</span>
                </div>
              </>
            ))}

            {remainingBalance > 0 && (
              <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-6 font-medium">Remaining Balance</span>
                <span className="col-span-4 justify-self-end font-semibold">-{parseFloat(remainingBalance.toFixed(2)).toFixed(2)} CAD</span>
              </div>
            )}

            {totalTax > 0 && (
              <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-6 font-medium">VAT ({vatPercentage}%)</span>
                <span className="col-span-4 justify-self-end font-semibold">{totalTax.toFixed(2)} CAD</span>
              </div>
            )}

            {planChangeCost > 0 && (
              <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-6 font-medium">Plan Change Cost</span>
                <span className="col-span-4 justify-self-end font-semibold">{parseFloat(planChangeCost).toFixed(2)} CAD</span>
              </div>
            )}

            {totalCouponDiscount > 0 && (
              <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-6 font-medium">Coupon</span>
                <span className="col-span-4 justify-self-end font-semibold">-{parseFloat(totalCouponDiscount).toFixed(2)} CAD</span>
              </div>
            )}
            <hr className="p-2 text-lg font-bold" />
            <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
              <span className="col-span-6 font-semibold">Total</span>
              <span className="col-span-4 justify-self-end font-semibold">{parseFloat(total).toFixed(2)} CAD</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      searchPlaceHolder="Search By Payment ID"
      searchFieldWidth="250px"
      enableRowNumbers={true}
      renderDetailPanel={renderDetailPanel}
    />
  );
}
