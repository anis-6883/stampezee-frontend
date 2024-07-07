'use client';

import Table from '@/app/(admin)/root/_components/Table';
import {
  useDeleteSubAdminMutation,
  useGetAllSubAdminsQuery,
  useUpdateSubAdminStatusMutation,
} from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import Button from '../../../../../../components/Formik/Button';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModal from './CreateUpdateModal';

export default function SubAdminTable() {
  const [formData, setFormData] = useState({});
  const [deleteSubAdmin, { isSuccess, isError }] = useDeleteSubAdminMutation();
  const [createState, setCreateState] = useState(false);
  const [updateStatus] = useUpdateSubAdminStatusMutation();

  // Deletion State
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Query State
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSubAdminsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  // Handle Delete Response
  useEffect(() => {
    if (isError) {
      setDeleteSubmitting(false);
      toast.error('Something went wrong. Please try again!');
      setDeleteState(false);
      setDeleteId(null);
    }
    if (isSuccess) {
      setDeleteSubmitting(false);
      toast.success('Sub Admin deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Image',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div>
          {row.original.image ? (
            <div>
              <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="w-14 rounded" />
            </div>
          ) : (
            <img src={'/images/profile.png'} alt="image" className="w-14 rounded" />
          )}
        </div>
      ),
    },
    {
      header: 'First Name',
      accessorKey: 'firstName',
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
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

          <Button
            color="danger"
            preIcon={
              <ImBin
                className="text-base"
                onClick={() => {
                  setDeleteState(true);
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
      <div className="mb-5 flex justify-end">
        <Button color="danger" text="Add New Sub-Admin" preIcon={<HiPlus className="text-base" />} onClick={() => setCreateState(true)} />
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
        searchPlaceHolder="Search By Name"
      />

      <CreateUpdateModal setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteSubAdmin}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
