'use client';

import Table from '@/app/(admin)/root/_components/Table';

import {
  useDeleteSuperAdminStampImageMutation,
  useUpdateSortingImageMutation,
  useUpdateStampImageStatusMutation,
} from '@/features/super-admin/stamp-image/stampImageApi';
import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import Button from '../../../../../../components/Formik/Button';

import { useGetAllSubscriptionQuery } from '@/features/super-admin/Subscription/stampImageApi';
import { Badge } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import CreateUpdateModel from './CreateUpdateModel';

export default function StampsImageTable() {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSubscriptionQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteSuperAdminStampImage, { isSuccess, isError }] = useDeleteSuperAdminStampImageMutation();
  const [updateStatus] = useUpdateStampImageStatusMutation();
  const [sort] = useUpdateSortingImageMutation();

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
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Info',
      Cell: ({ row }: any) => (
        <div className="">
          <div>
            <h2>
              <span className="font-semibold">Duration: </span>
              {row.original.duration} days
            </h2>
            <h2>
              <span className="font-semibold">Allowed Branch: </span>
              {row.original.allowTotalBranch ? row.original.allowTotalBranch : 'N/A'}
            </h2>
            <h2>
              <span className="font-semibold">Allowed Members: </span>
              {row.original.allowTotalTeamMember ? row.original.allowTotalTeamMember : 'N/A'}
            </h2>
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'start',
      },
    },
    {
      header: 'Price(CAD)',
      accessorKey: 'price',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2>${row?.original?.price}</h2>
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
      header: 'Type',
      accessorKey: 'type',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.type === 'addon' ? (
              <Badge className="bg-primary">{row?.original?.type}</Badge>
            ) : (
              <Badge className="bg-danger">{row?.original?.type}</Badge>
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
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                descriptions: row.original.descriptions,
                image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
              });
              setCreateState(true);
            }}
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
      <CreateUpdateModel setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />

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
        searchPlaceHolder="Search By Title"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteSuperAdminStampImage}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
