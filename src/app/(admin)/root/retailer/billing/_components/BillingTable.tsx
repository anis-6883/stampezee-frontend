'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { useAllBillingQuery } from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import Link from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle, IoCheckmarkCircle } from 'react-icons/io5';
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
          <div>{`${row?.original?.planSnapshot?.title} (Plan)`}</div>
        ) : (
          <div>{`${row?.original?.planSnapshot?.title} (Add-on)`}</div>
        );
      },
      size: 220,
    },
    {
      header: 'Subscription Id',
      accessorKey: 'stripe.subscriptionId',
    },
    {
      header: 'Enroll Status',
      accessorKey: 'enrollStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.enrollStatus === 'purchase' ? (
              <Badge className="bg-primary">
                <HiShoppingCart className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollStatus)}
              </Badge>
            ) : row?.original?.enrollStatus === 'upgrade' ? (
              <Badge className="!bg-success">
                <IoArrowUpCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-danger">
                <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollStatus)}
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
      header: 'Balance',
      accessorKey: 'balanceInfo.planCurrentPrice',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-medium">
          {row?.original?.balanceInfo?.planCurrentPrice?.toFixed(2)} {row?.original?.balanceInfo?.currency}
        </div>
      ),
      // mantineTableHeadCellProps: {
      //   align: 'center',
      // },
      // mantineTableBodyCellProps: {
      //   align: 'center',
      // },
      size: 100,
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.paymentStatus === 'pending' ? (
              <Badge className="!bg-warning">
                <GiSandsOfTime className="mr-1 text-xl" /> {_.capitalize(row?.original?.paymentStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.paymentStatus)}
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
      size: 200,
    },
    {
      header: 'Total Paid',
      accessorKey: 'amountTotal',
      Cell: ({ row }: any) => {
        const { balanceInfo, taxSnapshot, enrollStatus, planChangeCost, couponSnapshot, planSnapshot } = row?.original || {};

        let totalAmount = planSnapshot?.price || 0;

        console.log({ totalAmount });

        if (taxSnapshot?.taxCost) {
          totalAmount += (planSnapshot?.price * balanceInfo?.currencyRate * taxSnapshot?.taxCost) / 100;
        }

        if (couponSnapshot) {
          if (couponSnapshot?.discountType === 'percentage') {
            totalAmount -= (planSnapshot?.price * balanceInfo?.currencyRate * couponSnapshot?.discount) / 100;
          } else {
            totalAmount -= balanceInfo?.currencyRate * couponSnapshot?.discount;
          }
        }

        // if (['upgrade', 'downgrade'].includes(enrollStatus)) {
        //   totalAmount -= balanceInfo?.currentBalance;
        //   totalAmount += planChangeCost;
        // }

        if (enrollStatus === 'downgrade' && balanceInfo.currentBalance > planSnapshot?.price * balanceInfo?.currencyRate) {
          totalAmount = 0;
        }

        return (
          <div className="flex items-center justify-center gap-2 font-medium">
            {totalAmount?.toFixed(2)} {balanceInfo?.currency}
          </div>
        );
      },
      size: 100,
    },
    {
      header: 'Payment Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          {row?.original?.payment?.createdAt ? <p>{convertDateByOffset(row?.original?.payment.createdAt, offset)}</p> : <p>Refunded</p>}
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
              <Button className="!m-0 !px-2 !py-1.5" text="Details" color="danger" preIcon={<FaInfoCircle className="text-base" />} />
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

  const renderDetailPanel = ({ row }: any) => {
    const total = row?.original?.amountTotal || 0;
    const totalPurchasedAmount = row?.original?.enrollSubscriptions?.reduce((acc: number, item: any) => acc + item?.planSnapshot?.price, 0);
    let totalTax: number = 0;
    let remainingBalance = 0;
    let vatPercentage = row?.original?.enrollSubscriptions[0]?.taxSnapshot?.taxCost;

    const upgradeOrDowngradeEnroll = row?.original?.enrollSubscriptions?.find((item: any) => {
      if (item?.enrollStatus === 'upgrade' || item?.enrollStatus === 'downgrade') {
        return true;
      }
      return false;
    });
    const downGradeEnroll = row?.original?.enrollSubscriptions?.find((item: any) => {
      if (item?.enrollStatus === 'downgrade') {
        return true;
      }
      return false;
    });
    if (downGradeEnroll && row?.original?.enrollSubscriptions[1]?.taxSnapshot?.taxTitle) {
      vatPercentage = row?.original?.enrollSubscriptions[1]?.taxSnapshot?.taxCost;
    }

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
      searchPlaceHolder="Search By Subscription ID"
      searchFieldWidth="250px"
      enableRowNumbers={true}
      // renderDetailPanel={renderDetailPanel}
    />
  );
}
