'use client';

import Table from '@/app/(admin)/root/_components/Table';

import { IQueryType } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';

import Button from '@/components/Formik/Button';
import {
  useDeleteSuperAdminRetailerMutation,
  useGetAllRetailersQuery,
  useUpdateRetailerStatusMutation,
} from '@/features/super-admin/retailer/retailerApi';
import { HiPlus } from 'react-icons/hi2';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';

export default function CouponTable() {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllRetailersQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  if (!isLoading) {
    console.log('Data: ', data);
  }

  const [deleteRetailer, { isSuccess, isError }] = useDeleteSuperAdminRetailerMutation();

  const [updateStatus] = useUpdateRetailerStatusMutation();

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
      header: 'Info',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <div>
            {row.original.image ? (
              <div>
                <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="h-full w-20 rounded" />
              </div>
            ) : (
              <img src={'/images/profile.png'} alt="image" className="h-full w-20 rounded" />
            )}
          </div>
          <div>
            <div className="text-md mx-auto text-start">
              <p>
                <span className="font-bold">Store Name:</span> {row?.original.storeName}
              </p>
              <p>
                <span className="font-bold">Name:</span> {row?.original.firstName} {row?.original.lastName}
              </p>
              <p>
                <span className="font-bold">Email:</span> {row?.original.email}
              </p>
              <p>
                <span className="font-bold">Phone:</span> {row?.original.phone}
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
            <span className="font-bold">Country:</span> {row?.original.country}
          </p>
          <p>
            <span className="font-bold">City:</span> {row?.original.city}
          </p>
          <p>
            <span className="font-bold">Province:</span> {row?.original.province}
          </p>
          <p>
            <span className="font-bold">Postal Code:</span> {row?.original.postalCode}
          </p>
          <p>
            <span className="font-bold">Address:</span> {row?.original.address}
          </p>
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
      Cell: ({ row }: any) => {
        return <SwitchButton updateStatus={updateStatus} id={row?.original?._id} status={row?.original?.status} />;

        // return row?.original?.status ? <div>Yes</div> : <div>No</div>;
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
        <Button onClick={() => setCreateState(true)} text="Add New Coupon" preIcon={<HiPlus className="text-base" />} />
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
        searchPlaceHolder="Search By Name, Store, Email"
        searchFieldWidth="270px"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteRetailer}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
