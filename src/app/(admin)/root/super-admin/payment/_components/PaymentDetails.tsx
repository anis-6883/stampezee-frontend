'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { SerializedError } from '@/features/api/apiSlice';
import { RootState } from '@/features/store';
import { useCancelSubscriptionByAdminMutation, useSingleSubscriptionPaymentQuery } from '@/features/super-admin/payment/paymentApi';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImBin } from 'react-icons/im';
import { MdAutorenew } from 'react-icons/md';
import { useSelector } from 'react-redux';
import PackageCancelModal from '../../../retailer/billing/_components/PackageCancelModal';
import { InvoiceTable } from './InvoiceTable';
import { PaymentBasicInfo } from './PaymentBasicInfo';
import { PaymentMethod } from './PaymentMethod';

export default function PaymentDetails({ id, timezone }: { id: string; timezone: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);

  const [
    cancelSubscriptionByAdmin,
    { data: cancelSubscriptionData, error: cancelSubscriptionError, isSuccess, isError: isCancelSubscriptionError },
  ] = useCancelSubscriptionByAdminMutation();
  const { data, isLoading, isError } = useSingleSubscriptionPaymentQuery(id, { skip: !accessToken });
  const { stripe, enrollStatus, status, enrollSubscriptions } = data?.data || {};

  // cancel subscription state
  const [modalState, setModalState] = useState(false);
  const [cancelSubscriptionId, setCancelSubscriptionId] = useState(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [isPlan, setIsPlan] = useState(false);

  // Handle cancel subscription Response
  useEffect(() => {
    if (isCancelSubscriptionError) {
      setCancelSubmitting(false);
      const myError = cancelSubscriptionError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
      setModalState(false);
      setCancelSubscriptionId(null);
    }
    if (isSuccess) {
      setCancelSubmitting(false);
      toast.success(cancelSubscriptionData?.message || 'Subscription cancel successfully!');
      setModalState(false);
      setCancelSubscriptionId(null);
    }
  }, [cancelSubscriptionData?.message, cancelSubscriptionError, isCancelSubscriptionError, isSuccess]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PaymentBasicInfo isLoading={isLoading} isError={isError} data={data?.data} timezone={timezone} />

        {/* Payment methods  */}
        {enrollStatus !== 'trial' && <PaymentMethod data={data?.data} />}
      </div>

      <h2 className="my-5 text-lg font-medium">{'Enroll Subscriptions'}</h2>
      <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Serial No.
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Plan / Add-on
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                subscription Item Id
              </th>

              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          {isLoading || isError ? (
            <tbody>
              <tr>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {enrollSubscriptions?.length <= 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                    No transaction happened yet!
                  </td>
                </tr>
              ) : (
                enrollSubscriptions?.map((enrollSubscription: any, index: number) => {
                  return (
                    <tr
                      key={enrollSubscription?._id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {++index}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {enrollSubscription?.type === 'subscription' ? (
                          enrollSubscription?.deletedByRetailerAt ? (
                            <span className="line-through">{enrollSubscription?.title}</span>
                          ) : (
                            enrollSubscription?.title
                          )
                        ) : enrollSubscription?.validAtAfterCancel && new Date(enrollSubscription?.validAtAfterCancel) < new Date() ? (
                          <span className="line-through">{enrollSubscription?.title}</span>
                        ) : (
                          enrollSubscription?.title
                        )}
                      </td>

                      {enrollStatus === 'trial' ? (
                        <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          <span>N/A</span>
                        </td>
                      ) : (
                        <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {enrollSubscription?.type === 'subscription' ? (
                            enrollSubscription?.deletedByRetailerAt ? (
                              <span className="line-through">{enrollSubscription?.subscriptionItemId}</span>
                            ) : (
                              enrollSubscription?.subscriptionItemId
                            )
                          ) : enrollSubscription?.validAtAfterCancel && new Date(enrollSubscription?.validAtAfterCancel) < new Date() ? (
                            <span className="line-through">{enrollSubscription?.subscriptionItemId}</span>
                          ) : (
                            enrollSubscription?.subscriptionItemId
                          )}
                        </td>
                      )}

                      <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                        {enrollSubscription?.deletedByRetailerAt || enrollSubscription?.validAtAfterCancel ? (
                          <div className="flex flex-col gap-y-1">
                            {enrollSubscription?.deletedByRetailerAt && (
                              <span className="font-semibold text-danger">
                                Canceled At : {getFormatDateByTimezone(enrollSubscription?.deletedByRetailerAt, timezone)}
                              </span>
                            )}

                            {enrollSubscription?.validAtAfterCancel && (
                              <span className="font-semibold text-black">
                                Expires On : {getFormatDateByTimezone(enrollSubscription?.validAtAfterCancel, timezone)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Button
                            disabled={!status || enrollStatus === 'trial'}
                            className="!m-0 !px-2.5 !py-1.5"
                            color="danger"
                            onClick={() => {
                              setModalState(true);
                              setCancelSubscriptionId(enrollSubscription?._id);
                              if (enrollSubscription?.type === 'subscription') setIsPlan(true);
                              else setIsPlan(false);
                            }}
                            text={'Remove'}
                            postIcon={
                              stripe?.renewCancelAt === null ? <ImBin className="text-base" /> : <MdAutorenew className="text-xl" />
                            }
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          )}
        </table>
      </div>

      <InvoiceTable isLoading={isLoading} isError={isError} data={data?.data} timezone={timezone} />

      <PackageCancelModal
        cancelSubscriptionId={cancelSubscriptionId}
        cancelSubscriptionHandler={cancelSubscriptionByAdmin}
        modalState={modalState}
        setModalState={setModalState}
        isSubmitting={cancelSubmitting}
        setIsSubmitting={setCancelSubmitting}
        isPlan={isPlan}
      />
    </div>
  );
}
