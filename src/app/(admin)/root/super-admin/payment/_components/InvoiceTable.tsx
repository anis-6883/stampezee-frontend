import Button from '@/components/Formik/Button';
import { RootState } from '@/features/store';
import {
  useCreateBillingPdfBySuperAdminMutation,
  useGetAllPaymentMethodBySuperAdminQuery,
} from '@/features/super-admin/payment/paymentApi';
import { IQueryType } from '@/types';
import { getFormattedDateForInvoice } from '@/utils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner9 } from 'react-icons/im';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDownloadCloud2Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import Table from '../../../_components/Table';
import PdfPreviewModal from '../../../retailer/billing/_components/PdfPreviewModal';

export function InvoiceTable({ timezone, enrolmentId, enrollStatus }: { timezone: string; enrolmentId: string; enrollStatus: string }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10 });
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const [pdfModalState, setPdfModalState] = useState(false);
  const [selectPdfBtn, setSelectPdfBtn] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectPaymentId, setSelectPaymentId] = useState<any>({});

  const { isLoading, isError, data, isFetching } = useGetAllPaymentMethodBySuperAdminQuery(
    { enrolmentId, queries: query },
    { skip: !accessToken }
  );

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
      <h2 className="my-5 text-lg font-medium">Invoices:</h2>

      {enrollStatus !== 'trial' && (
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
      )}

      <PdfPreviewModal pdfUrl={pdfUrl} modalState={pdfModalState} setModalState={setPdfModalState} loading={isPdfBufferLoading} />
    </div>
  );
}
