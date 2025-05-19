'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useCancelSubscriptionMutation,
  useCreateBillingPdfForTrialMutation,
  useCreateBillingPdfMutation,
  useSingleBillingQuery,
} from '@/features/retailer/billing/billingApi';
import { resetState } from '@/features/subscription/subscriptionSlice';
import { getFormattedDateForInvoice } from '@/utils';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImBin, ImSpinner9 } from 'react-icons/im';
import { IoEyeOutline } from 'react-icons/io5';
import { MdAutorenew } from 'react-icons/md';
import { RiDownloadCloud2Fill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import PackageCancelModal from './PackageCancelModal';
import { PaymentMethod } from './PaymentMethod';
import PdfPreviewModal from './PdfPreviewModal';
import { SubscriptionBasicInfo } from './SubscriptionBasicInfo';

const cardImageMap: any = {
  visa: '/images/visa.svg',
  mastercard: '/images/mastercard.svg',
  amex: '/images/amex.svg',
  default: '/images/default-card.svg',
};

export default function SubscriptionDetails({ id, stripePublishKey }: { id: string; stripePublishKey: string }) {
  const t = useTranslations('RetailerBillingDetailsCard');
  const t2 = useTranslations('RetailerBillingDetails');
  const t3 = useTranslations('RetailerBillingInvoiceTable');
  const t4 = useTranslations('RetailerBillingPackagesTable');

  const dispatch = useDispatch();
  const { data: session }: any = useSession();

  const { data, isLoading, isError } = useSingleBillingQuery(id);

  const [createBillingPdf, { data: pdfBuffer, isLoading: isPdfBufferLoading }] = useCreateBillingPdfMutation();
  const [createBillingPdfForTrial, { data: pdfBufferForTrial, isLoading: isPdfBufferLoadingForTrial }] =
    useCreateBillingPdfForTrialMutation();
  const [
    cancelSubscription,
    { data: cancelSubscriptionData, error: cancelSubscriptionError, isSuccess, isError: isCancelSubscriptionError },
  ] = useCancelSubscriptionMutation();

  const { stripe, enrollStatus, createdAt, status, payments, enrollSubscriptions } = data?.data || {};

  const [selectPaymentId, setSelectPaymentId] = useState<any>({});

  const [modalState, setModalState] = useState(false);
  const [pdfModalState, setPdfModalState] = useState(false);
  const [selectPdfBtn, setSelectPdfBtn] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
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
      if (isPlan) {
        dispatch(resetState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelSubscriptionError, dispatch, isCancelSubscriptionError, isSuccess]);

  // Handle Pdf download response

  useEffect(() => {
    if (pdfBuffer) {
      const downloadUrl = window.URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' }));
      if (selectPdfBtn === 'download') {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${getFormattedDateForInvoice(selectPaymentId?.createdAt)}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setSelectPaymentId({});
      } else {
        setPdfUrl(downloadUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfBuffer]);

  // Handle Pdf download for Trial response
  useEffect(() => {
    if (pdfBufferForTrial) {
      const downloadUrl = window.URL.createObjectURL(new Blob([pdfBufferForTrial], { type: 'application/pdf' }));
      if (selectPdfBtn === 'download') {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${getFormattedDateForInvoice(createdAt)}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        setPdfUrl(downloadUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfBufferForTrial]);

  const handlePdfDownload = async (payment: any) => {
    setSelectPaymentId(payment);
    setSelectPdfBtn('download');
    try {
      await createBillingPdf(payment?._id);
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };

  const handlePdfPreview = async (payment: any) => {
    setSelectPdfBtn('preview');
    setPdfModalState(true);
    try {
      await createBillingPdf(payment?._id);
    } catch (err) {
      toast.error('Error occur for invoice preview!');
      console.error('Error Preview invoice:', err);
    }
  };

  const handlePdfDownloadForTrial = async () => {
    setSelectPdfBtn('download');
    try {
      await createBillingPdfForTrial({ id, data: { createdAt } });
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };
  const handlePdfPreviewForTrial = async () => {
    setSelectPdfBtn('preview');
    setPdfModalState(true);
    try {
      await createBillingPdfForTrial({ id, data: { createdAt } });
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };

  return (
    <div className="w-full">
      {/* subscriptions details  */}

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <SubscriptionBasicInfo isLoading={isLoading} isError={isError} data={data?.data} />

        {/* Payment methods  */}
        {enrollStatus !== 'trial' && <PaymentMethod data={data?.data} stripePublishKey={stripePublishKey} />}
      </div>

      {/* Packages  */}
      <h2 className="my-5 text-lg font-medium">{t4('enrollSubscriptions')}</h2>
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
                {t4('subscriptionItemId')}
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
                                Canceled At :{' '}
                                {getFormatDateByTimezone(enrollSubscription?.deletedByRetailerAt, session?.user?.timezone?.label || '')}
                              </span>
                            )}

                            {enrollSubscription?.validAtAfterCancel && (
                              <span className="font-semibold text-black">
                                Expires On :{' '}
                                {getFormatDateByTimezone(enrollSubscription?.validAtAfterCancel, session?.user?.timezone?.label || '')}
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
                            text={t4('remove')}
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

      {enrollStatus !== 'trial' ? (
        <>
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
                            {amount} {payment?.currency}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {getFormatDateByTimezone(payment?.createdAt, session?.user?.timezone?.label || '')}
                          </td>
                          <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                            <Button
                              onClick={() => handlePdfPreview(payment)}
                              tooltip={'View'}
                              color="warning"
                              preIcon={<IoEyeOutline className="text-base" />}
                            />
                            <Button
                              className="!m-0 !px-2 !py-1.5"
                              color="danger"
                              onClick={() => handlePdfDownload(payment)}
                              // text={t3('downloadPdf')}
                              tooltip={t3('downloadPdf')}
                              postIcon={
                                isPdfBufferLoading && selectPaymentId?._id === payment?._id ? (
                                  <ImSpinner9 className="animate-spin text-lg" />
                                ) : (
                                  <RiDownloadCloud2Fill className="text-lg" />
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              )}
            </table>
          </div>
        </>
      ) : (
        <>
          <h2 className="my-5 text-lg font-medium">{t2('invoices')}</h2>
          <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    {t3('serialNo')}
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

              <tbody>
                <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {'01'}
                  </td>

                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {'INV-' + id.slice(-8).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {'0.00'} {'CAD'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getFormatDateByTimezone(createdAt, session?.user?.timezone?.label || '')}
                  </td>
                  <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                    <Button
                      onClick={() => handlePdfPreviewForTrial()}
                      tooltip={'View'}
                      color="warning"
                      preIcon={<IoEyeOutline className="text-base" />}
                    />
                    <Button
                      className="!m-0 !px-2 !py-1.5"
                      color="danger"
                      onClick={() => handlePdfDownloadForTrial()}
                      // text={t3('downloadPdf')}
                      tooltip={t3('downloadPdf')}
                      postIcon={
                        isPdfBufferLoadingForTrial && selectPdfBtn === 'download' ? (
                          <ImSpinner9 className="animate-spin text-lg" />
                        ) : (
                          <RiDownloadCloud2Fill className="text-lg" />
                        )
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <PackageCancelModal
        cancelSubscriptionId={cancelSubscriptionId}
        cancelSubscriptionHandler={cancelSubscription}
        modalState={modalState}
        setModalState={setModalState}
        isSubmitting={cancelSubmitting}
        setIsSubmitting={setCancelSubmitting}
        isPlan={isPlan}
      />

      <PdfPreviewModal
        pdfUrl={pdfUrl}
        modalState={pdfModalState}
        setModalState={setPdfModalState}
        loading={isPdfBufferLoading || isPdfBufferLoadingForTrial}
      />
    </div>
  );
}
