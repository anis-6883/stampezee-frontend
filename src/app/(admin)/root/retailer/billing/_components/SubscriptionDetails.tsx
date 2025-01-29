'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useCancelSubscriptionMutation,
  useCreateBillingPdfMutation,
  useDetachPaymentMethodMutation,
  useGetAllPaymentMethodQuery,
  useGetBillingPortalMutation,
  useSetDefaultPaymentMethodMutation,
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

const cardImageMap: any = {
  visa: '/images/visa.svg',
  mastercard: '/images/mastercard.svg',
  amex: '/images/amex.svg',
  default: '/images/default-card.svg',
};

export default function SubscriptionDetails({ id, offset, stripePublishKey }: { id: string; offset: number; stripePublishKey: string }) {
  const t = useTranslations('RetailerBillingDetailsCard');
  const t2 = useTranslations('RetailerBillingDetails');
  const t3 = useTranslations('RetailerBillingInvoiceTable');
  const t4 = useTranslations('RetailerBillingPackagesTable');
  const { push } = useRouter();

  const [
    setDefaultPaymentMethod,
    { error: defaultPaymentMethodError, isSuccess: defaultPaymentMethodSuccess, isError: isDefaultPaymentMethodError },
  ] = useSetDefaultPaymentMethodMutation();

  const [
    detachPaymentMethod,
    { error: detachPaymentMethodError, isSuccess: detachPaymentMethodSuccess, isError: isDetachPaymentMethodError },
  ] = useDetachPaymentMethodMutation();

  const { data, isLoading, isError } = useSingleBillingQuery(id);

  const [createBillingPdf, { data: pdfBuffer, isLoading: isPdfBufferLoading }] = useCreateBillingPdfMutation();
  const [
    cancelSubscription,
    { data: cancelSubscriptionData, error: cancelSubscriptionError, isSuccess, isError: isCancelSubscriptionError },
  ] = useCancelSubscriptionMutation();
  const [getPortal, { data: portalData, isLoading: portalLoading, error: portalError }] = useGetBillingPortalMutation();
  const { stripe, planExists, enrollStatus, validityTo, validityFrom, createdAt, status, balanceInfo, payments, enrollSubscriptions } =
    data?.data || {};
  const validityToUtc = moment.utc(validityTo).utcOffset(Number(offset));
  const [selectPaymentId, setSelectPaymentId] = useState('');

  const [modalState, setModalState] = useState(false);
  const [cancelSubscriptionId, setCancelSubscriptionId] = useState(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [isPlan, setIsPlan] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ name: '', type: '' });

  const [addPaymentCardModal, setAddPaymentCardModal] = useState(false);

  const [defaultPaymentSubmitting, setDefaultPaymentSubmitting] = useState(false);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string | null>(null);

  const { data: allPaymentMethod, isLoading: isAllPaymentMethod } = useGetAllPaymentMethodQuery(
    {
      customerId: stripe?.customerId,
      limit: 10,
    },
    { skip: !stripe?.customerId }
  );

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

  // Handle default payment method Response
  useEffect(() => {
    if (isDefaultPaymentMethodError) {
      setDefaultPaymentSubmitting(false);
      const myError = defaultPaymentMethodError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
      setDefaultPaymentId(null);
    }
    if (defaultPaymentMethodSuccess) {
      setDefaultPaymentSubmitting(false);
      toast.success('Add default card successfully!');
      setDefaultPaymentId(null);
    }
  }, [defaultPaymentMethodError, isDefaultPaymentMethodError, defaultPaymentMethodSuccess]);

  // Handle detach payment method Response
  useEffect(() => {
    if (isDetachPaymentMethodError) {
      const myError = detachPaymentMethodError as SerializedError;
      toast.error(myError?.data?.message || 'Something went wrong!');
    }
    if (detachPaymentMethodSuccess) {
      toast.success('Delete card successfully!');
    }
  }, [detachPaymentMethodError, detachPaymentMethodSuccess, isDetachPaymentMethodError]);

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

  // Handle Pdf download response

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
    setSelectPaymentId(id);
    try {
      await createBillingPdf(id);
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };

  const handleSetDefaultPaymentMethod = async ({ paymentMethodId, customerId }: { paymentMethodId: string; customerId: string }) => {
    setDefaultPaymentSubmitting(true);
    setDefaultPaymentId(paymentMethodId);
    await setDefaultPaymentMethod({ paymentMethodId, customerId });
  };

  const handleDetachPaymentMethod = async (paymentMethodId: string) => {
    await detachPaymentMethod({ paymentMethodId });
  };

  return (
    <div className="w-full">
      {/* subscriptions details  */}

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
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

        {/* Payment methods  */}
        {/* <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <h2 className="border-b-[1px] pb-1 text-lg font-medium">Payment Methods</h2>

          {isAllPaymentMethod ? (
            [1, 2, 3, 4]?.map((item) => <Skeleton key={item} className="h-10 w-60 rounded" />)
          ) : allPaymentMethod?.data?.length === 0 ? (
            <div className="text-center text-base font-semibold text-black">No Data Available</div>
          ) : (
            <>
              {allPaymentMethod?.data?.map((item: any) => (
                <div key={item?.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img
                    src={cardImageMap.hasOwnProperty(item?.card?.brand) ? cardImageMap[item?.card?.brand] : cardImageMap['default']}
                    alt={'card'}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                  <div className="flex items-center justify-center">
                    <span className="text-base font-medium capitalize">{item?.card?.brand} </span>
                    <span className="text-center text-base font-medium capitalize"> ....{item?.card?.last4}</span>
                  </div>
                  {allPaymentMethod?.data?.length > 1 ? (
                    <>
                      {item?.isDefault ? (
                        <Badge className="ml-5 !bg-[#FF7C56] text-white">Default</Badge>
                      ) : status === true && moment().isBefore(validityToUtc) ? (
                        <Dropdown placement="bottom-start" className="ml-10">
                          <Dropdown.Trigger>
                            <BsThreeDotsVertical className=" text-base" />
                          </Dropdown.Trigger>
                          <Dropdown.Menu className="w-[170px]">
                            <Dropdown.Item
                              onClick={() => handleSetDefaultPaymentMethod({ paymentMethodId: item?.id, customerId: item?.customer })}
                              className="hover:bg-gray-200"
                            >
                              <div className="flex cursor-pointer items-center justify-center text-base">
                                <MdAddCard className=" text-base" />
                                <span className="ml-3 text-[14px] font-normal text-black">Set as default</span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDetachPaymentMethod(item?.id)} className="hover:bg-gray-200">
                              <div className="flex cursor-pointer items-center justify-center text-base">
                                <RiDeleteBackLine className=" text-base" />
                                <span className="ml-3 text-[14px] font-normal text-black">Delete</span>
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : null}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </>
          )}

          {status === true && moment().isBefore(validityToUtc) && (
            <div className="flex items-center justify-end">
              <Button
                onClick={() => setAddPaymentCardModal(true)}
                type="submit"
                className="!m-0 !px-2.5 !py-2"
                color="danger"
                text="Add New Card"
                preIcon={<HiPlus className="text-base" />}
              />
            </div>
          )}

          <AddPaymentCardModal
            modalState={addPaymentCardModal}
            setModalState={setAddPaymentCardModal}
            customerId={stripe?.customerId}
            stripePublishKey={stripePublishKey}
          />
        </div> */}
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
                        {stripe?.renewCancelAt && enrollSubscription?.type === 'addon' && planExists ? (
                          <span className="font-semibold text-danger">{t4('renewStatus')}</span>
                        ) : (
                          <Button
                            disabled={!status}
                            className="!m-0 !px-2 !py-1.5"
                            color="danger"
                            onClick={() => {
                              setModalState(true);
                              if (enrollSubscription?.type === 'subscription') {
                                setIsPlan(true);
                                setSelectedItem({ name: '', type: '' });
                              } else {
                                setIsPlan(false);
                                if (enrollSubscription?.slug === 'branch') {
                                  setSelectedItem({ name: enrollSubscription?.branch[0]?.name, type: 'branch' });
                                }
                                if (enrollSubscription?.slug === 'stamp') {
                                  console.log('dfdf', enrollSubscription?.stamp);
                                  setSelectedItem({ name: enrollSubscription?.stamp[0]?.title, type: 'stamp' });
                                }
                                if (enrollSubscription?.slug === 'custom_stamp_image') {
                                  setSelectedItem({ name: enrollSubscription?.stamp_image[0]?.title, type: 'stamp image' });
                                }
                              }
                              setCancelSubscriptionId(enrollSubscription?._id);
                            }}
                            text={stripe?.renewCancelAt === null ? t4('remove') : t4('renew')}
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
                            isPdfBufferLoading && selectPaymentId === payment?._id ? (
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
        selectedItem={selectedItem}
      />
    </div>
  );
}
