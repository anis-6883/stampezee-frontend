'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { routes } from '@/config/routes';
import { useAllBranchQuery, useDeleteBranchMutation, useUpdateBranchStatusMutation } from '@/features/retailer/branch/branchApi';
import { IQueryType } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import Button from '../../../_components/Button';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';

export default function BranchTable() {
  const [deleteBranch, { isSuccess, isError }] = useDeleteBranchMutation();
  const [updateStatus] = useUpdateBranchStatusMutation();
  const [modalState, setModalState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });

  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBranchQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  // Handle Delete Response
  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setModalState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success('Branch deleted successfully!');
      setModalState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Address',
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.address.name.length > 60 ? `${row?.original?.address.name.substring(0, 60)}...` : row?.original?.address.name}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => <SwitchButton updateStatus={updateStatus} id={row?.original?._id} status={row?.original?.status} />,
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
          <Link href={routes.retailer.branch.edit(row.original._id)}>
            <Button color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
          </Link>

          <Button
            color="danger"
            preIcon={
              <ImBin
                className="text-base"
                onClick={() => {
                  setModalState(true);
                  setDeleteId(row.original._id);
                }}
              />
            }
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
        enableDnD={false}
        sortContext="branchTable"
        enableRowActions={false}
        searchPlaceHolder="Search By Name"
      />

      <DeleteConfirmModal
        deleteHandler={deleteBranch}
        modalState={modalState}
        setModalState={setModalState}
        deleteId={deleteId}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
