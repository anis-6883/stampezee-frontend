'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetSubscriptionPaymentsQuery } from '@/features/super-admin/payment/paymentApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import Link from 'next/link';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
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
      header: 'Retailer',
      accessorKey: 'retailer.storeName',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div>
            {row?.original?.enrollSubscription?.retailer?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row?.original?.enrollSubscription?.retailer?.image}`}
                  alt="image"
                  className="h-full w-8 rounded"
                />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-full w-8 rounded" />
            )}
          </div>
          <div>
            <div className="text-md">
              <p className="text-center font-semibold">{row?.original?.enrollSubscription?.retailer?.storeName}</p>
            </div>
          </div>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Payment Intent ID',
      accessorKey: 'paymentIntentId',
    },
    {
      header: 'Plan/Add-on',
      accessorKey: 'planSnapshot.title',
      Cell: ({ row }: any) => {
        return row?.original?.enrollSubscription?.planSnapshot?.type === 'subscription' ? (
          <div>{`${row?.original?.enrollSubscription?.planSnapshot?.title} (Plan)`}</div>
        ) : (
          <div>{`${row?.original?.enrollSubscription?.planSnapshot?.title} (Add-on)`}</div>
        );
      },
    },
    {
      header: 'Enroll Status',
      accessorKey: 'enrollStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.enrollSubscription?.enrollStatus === 'purchase' ? (
              <Badge className="bg-primary">
                <HiShoppingCart className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollSubscription?.enrollStatus)}
              </Badge>
            ) : row?.original?.enrollSubscription?.enrollStatus === 'upgrade' ? (
              <Badge className="!bg-success">
                <IoArrowUpCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollSubscription?.enrollStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-danger">
                <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(row?.original?.enrollSubscription?.enrollStatus)}
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
      header: 'Grand Total',
      accessorKey: 'amountTotal',
      Cell: ({ row }: any) => {
        let totalAmount = row?.original?.enrollSubscription?.balanceInfo?.planCurrentPrice || 0;
        if (row?.original?.enrollSubscription?.taxSnapshot?.taxCost) {
          totalAmount += (row?.original?.enrollSubscription?.balanceInfo?.planCurrentPrice * 2) / 100;
        }
        if (row?.original?.enrollSubscription?.couponSnapshot) {
          if (row?.original?.enrollSubscription?.couponSnapshot?.discountType === 'percentage') {
            totalAmount -=
              (row?.original?.enrollSubscription?.balanceInfo?.planCurrentPrice *
                row?.original?.enrollSubscription?.couponSnapshot?.discount) /
              100;
          } else {
            totalAmount -= row?.original?.enrollSubscription?.couponSnapshot?.discount;
          }
        }
        if (
          row?.original?.enrollSubscription?.enrollStatus === 'upgrade' ||
          row?.original?.enrollSubscription?.enrollStatus === 'downgrade'
        ) {
          totalAmount -= row?.original?.enrollSubscription?.balanceInfo?.currentBalance;
          totalAmount += row?.original?.enrollSubscription?.planChangeCost;
        }
        return (
          <div className="flex items-center justify-center gap-2">
            <div>
              <h2 className="font-medium">
                {totalAmount?.toFixed(2)} {row?.original?.enrollSubscription?.balanceInfo?.currency}
              </h2>
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
      size: 220,
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => {
        return (
          <div>
            <Link href={routes.privateRoutes.superAdmin.retailer?.details(row?.original?._id)}>
              <Button className="!m-0" text="Details" color="danger" preIcon={<FaInfoCircle className="text-base" />} />
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

  const RenderDetailPanel = ({ row }: any) => {
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
      <div className="flex flex-col justify-around space-x-6 p-3 md:flex-row">
        <div className="mb-6 w-full md:mb-0 md:w-[500px]">
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
              <div key={index} className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-6">{enroll?.planSnapshot?.title}</span>
                <span className="col-span-4 justify-self-end">
                  {enroll ? parseFloat(enroll?.planSnapshot?.price?.toFixed(2)).toFixed(2) : 0} CAD
                </span>
                <span className="col-span-2 justify-self-end">{enroll?.planSnapshot?.duration} days</span>
              </div>
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
        <div className="w-full md:w-[580px]">
          <h2 className="pb-2 text-center text-lg font-medium">Payment Credentials</h2>
          <hr className="p-2 text-lg font-bold" />
          <div className="">
            <p>
              <span className="font-medium">Retailer ID :</span> {row?.original?.retailer?._id}
            </p>
            <p>
              <span className="font-medium">Payment ID : </span>
              {row?.original?.paymentId}
            </p>
            <p>
              <span className="font-medium">Payment Intent ID : </span>
              {row?.original?.paymentIntentId}
            </p>
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
      searchPlaceHolder="Search By Payment Intent ID"
      searchFieldWidth="250px"
      enableRowNumbers={true}
      // renderDetailPanel={RenderDetailPanel}
    />
  );
}
