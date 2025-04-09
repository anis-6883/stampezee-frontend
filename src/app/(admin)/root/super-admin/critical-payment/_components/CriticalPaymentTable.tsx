'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import {
  useGetAllCriticalPaymentQuery,
  useResolveCriticalPaymentMutation,
} from '@/features/super-admin/critical-payment/criticalPaymentApi';
import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GiSandsOfTime } from 'react-icons/gi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { Badge } from 'rizzui';
import ResolveConfirmModal from './ResolveConfirmModal';

export default function CriticalPaymentTable({ offset }: { offset: number }) {
  const [resolveState, setResolveState] = useState(false);
  const [resolveId, setResolveId] = useState(null);
  const [resolveSubmitting, setResolveSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCriticalPaymentQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [resolveCriticalPayment, { isSuccess, isError }] = useResolveCriticalPaymentMutation();

  useEffect(() => {
    if (isError) {
      setResolveSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setResolveState(false);
      setResolveId(null);
    }
    if (isSuccess) {
      setResolveSubmitting(false);
      toast.success('Resolve completed successfully!');
      setResolveState(false);
      setResolveId(null);
    }
  }, [isSuccess, isError]);

  const handleResolve = (rowData: any) => {
    setResolveState(true);
    setResolveId(rowData?.stripeInvoiceId);
  };

  const structure = [
    {
      header: 'Stripe Invoice ID',
      accessorKey: 'stripeInvoiceId',
    },

    {
      header: 'Payment Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="text-white">
              {row?.original?.status === 'resolved' ? (
                <Badge className="!bg-success">
                  <IoCheckmarkCircle className="mr-1 text-xl" /> Resolved
                </Badge>
              ) : (
                <Badge className="!bg-warning">
                  <GiSandsOfTime className="mr-1 text-xl" /> Pending
                </Badge>
              )}
            </div>
          </div>
        );
      },
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },

    {
      header: 'Actions',
      Cell: ({ row }: any) => {
        return row?.original?.status === 'resolved' ? (
          <Button
            disabled={true}
            className="!m-0 !px-2 !py-1.5"
            text="Resolved"
            color="danger"
            preIcon={<IoCheckmarkCircle className="text-xl" />}
          />
        ) : (
          <Button
            onClick={() => handleResolve(row?.original)}
            className="!m-0 !px-2 !py-1.5"
            text="Resolve"
            color="danger"
            preIcon={<IoCheckmarkCircle className="text-xl" />}
          />
        );
      },
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
  ];

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
        searchPlaceHolder="Search By Stripe Invoice ID"
        searchFieldWidth="340px"
        enableRowNumbers={true}
      />
      <ResolveConfirmModal
        resolveId={resolveId}
        resolveHandler={resolveCriticalPayment}
        setIsSubmitting={setResolveSubmitting}
        isSubmitting={resolveSubmitting}
        modalState={resolveState}
        setModalState={setResolveState}
      />
    </>
  );
}
