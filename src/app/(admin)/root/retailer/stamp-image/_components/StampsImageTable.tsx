'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { routes } from '@/config/routes';
import {
  useDeleteStampImageMutation,
  useGetAllStampImagesQuery,
  useUpdateStampImageStatusMutation,
} from '@/features/retailer/stamp-image/stampApi';
import { IQueryType } from '@/types';
import { countDaysLeft } from '@/utils';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';

export default function StampsImageTable() {
  const { data: session }: any = useSession();
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllStampImagesQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteStampImage, { isSuccess, isError }] = useDeleteStampImageMutation();
  const [updateStatus] = useUpdateStampImageStatusMutation();

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

  if (session?.user?.totalCustomStamp === 0) {
    return redirect(routes.privateRoutes.retailer.dashboard);
  }

  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Image',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div>
          <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="h-10 w-10 rounded-full" />
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
      header: 'Validity Date',
      Cell: ({ row }: any) => {
        const countDays = countDaysLeft(row?.original?.enrollSubscription?.validityTo);
        return <span className="font-semibold text-danger">{countDays < 0 ? 'Expired' : `${countDays} days left`}</span>;
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
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              tooltip="Edit"
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

            <Button tooltip="Delete" onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
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
  ];

  return (
    <>
      <CreateUpdateModel setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <StatusIndicator />
        <div>
          <Button
            className="w-full"
            color="danger"
            onClick={() => setCreateState(true)}
            text="Add New Stamp Image"
            preIcon={<HiPlus className="text-base" />}
          />
        </div>
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
        searchPlaceHolder="Search By Stamp Image Title"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteStampImage}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
