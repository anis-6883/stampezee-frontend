import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateBillingPdfBySuperAdminMutation } from '@/features/super-admin/payment/paymentApi';
import { getFormattedDateForInvoice } from '@/utils';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDownloadCloud2Fill } from 'react-icons/ri';
import PdfPreviewModal from '../../../retailer/billing/_components/PdfPreviewModal';

export function InvoiceTable({
  data,
  isLoading,
  isError,
  timezone,
}: {
  data: any;
  isLoading: boolean;
  isError: boolean;
  timezone: string;
}) {
  const [pdfModalState, setPdfModalState] = useState(false);
  const [selectPdfBtn, setSelectPdfBtn] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectPaymentId, setSelectPaymentId] = useState<any>({});

  const [createBillingPdfBySuperAdmin, { data: pdfBuffer, isLoading: isPdfBufferLoading }] = useCreateBillingPdfBySuperAdminMutation();

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

  return (
    <div>
      {data?.enrollStatus !== 'trial' && (
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
                  {data?.payments.length <= 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                        <div className="flex flex-col justify-center py-5">
                          <img src="/images/no-transaction.svg" alt="image" className="m-auto h-40 w-40" />
                          <span>No transaction happened yet!</span>
                        </div>
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

      <PdfPreviewModal pdfUrl={pdfUrl} modalState={pdfModalState} setModalState={setPdfModalState} loading={isPdfBufferLoading} />
    </div>
  );
}
