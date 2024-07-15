'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useDeleteStampMutation, useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';

export default function StampTable() {
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllStampsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteStamp, { isSuccess, isError }] = useDeleteStampMutation();

  const handleDelete = async (rowData: any) => {
    setDeleteState(true);
    setDeleteId(rowData._id);
  };

  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setDeleteState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success('Stamp deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Stamp Image',
      accessorKey: 'stampImage',
      Cell: ({ row }: any) => (
        <div>
          <img
            src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.stampImage?.image}`}
            width={50}
            height={50}
            alt="Picture of the author"
          />
        </div>
      ),
    },
    {
      header: 'Branch',
      accessorKey: 'branch.name',
    },

    {
      header: 'Category',
      accessorKey: 'category.name',
    },
    {
      header: 'Reward',
      accessorKey: 'rewardType',
      Cell: ({ row }: any) => (
        <div>{row?.original?.rewardType === 'discount' ? `${row?.original?.discountReward}%` : row?.original?.promotionReward}</div>
      ),
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Link href={routes.retailer.stamp.edit(row.original._id)}>
            <Button color="warning" preIcon={<HiOutlinePencil className="text-base" />} />
          </Link>
          <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
        </div>
      ),
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
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteStamp}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
