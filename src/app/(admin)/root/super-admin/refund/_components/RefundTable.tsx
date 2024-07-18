'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { useAllRefundBySuperAdminQuery } from '@/features/super-admin/refund/refundApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useState } from 'react';
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
      header: 'Enroll Status',
      accessorKey: 'enrollsubscription.enrollStatus',
    },
    {
      header: 'Refund Amount (CAD)',
      accessorKey: 'refundAmount',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">${row?.original?.refundAmount?.toFixed(2)}</h2>
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
          <Button onClick={() => handleRefund(row.original)} color="danger" text="Refund" />
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
      />
      <RefundConfirmModal
        refundId={refundId}
        refundHandler={() => {}}
        modalState={refundState}
        setModalState={setRefundState}
        isSubmitting={refundSubmitting}
        setIsSubmitting={setRefundSubmitting}
      />
    </>
  );
}
