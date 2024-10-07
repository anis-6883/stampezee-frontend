'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { useAllRefundBySuperAdminQuery, useConfirmRefundBySuperAdminMutation } from '@/features/super-admin/refund/refundApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { Badge } from 'rizzui';
import RefundConfirmModal from '../../../_components/RefundConfirmModal';

export default function RefundTable({ offset }: { offset: number }) {
  const [refundState, setRefundState] = useState(false);
  const [refundId, setRefundId] = useState(null);
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllRefundBySuperAdminQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  const [confirmRefundBySuperAdmin, { isSuccess, isError }] = useConfirmRefundBySuperAdminMutation();

  useEffect(() => {
    if (isError) {
      setRefundSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setRefundState(false);
      setRefundId(null);
    }
    if (isSuccess) {
      setRefundSubmitting(false);
      toast.success('Refund completed successfully!');
      setRefundState(false);
      setRefundId(null);
    }
  }, [isSuccess, isError]);
  const structure = [
    {
      header: 'Plan',
      accessorKey: 'enrollsubscription.planSnapshot.title',
    },
    {
      header: 'Validity Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Started At:</span> {convertDateByOffset(row?.original?.enrollsubscription?.validityFrom, offset)}
          </p>
          <p>
            <span className="font-bold">Expired At:</span> {convertDateByOffset(row?.original?.enrollsubscription?.validityTo, offset)}
          </p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 300,
    },
    {
      header: 'Refund Amount',
      accessorKey: 'refundAmount',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">
              {row?.original?.refundAmount?.toFixed(2)} {row?.original?.currency}
            </h2>
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: 'Refund Status',
      accessorKey: 'refundStatus',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.refundStatus === 'pending' ? (
              <Badge className="!bg-warning">
                <GiSandsOfTime className="text-xl" /> {_.capitalize(row?.original?.refundStatus)}
              </Badge>
            ) : (
              <Badge className="!bg-success">
                <IoCheckmarkCircle className="text-xl" /> {_.capitalize(row?.original?.refundStatus)}
              </Badge>
            )}
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },

    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            className="!px-3 !py-2 !text-xs"
            onClick={() => handleRefund(row.original)}
            color="danger"
            text="Refund"
            preIcon={<FaRegPaperPlane className="text-base" />}
          />
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
  ];

  const handleRefund = (rowData: any) => {
    setRefundState(true);
    setRefundId(rowData._id);
  };

  const RenderDetailPanel = ({ row }: any) => {
    return (
      <div className="flex ">
        <div className="flex w-28 flex-col justify-center gap-2 border-r-2">
          <div className="mx-auto">
            {row.original?.enrollsubscription?.retailer?.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original?.enrollsubscription?.retailer?.image}`}
                  alt="image"
                  className="h-full w-12 rounded"
                />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-full w-12 rounded" />
            )}
          </div>
          <div>
            <div className="text-md">
              <p className="text-center font-semibold">{row?.original?.enrollsubscription?.retailer?.storeName}</p>
            </div>
          </div>
        </div>
        <div className="text-md ml-3 text-start">
          <p>
            <span className="font-bold">FullName:</span> {row?.original?.enrollsubscription?.retailer?.fullName}
          </p>
          <p>
            <span className="font-bold">Email:</span> {row?.original?.enrollsubscription?.retailer?.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span>{' '}
            {row?.original?.enrollsubscription?.retailer?.phone ? row?.original?.enrollsubscription?.retailer?.phone : 'N/A'}
          </p>
          <p>
            <span className="font-bold">Country:</span>{' '}
            {row?.original?.enrollsubscription?.retailer?.country ? row?.original?.enrollsubscription?.retailer?.country : 'N/A'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
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
                data: data?.data.docs || [],
                pagination: {
                  totalDocuments: data?.data.totalDocs || 0,
                },
              }
        }
        structure={structure}
        setQuery={setQuery}
        query={query}
        searchPlaceHolder="Search By Payment ID"
        searchFieldWidth="250px"
        renderDetailPanel={RenderDetailPanel}
      />

      <RefundConfirmModal
        refundId={refundId}
        refundHandler={confirmRefundBySuperAdmin}
        modalState={refundState}
        setModalState={setRefundState}
        isSubmitting={refundSubmitting}
        setIsSubmitting={setRefundSubmitting}
      />
    </>
  );
}
