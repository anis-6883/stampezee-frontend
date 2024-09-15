'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useGetBillingPortalMutation, useSingleBillingQuery } from '@/features/retailer/billing/billingApi';
import { convertDateByOffset, currentPeriod } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { ImCancelCircle } from 'react-icons/im';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { MdAutorenew } from 'react-icons/md';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { SlLock } from 'react-icons/sl';
import { Badge } from 'rizzui';

export default function SubscriptionDetails({ id, offset }: { id: string; offset: number }) {
  const { push } = useRouter();
  const { data, isLoading, isError } = useSingleBillingQuery(id);
  const [getPortal, { data: portalData, isLoading: portalLoading, error: portalError }] = useGetBillingPortalMutation();
  const { stripe, enrollStatus, validityTo, validityFrom, createdAt, status, balanceInfo, planSnapshot } = data?.data || {};
  const validityToUtc = moment.utc(validityTo).utcOffset(Number(offset));

  useEffect(() => {
    if (portalError) {
      const myError = portalError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (!portalLoading && !portalError) {
      if (portalData?.data?.url) {
        push(portalData?.data?.url);
      }
    }
  }, [portalData, portalError, portalLoading, push]);

  // if (isLoading || isError) {
  //   return (
  //     <>
  //       <Skeleton className="my-3 h-8 w-32 rounded" />
  //       <Skeleton className="my-3 h-64 w-96 rounded" />
  //     </>
  //   );
  // }

  return (
    <div className="w-full">
      <div className="mb-3.5">
        {isLoading ? (
          <Skeleton className="my-3 h-8 w-32 rounded" />
        ) : (
          <h3 className="text-base">
            {planSnapshot?.title} <span className="font-semibold">({planSnapshot?.type === 'subscription' ? 'Plan' : 'AddOn'})</span>
          </h3>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <div className="flex flex-col justify-between font-medium md:flex-row">
            <span className="font-bold">Subscription ID</span>
            <span>{isLoading ? <Skeleton className="h-6 w-32 rounded" /> : stripe?.subscriptionId}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Enroll Status</span>
            {isLoading ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : enrollStatus === 'purchase' ? (
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
            <span className="font-bold">Balance</span>
            {isLoading ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <span>
                {balanceInfo?.planCurrentPrice} {balanceInfo?.currency}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Purchased At</span>{' '}
            {isLoading ? <Skeleton className="h-6 w-32 rounded" /> : <span>{convertDateByOffset(createdAt, offset)}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Current Period</span>{' '}
            {isLoading ? <Skeleton className="h-6 w-32 rounded" /> : <span>{currentPeriod(validityFrom, validityTo, offset)}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Plan Status</span>
            {isLoading ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : status === true && moment().isBefore(validityToUtc) ? (
              <Badge className="!bg-success text-white">
                <GiSandsOfTime className="mr-1 text-xl" /> Running
              </Badge>
            ) : (
              <Badge className="!bg-danger text-white">
                <PiFlagCheckeredFill className="mr-1 text-xl" /> Ended
              </Badge>
            )}
          </div>
          {!isLoading && stripe?.renewCancelAt !== null && (
            <div className="flex items-center justify-between font-medium">
              <span className="font-bold">Subscription Cancel At</span>{' '}
              <span className="text-danger">{convertDateByOffset(stripe?.renewCancelAt, offset)}</span>
            </div>
          )}
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Next Invoice</span> <span>----</span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex">
          {isLoading ? (
            <Skeleton className="h-6 w-32 rounded" />
          ) : status === true && moment().isBefore(validityToUtc) ? (
            <Button
              onClick={() =>
                getPortal({
                  customerId: stripe?.customerId,
                  returnUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${routes.privateRoutes.retailer.billing.details(id)}`,
                })
              }
              isSubmitting={portalLoading}
              className="!m-0"
              color="danger"
              text={stripe?.renewCancelAt === null ? 'Cancel Subscription Or Change Card' : 'Renew Subscription Or Change Card'}
              postIcon={stripe?.renewCancelAt === null ? <ImCancelCircle className="text-xl" /> : <MdAutorenew className="text-xl" />}
            />
          ) : (
            <Button
              disabled={true}
              className="!m-0"
              color="danger"
              text="Subscription Canceled"
              postIcon={<SlLock className="text-xl" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
