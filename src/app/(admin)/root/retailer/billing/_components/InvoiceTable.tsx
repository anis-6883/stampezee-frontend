import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateBillingPdfForTrialMutation, useCreateBillingPdfMutation } from '@/features/retailer/billing/billingApi';
import { getFormattedDateForInvoice } from '@/utils';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDownloadCloud2Fill } from 'react-icons/ri';
import PdfPreviewModal from './PdfPreviewModal';

export function InvoiceTable({ data, isLoading, isError }: { data: any; isLoading: boolean; isError: boolean }) {
  const { data: session }: any = useSession();
  const [selectPaymentId, setSelectPaymentId] = useState<any>({});
  const [pdfModalState, setPdfModalState] = useState(false);
  const [selectPdfBtn, setSelectPdfBtn] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const t2 = useTranslations('RetailerBillingDetails');
  const t3 = useTranslations('RetailerBillingInvoiceTable');

  const [createBillingPdf, { data: pdfBuffer, isLoading: isPdfBufferLoading }] = useCreateBillingPdfMutation();
  const [createBillingPdfForTrial, { data: pdfBufferForTrial, isLoading: isPdfBufferLoadingForTrial }] =
    useCreateBillingPdfForTrialMutation();

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
        link.setAttribute('download', `${getFormattedDateForInvoice(data?.createdAt)}.pdf`);
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
      await createBillingPdfForTrial({ id: data?._id, data: { createdAt: data?.createdAt } });
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };
  const handlePdfPreviewForTrial = async () => {
    setSelectPdfBtn('preview');
    setPdfModalState(true);
    try {
      await createBillingPdfForTrial({ id: data?._id, data: { createdAt: data?.createdAt } });
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };

  return (
    <div>
      {data?.enrollStatus !== 'trial' ? (
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
                  {data?.payments.length <= 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                        {t3('noTransaction')}
                      </td>
                    </tr>
                  ) : (
                    data?.payments.map((payment: any, index: number) => {
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
                    {'INV-' + data?._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {'0.00'} {'CAD'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getFormatDateByTimezone(data?.createdAt, session?.user?.timezone?.label || '')}
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

      <PdfPreviewModal
        pdfUrl={pdfUrl}
        modalState={pdfModalState}
        setModalState={setPdfModalState}
        loading={isPdfBufferLoading || isPdfBufferLoadingForTrial}
      />
    </div>
  );
}
