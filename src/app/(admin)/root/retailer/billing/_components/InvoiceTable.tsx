import Button from '@/components/Formik/Button';
import {
  useCreateBillingPdfForTrialMutation,
  useCreateBillingPdfMutation,
  useGetAllPaymentByEnrollIdQuery,
} from '@/features/retailer/billing/billingApi';
import { IQueryType } from '@/types';
import { getFormattedDateForInvoice } from '@/utils';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDownloadCloud2Fill } from 'react-icons/ri';
import Table from '../../../_components/Table';
import PdfPreviewModal from './PdfPreviewModal';

export function InvoiceTable({ enrolmentId, enrollmentData }: { enrolmentId: string; enrollmentData: any }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10 });
  const { data: session }: any = useSession();
  const [selectPaymentId, setSelectPaymentId] = useState<any>({});
  const [pdfModalState, setPdfModalState] = useState(false);
  const [selectPdfBtn, setSelectPdfBtn] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const t2 = useTranslations('RetailerBillingDetails');
  const t3 = useTranslations('RetailerBillingInvoiceTable');

  const { isLoading, isError, data, isFetching } = useGetAllPaymentByEnrollIdQuery({ enrolmentId, queries: query });

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
      await createBillingPdfForTrial({ id: enrollmentData?._id, data: { createdAt: enrollmentData?.createdAt } });
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };
  const handlePdfPreviewForTrial = async () => {
    setSelectPdfBtn('preview');
    setPdfModalState(true);
    try {
      await createBillingPdfForTrial({ id: enrollmentData?._id, data: { createdAt: enrollmentData?.createdAt } });
    } catch (err) {
      toast.error('Error occur for invoice download!');
      console.error('Error downloading invoice:', err);
    }
  };
  const structure = [
    {
      header: 'Payment Intent ID',
      accessorKey: 'paymentIntentId',
    },
    {
      header: 'Invoice Number',
      accessorKey: 'invoiceNumber',
    },
    {
      header: 'Amount',
      accessorKey: 'amountTotal',
      Cell: ({ row }: any) => <div>{`${row?.original?.amountTotal} ${row?.original?.currency}`}</div>,
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handlePdfPreview(row?.original)}
            tooltip={'View'}
            color="warning"
            preIcon={<IoEyeOutline className="text-base" />}
          />
          <Button
            className="!m-0 !px-2 !py-1.5"
            color="danger"
            onClick={() => handlePdfDownload(row?.original)}
            // text="Download PDF"
            tooltip="Download PDF"
            postIcon={
              isPdfBufferLoading && selectPaymentId?._id === row?.original?._id ? (
                <ImSpinner9 className="animate-spin text-lg" />
              ) : (
                <RiDownloadCloud2Fill className="text-lg" />
              )
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {enrollmentData?.enrollStatus !== 'trial' ? (
        <>
          <h2 className="my-5 text-lg font-medium">{t2('invoices')}</h2>
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
                    data: data?.data?.docs || [],
                    pagination: {
                      totalDocuments: data?.data.totalDocs || 0,
                    },
                  }
            }
            structure={structure}
            setQuery={setQuery}
            query={query}
            showGlobalFilter={false}
            enableRowNumbers={true}
          />
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
                    {'INV-' + enrollmentData?._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {'0.00'} {'CAD'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getFormatDateByTimezone(enrollmentData?.createdAt, session?.user?.timezone?.label || '')}
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
