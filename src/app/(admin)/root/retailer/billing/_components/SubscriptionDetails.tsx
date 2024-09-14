'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useSingleBillingQuery } from '@/features/retailer/billing/billingApi';
import { convertDateByOffset, currentPeriod } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { Badge } from 'rizzui';

export default function SubscriptionDetails({ id, offset }: { id: string; offset: number }) {
  const { data, isLoading, isError } = useSingleBillingQuery(id);
  const { stripe, enrollStatus, validityTo, validityFrom, createdAt, status, balanceInfo, planSnapshot } = data?.data || {};
  const validityToUtc = moment.utc(validityTo).utcOffset(Number(offset));

  if (isLoading || isError) {
    return (
      <>
        <Skeleton className="my-3 h-8 w-32 rounded" />
        <Skeleton className="my-3 h-40 w-96 rounded" />
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3.5">
        <h3 className="text-base">
          <span className="font-semibold">{planSnapshot?.type === 'subscription' ? 'Plan' : 'Add-On'}:</span> {planSnapshot?.title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <div className="flex flex-col justify-between font-medium md:flex-row">
            <span className="font-bold">Subscription ID</span>{' '}
            <span>{isLoading ? <Skeleton className="h-8 w-8 rounded" /> : stripe?.subscriptionId}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Enroll Status</span>{' '}
            {enrollStatus === 'purchase' ? (
              <Badge className="bg-primary text-white">
                <HiShoppingCart className="mr-1 text-xl" /> {_.capitalize(enrollStatus)}
              </Badge>
            ) : enrollStatus === 'upgrade' ? (
              <Badge className="!bg-success text-white">
                <IoArrowUpCircle className="mr-1 text-xl" /> {_.capitalize(enrollStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-danger text-white">
                <IoArrowDownCircle className="mr-1 text-xl" /> {_.capitalize(enrollStatus)}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Balance</span>{' '}
            <span>
              {balanceInfo?.planCurrentPrice} {balanceInfo?.currency}
            </span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Purchased At</span> <span>{convertDateByOffset(createdAt, offset)}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Current Period</span> <span>{currentPeriod(validityFrom, validityTo, offset)}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Plan Status</span>{' '}
            {status === true && moment().isBefore(validityToUtc) ? (
              <Badge className="!bg-success text-white">
                <GiSandsOfTime className="mr-1 text-xl" /> Running
              </Badge>
            ) : (
              <Badge className="!bg-danger text-white">
                <PiFlagCheckeredFill className="mr-1 text-xl" /> Ended
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Next Invoice</span> <span>----</span>
          </div>
        </div>
      </div>
    </div>
  );
}
