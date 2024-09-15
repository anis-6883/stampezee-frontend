'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/shared/StatusIndicator';
import { routes } from '@/config/routes';
import {
  useDeleteSuperAdminRetailerMutation,
  useGetAllRetailersQuery,
  useUpdateRetailerStatusMutation,
} from '@/features/super-admin/retailer/retailerApi';
import { IQueryType } from '@/types';
import { convertDateByOffset } from '@/utils/getFormatDate';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaInfoCircle } from 'react-icons/fa';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';

export default function RetailerTable({ offset }: { offset: number }) {
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
      toast.success('Retailer deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Retailer Store',
      accessorKey: 'image',
      Cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div>
            {row.original.image ? (
              <div>
                <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}`} alt="image" className="h-8 w-8 rounded" />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
            )}
          </div>
          <div>
            <div className="text-md">
              <p className="text-center font-semibold">{row?.original?.storeName}</p>
            </div>
          </div>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Owner Info',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Name:</span> {row?.original?.firstName} {row?.original?.lastName}
          </p>
          <p>
            <span className="font-bold">Email:</span> {row?.original?.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {row?.original?.dialCode}
            {row?.original?.phone}
          </p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 300,
    },
    {
      header: 'Plan Statistics',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Plan:</span> {row?.original.currentPlan}
          </p>
          <p>
            <span className="font-bold">Total Active Branch:</span> {row?.original.totalActiveBranch}
          </p>
          <p>
            <span className="font-bold">Total Active Stamp:</span> {row?.original.totalActiveStamp}
          </p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 300,
    },
    {
      header: 'Joining Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p> {convertDateByOffset(row?.original?.createdAt, offset)}</p>
        </div>
      ),
      size: 300,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return <SwitchButton updateStatus={updateStatus} id={row?.original?._id} status={row?.original?.status} />;
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
          <Link href={routes.privateRoutes.superAdmin.retailer?.details(row?.original?._id)}>
            <Button color="primary" preIcon={<FaInfoCircle className="text-base" />} tooltip="Details" />
          </Link>
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

          <Button onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} tooltip="Delete" />
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
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:flex-row md:gap-0">
        <StatusIndicator />
        <div>
          <Button
            className="w-full"
            color="danger"
            onClick={() => setCreateState(true)}
            text="Add New Retailer"
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
        searchPlaceHolder="Search By Store, Owner Name & Email"
        searchFieldWidth="330px"
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
