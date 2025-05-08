'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { SerializedError } from '@/features/api/apiSlice';
import {
  useCancelSubscriptionByAdminMutation,
  useCreateBillingPdfBySuperAdminMutation,
  useDetachPaymentMethodByAdminMutation,
  useGetAllPaymentMethodByAdminQuery,
  useGetRetailerBillingPortalMutation,
  useSetDefaultPaymentMethodByAdminMutation,
  useSingleSubscriptionPaymentQuery,
} from '@/features/super-admin/payment/paymentApi';
import { getFormattedDateForInvoice } from '@/utils';
import { currentPeriodByTimezone, getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiPlus, HiShoppingCart } from 'react-icons/hi2';
import { ImBin, ImSpinner9 } from 'react-icons/im';
import { IoArrowDownCircle, IoArrowUpCircle, IoEyeOutline } from 'react-icons/io5';
import { MdAddCard, MdAutorenew } from 'react-icons/md';
import { PiFlagCheckeredFill } from 'react-icons/pi';
import { RiDeleteBackLine, RiDownloadCloud2Fill } from 'react-icons/ri';
import { Badge, Dropdown } from 'rizzui';
import PackageCancelModal from '../../../retailer/billing/_components/PackageCancelModal';
import PdfPreviewModal from '../../../retailer/billing/_components/PdfPreviewModal';
import AddPaymentCardModal from './AddPaymentCardModal';

const cardImageMap: any = {
  visa: '/images/visa.svg',
  mastercard: '/images/mastercard.svg',
  amex: '/images/amex.svg',
  default: '/images/default-card.svg',
};

