'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useGetAllCustomerQuery } from '@/features/retailer/customer/customerApi';
import { useDeleteSubAdminMutation, useUpdateSubAdminStatusMutation } from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';

export default function CustomerTable() {
  const { data: session }: any = useSession();
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
  const { data, isLoading, isFetching } = useGetAllCustomerQuery({
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

  useEffect(() => {
    if (!session?.user?.plan) {
      return redirect(routes.privateRoutes.retailer.dashboard);
    }
  }, [session]);

  const structure = [
    {
      header: 'Info',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <div>
            {row.original.image ? (
              <div>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.customer.image}`}
                  alt="image"
                  className="h-full w-20 rounded"
                />
              </div>
            ) : (
              <img src={'/images/profile.png'} alt="image" className="h-full w-20 rounded" />
            )}
          </div>
          <div>
            <div className="text-md mx-auto text-start">
              <p>
                <span className="font-bold">Name:</span> {row?.original.customer.fullName}
              </p>
              <p>
                <span className="font-bold">Email:</span> {row?.original.customer.email}
              </p>
              <p>
                <span className="font-bold">Phone:</span> {row?.original.customer.phone}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Address',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Country:</span> {row?.original.customer.country}
          </p>
          {row?.original.customer.address?.name && (
            <p>
              <span className="font-bold">Address:</span> {row?.original.customer.address?.name}
            </p>
          )}
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
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
