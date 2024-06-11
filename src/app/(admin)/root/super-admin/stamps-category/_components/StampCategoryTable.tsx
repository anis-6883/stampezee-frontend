'use client';

import Table from '@/app/(admin)/root/_components/Table';
import {
  useDeleteSuperAdminStampImageCategoryMutation,
  useGetAllSuperAdminStampImagesCategoryQuery,
  useUpdateSuperAdminCategoryStatusMutation,
} from '@/features/super-admin/stamp-category/stampCategoryApi';
import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import Button from '../../../_components/Button';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';

function capitalizeWords(input: string): string {
  return input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function StampCategoryTable() {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSuperAdminStampImagesCategoryQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteSuperAdminStampCategory, { isSuccess, isError }] = useDeleteSuperAdminStampImageCategoryMutation();
  const [updateStatus] = useUpdateSuperAdminCategoryStatusMutation();

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
      toast.success('Stamps Image deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Name',
      accessorKey: 'name',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{capitalizeWords(row?.original?.name)}</p>
        </div>
      ),
    },
    {
      header: 'Image',
      accessorKey: 'image',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <img
            src={row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : '/images/categoryPlaceHolder.png'}
            alt="image"
            className="h-10 w-10 rounded-full"
          />
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: false,
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
          <Button
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
              });
              setCreateState(true);
            }}
          />

          <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
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
      <CreateUpdateModel setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateState(true)} text="Add New Stamp Image" preIcon={<HiPlus className="text-base" />} />
      </div>
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
        enableDnD={true}
        // sort={sort}
        sortContext="branchTable"
        enableRowActions={false}
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteSuperAdminStampCategory}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
