'use client';

import AskConfirmation from '@/app/(admin)/root/_components/AskConfirmation';
import Table from '@/app/(admin)/root/_components/Table';
import { routes } from '@/config/routes';
import { useAllBranchQuery, useDeleteBranchMutation } from '@/features/retailer/branch/branchApi';
import { IQueryType } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import Button from '../../../_components/Button';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';

let popup = false;

export default function BranchTable() {
  const [deleteBranch] = useDeleteBranchMutation();
  const [modalState, setModalState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useAllBranchQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: 'Title',
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

  const handleDelete = async (rowData: any) => {
    if (popup) return;
    toast((t) => {
      popup = t.visible;
      return AskConfirmation(t, () => deleteBranch({ _id: rowData._id }));
    });
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
        enableDnD={false}
        sortContext="branchTable"
        enableRowActions={false}
      />
      <DeleteConfirmModal deleteHandler={deleteBranch} modalState={modalState} setModalState={setModalState} deleteId={deleteId} />
      {/* <Modal isOpen={modalState} onClose={() => setModalState(false)}>
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-danger">
              <BsExclamationTriangle className="text-base" /> Delete Confirmation
            </h3>

            <ActionIcon size="sm" variant="text" onClick={() => setModalState(false)}>
              <HiMiniXCircle className="text-2xl text-danger" />
            </ActionIcon>
          </div>
          <p className="text-base font-medium">Do you want to delete?</p>
          <div className="mt-8 flex justify-end gap-2">
            <Button color="danger" onClick={() => setModalState(false)} text="Not Now" />
            <Button color="primary" onClick={() => setModalState(false)} text="Yes, Confirm" />
          </div>
        </div>
      </Modal> */}
    </>
  );
}