export default function PaymentDetails({ id, timezone, stripePublishKey }: { id: string; timezone: string; stripePublishKey: string }) {
  const { push } = useRouter();

  const [
    setDefaultPaymentMethod,
    { error: defaultPaymentMethodError, isSuccess: defaultPaymentMethodSuccess, isError: isDefaultPaymentMethodError },
  ] = useSetDefaultPaymentMethodByAdminMutation();

  const [
    detachPaymentMethod,
    { error: detachPaymentMethodError, isSuccess: detachPaymentMethodSuccess, isError: isDetachPaymentMethodError },
  ] = useDetachPaymentMethodByAdminMutation();

  const [
    cancelSubscriptionByAdmin,
    { data: cancelSubscriptionData, error: cancelSubscriptionError, isSuccess, isError: isCancelSubscriptionError },
  ] = useCancelSubscriptionByAdminMutation();
  const [createBillingPdfBySuperAdmin, { data: pdfBuffer, isLoading: isPdfBufferLoading }] = useCreateBillingPdfBySuperAdminMutation();
  const { data, isLoading, isError } = useSingleSubscriptionPaymentQuery(id);
  const [getPortal, { data: portalData, isLoading: portalLoading, error: portalError }] = useGetRetailerBillingPortalMutation();
  const {
    stripe,
    planExists,
    enrollStatus,
    validityTo,
    validityFrom,
    createdAt,
    status,
    balanceInfo,
    enrollSubscriptions,
    retailer,
    payments,
  } = data?.data || {};

  const validityToUtc = moment.tz(validityTo, timezone).utc();
  // const validityToUtc = moment.utc(validityTo).utcOffset(Number(offset));
  const [selectPaymentId, setSelectPaymentId] = useState<any>({});

  // cancel subscription state
  const [modalState, setModalState] = useState(false);
  const [pdfModalState, setPdfModalState] = useState(false);
  const [selectPdfBtn, setSelectPdfBtn] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [cancelSubscriptionId, setCancelSubscriptionId] = useState(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [isPlan, setIsPlan] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ name: '', type: '' });

  const [addPaymentCardModal, setAddPaymentCardModal] = useState(false);

  const [defaultPaymentSubmitting, setDefaultPaymentSubmitting] = useState(false);
  const [defaultPaymentId, setDefaultPaymentId] = useState<string | null>(null);

  const { data: allPaymentMethod, isLoading: isAllPaymentMethod } = useGetAllPaymentMethodByAdminQuery(
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

  const handlePdfDownload = async (payment: any) => {
    setSelectPaymentId(payment);
    setSelectPdfBtn('download');
    try {
      await createBillingPdfBySuperAdmin(payment?._id);
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };

  const handlePdfPreview = async (payment: any) => {
    setSelectPdfBtn('preview');
    setPdfModalState(true);
    try {
      await createBillingPdfBySuperAdmin(payment?._id);
    } catch (err) {
      toast.error('Error occur for invoice preview!');
      console.error('Error Preview invoice:', err);
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <div className="flex flex-col items-center justify-between font-medium md:flex-row">
            <span className="font-bold">Store</span>{' '}
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <div className="flex items-center gap-x-1">
                {retailer?.image ? (
                  <div>
                    <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${retailer?.image}`} alt="image" className="h-8 w-8 rounded" />
                  </div>
                ) : (
                  <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
                )}
                {retailer?.storeName}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between font-medium md:flex-row">
            <span className="font-bold">Subscription ID</span>
            <span>
              {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : stripe?.subscriptionId ? stripe?.subscriptionId : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Enroll Status</span>{' '}
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

          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Purchased At</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{getFormatDateByTimezone(createdAt, timezone)}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Current Period</span>{' '}
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <span>{currentPeriodByTimezone(validityFrom, validityTo, timezone)}</span>
            )}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Billing Cycle</span>{' '}
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : status === true && moment().isBefore(validityToUtc) ? (
              <Badge className="!bg-success text-white">
                <GiSandsOfTime className="mr-1 text-xl" /> Running
              </Badge>
            ) : (
              <Badge className="!bg-danger text-white">
                <PiFlagCheckeredFill className="mr-1 text-xl" /> Cancelled
              </Badge>
            )}
          </div>
          {!isLoading && stripe?.renewCancelAt !== null && (
            <div className="flex items-center justify-between font-medium">
              <span className="font-semibold">Subscription Cancel At</span>{' '}
              <span className="text-danger">{getFormatDateByTimezone(stripe?.renewCancelAt, timezone)}</span>
            </div>
          )}
          {!stripe?.renewCancelAt && (
            <div className="flex items-center justify-between font-medium">
              {enrollStatus === 'trial' ? (
                <span className="font-semibold">{'Expired At'}</span>
              ) : (
                <span className="font-semibold">{'Next Invoice'}</span>
              )}
              {isLoading || isError ? (
                <Skeleton className="h-6 w-32 rounded" />
              ) : (
                <span>{getFormatDateByTimezone(validityTo, timezone)}</span>
              )}
            </div>
          )}
        </div>

        {/* Payment methods  */}
        {enrollStatus !== 'trial' && (
          <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
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
          </div>
        )}
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
                        {enrollSubscription?.deletedByRetailerAt ? (
                          <div className="flex flex-col gap-y-1">
                            <span className="font-semibold text-danger">
                              Canceled At : {getFormatDateByTimezone(enrollSubscription?.deletedByRetailerAt, timezone)}
                            </span>
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

      {enrollStatus !== 'trial' && (
        <>
          <h2 className="my-5 text-lg font-medium">Invoices:</h2>
          <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    Serial No.
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    Payment Intent ID
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    Invoice Number
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="whitespace-nowrap px-6 py-3">
                    Created At
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
                  {payments.length <= 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                        <div className="flex flex-col justify-center py-5">
                          <img src="/images/no-transaction.svg" alt="image" className="m-auto h-40 w-40" />
                          <span>No transaction happened yet!</span>
                        </div>
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
                          <td className="whitespace-nowrap px-6 py-4">{getFormatDateByTimezone(payment?.createdAt, timezone)}</td>
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
                              // text="Download PDF"
                              tooltip="Download PDF"
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
      )}

      <PackageCancelModal
        cancelSubscriptionId={cancelSubscriptionId}
        cancelSubscriptionHandler={cancelSubscriptionByAdmin}
        modalState={modalState}
        setModalState={setModalState}
        isSubmitting={cancelSubmitting}
        setIsSubmitting={setCancelSubmitting}
        isPlan={isPlan}
      />

      <PdfPreviewModal pdfUrl={pdfUrl} modalState={pdfModalState} setModalState={setPdfModalState} loading={isPdfBufferLoading} />
    </div>
  );
}
