'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useCancelSubscriptionMutation,
  useCreateBillingPdfMutation,
  useGetBillingPortalMutation,
  useSingleBillingQuery,
} from '@/features/retailer/billing/billingApi';
import { convertDateByOffset, currentPeriod } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiShoppingCart } from 'react-icons/hi2';
import { ImBin, ImCancelCircle, ImSpinner9 } from 'react-icons/im';
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5';
import { MdAutorenew } from 'react-icons/md';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { RiDownloadCloud2Fill } from 'react-icons/ri';
import { SlLock } from 'react-icons/sl';
import { Badge } from 'rizzui';
import PackageCancelModal from './PackageCancelModal';

// const stripePromise = loadStripe(
//   'pk_test_51Psj0QAUADTrRdVYFcCLaeO8Up43DJu2Kipj8K14ndt1ZVNb3gqOEy1Ms6MAnyFmmU4XNuBPnDR6UYwL5cZFoQ9200o0DFRfqp'
// );

export default function SubscriptionDetails({ id, offset }: { id: string; offset: number }) {
  const t = useTranslations('RetailerBillingDetailsCard');
  const t2 = useTranslations('RetailerBillingDetails');
  const t3 = useTranslations('RetailerBillingInvoiceTable');
  const { push } = useRouter();

  // const { data: allPaymentMethod, isLoading: isAllPaymentMethod } = useGetAllPaymentMethodQuery({
  //   customerId: 'cus_RCz82TruUZHQfB',
  //   limit: 4,
  // });
  const { data, isLoading, isError } = useSingleBillingQuery(id);
  // const [setupPaymentIntent, { data: paymentIntent }] = useSetupPaymentIntentMutation();
  const [createBillingPdf, { data: pdfBuffer, isLoading: isPdfBufferLoading }] = useCreateBillingPdfMutation();
  const [
    cancelSubscription,
    { data: cancelSubscriptionData, error: cancelSubscriptionError, isSuccess, isError: isCancelSubscriptionError },
  ] = useCancelSubscriptionMutation();
  const [getPortal, { data: portalData, isLoading: portalLoading, error: portalError }] = useGetBillingPortalMutation();
  const { stripe, planExists, enrollStatus, validityTo, validityFrom, createdAt, status, balanceInfo, payments, enrollSubscriptions } =
    data?.data || {};
  const validityToUtc = moment.utc(validityTo).utcOffset(Number(offset));
  // const [clientSecret, setClientSecret] = useState('');

  // cancel subscription state
  const [modalState, setModalState] = useState(false);
  const [cancelSubscriptionId, setCancelSubscriptionId] = useState(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [isPlan, setIsPlan] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const res: any = await setupPaymentIntent({});

  //     setClientSecret(res?.data?.data?.client_secret);
  //   })();
  // }, []);

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

  useEffect(() => {
    if (pdfBuffer) {
      const downloadUrl = window.URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    }
  }, [pdfBuffer]);

  const handlePdfDownload = async (id: any) => {
    try {
      await createBillingPdf(id);
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };

  // const appearance: { theme: 'flat' | 'stripe' | 'night' } = {
  //   theme: 'stripe', // Replace 'stripe' with 'flat' or 'night' if you want to try a different theme
  // };

  // // Enable the skeleton loader UI for optimal loading.
  // const loader = 'auto';

  return (
    <div className="w-full">
      {/* subscriptions details  */}

      <div className="mb-3.5">
        {isLoading || isError ? (
          <Skeleton className="my-3 h-8 w-32 rounded" />
        ) : (
          <h3 className="text-lg font-medium">
            {`(${enrollSubscriptions
              ?.filter((enrollSubscription: any) => !enrollSubscription?.deletedByRetailer)
              ?.map((item: any) => item?.title)
              .join(',')})`}
            {/* {planSnapshot?.title}
            <span className="font-semibold">({planSnapshot?.type === 'subscription' ? t2('plan') : t2('addOn')})</span> */}
          </h3>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <div className="flex flex-col justify-between font-medium md:flex-row">
            <span className="font-semibold">{t('subscriptionID')}</span>
            <span>{isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : stripe?.subscriptionId}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-semibold">{t('enrollStatus')}</span>
            {isLoading || isError ? (
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
          {/* <div className="flex items-center justify-between font-medium">
            <span className="font-semibold">{t('balance')}</span>
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <span>
                {balanceInfo?.planCurrentPrice} {balanceInfo?.currency}
              </span>
            )}
          </div> */}
          <div className="flex items-center justify-between font-medium">
            <span className="font-semibold">{t('purchasedAt')}</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{convertDateByOffset(createdAt, offset)}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-semibold">{t('currentPeriod')}</span>{' '}
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <span>{currentPeriod(validityFrom, validityTo, offset)}</span>
            )}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-semibold">{t('planStatus')}</span>
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : status === true && moment().isBefore(validityToUtc) ? (
              <Badge className="!bg-success text-white">
                <GiSandsOfTime className="mr-1 text-xl" /> {t('running')}
              </Badge>
            ) : (
              <Badge className="!bg-danger text-white">
                <PiFlagCheckeredFill className="mr-1 text-xl" /> {t('ended')}
              </Badge>
            )}
          </div>
          {!isLoading && stripe?.renewCancelAt !== null && (
            <div className="flex items-center justify-between font-medium">
              <span className="font-semibold">{t('subscriptionCancelAt')}</span>{' '}
              <span className="text-danger">{convertDateByOffset(stripe?.renewCancelAt, offset)}</span>
            </div>
          )}
          <div className="flex items-center justify-between font-medium">
            <span className="font-semibold">{t('nextInvoice')}</span>
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{convertDateByOffset(validityTo, offset)}</span>}
          </div>
        </div>

        {/* <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <h2 className="my-5 text-lg font-medium">Payment methods</h2>
          <hr />
          {allPaymentMethod?.data?.data?.map((item: any) => (
            <div key={item?.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={
                  'https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13674554/Mastercard_logo.jpg?quality=90&strip=all&crop=0%2C16.666666666667%2C100%2C66.666666666667&w=750'
                }
                alt={'card'}
                style={{ width: '50px', marginRight: '10px' }}
              />
              <div className="flex items-center justify-center">
                <span className="text-base font-medium capitalize">{item?.card?.brand} </span>
                <span className="text-center text-base font-medium capitalize"> ....{4545}</span>
              </div>
            </div>
          ))}
          <div className="">
            <Button type="submit" className="!m-0" color="danger" text="Add Payment Method" preIcon={<HiPlus className="text-base" />} />
          </div>
        </div> */}
      </div>

      {/* Packages  */}
      <h2 className="my-5 text-lg font-medium">{'Enroll Subscriptions'}</h2>
      <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('serialNo')}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Plan / Add-on
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                subscription Item Id
              </th>

              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('action')}
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
                    {t3('noTransaction')}
                  </td>
                </tr>
              ) : (
                enrollSubscriptions?.map((enrollSubscription: any, index: number) => {
                  if (enrollSubscription?.deletedByRetailer) return null;
                  return (
                    <tr
                      key={enrollSubscription?._id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {++index}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {enrollSubscription?.title}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {enrollSubscription?.subscriptionItemId}
                      </td>

                      <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                        {stripe?.renewCancelAt && enrollSubscription?.type === 'addon' ? (
                          <span className="font-semibold text-danger">Renew depend on plan!</span>
                        ) : (
                          <Button
                            disabled={!status}
                            className="!m-0 !px-2 !py-1.5"
                            color="danger"
                            onClick={() => {
                              setModalState(true);
                              enrollSubscription?.type === 'subscription' ? setIsPlan(true) : setIsPlan(false);
                              setCancelSubscriptionId(enrollSubscription?._id);
                            }}
                            text={stripe?.renewCancelAt === null ? 'Remove' : 'Renew'}
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

      {/* invoices  */}

      <h2 className="my-5 text-lg font-medium">{t2('invoices')}</h2>
      <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('serialNo')}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('paymentIntentID')}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('invoiceNumber')}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('amount')}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('createdAt')}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {t3('action')}
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
              {payments.length <= 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                    {t3('noTransaction')}
                  </td>
                </tr>
              ) : (
                payments.map((payment: any, index: number) => {
                  const amount = Number(payment?.amountTotal).toFixed(2);
                  return (
                    <tr
                      key={payment?._id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {++index}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {payment?.paymentIntentId}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {payment?.invoiceNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {amount} {balanceInfo?.currency}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{convertDateByOffset(payment?.createdAt, offset)}</td>
                      <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                        {/* <Link href={payment?.invoicePdf} target="_blank"> */}
                        <Button
                          className="!m-0 !px-2 !py-1.5"
                          color="danger"
                          onClick={() => handlePdfDownload(payment?._id)}
                          text={t3('downloadPdf')}
                          postIcon={
                            isPdfBufferLoading ? (
                              <ImSpinner9 className="animate-spin text-lg" />
                            ) : (
                              <RiDownloadCloud2Fill className="text-lg" />
                            )
                          }
                        />
                        {/* </Link> */}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          )}
        </table>
      </div>

      <div className="mt-14">
        <div className="flex justify-end">
          {isLoading || isError ? (
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
              text={stripe?.renewCancelAt === null ? t2('cancelSubscriptionOrChangeCard') : t2('renewSubscriptionOrChangeCard')}
              postIcon={stripe?.renewCancelAt === null ? <ImCancelCircle className="text-xl" /> : <MdAutorenew className="text-xl" />}
            />
          ) : (
            <Button
              disabled={true}
              className="!m-0"
              color="danger"
              text={t2('subscriptionCanceled')}
              postIcon={<SlLock className="text-xl" />}
            />
          )}
        </div>

        {/* {clientSecret && (
          <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
            <AddPaymentCardForm />
          </Elements>
        )} */}
      </div>

      <PackageCancelModal
        cancelSubscriptionId={cancelSubscriptionId}
        cancelSubscriptionHandler={cancelSubscription}
        modalState={modalState}
        setModalState={setModalState}
        isSubmitting={cancelSubmitting}
        setIsSubmitting={setCancelSubmitting}
        isPlan={isPlan}
        getPortal={getPortal}
        stripe={stripe}
        id={id}
        planExists={planExists}
        enrollSubscriptions={enrollSubscriptions}
      />
    </div>
  );
}
