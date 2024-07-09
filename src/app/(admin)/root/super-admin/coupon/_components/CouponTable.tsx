'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { useDeleteCouponMutation, useGetAllCouponQuery, useUpdateCouponStatusMutation } from '@/features/super-admin/coupon/couponApi';
import { IQueryType } from '@/types';
import getFormattedDate from '@/utils/get-formatted-date';
import { convertDateByOffset } from '@/utils/getFormatDate';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';

export default function CouponTable({ offset }: { offset: number }) {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllCouponQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const [deleteCoupon, { isSuccess, isError }] = useDeleteCouponMutation();
  const [updateStatus] = useUpdateCouponStatusMutation();

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
      toast.success('Coupon deleted successfully!');
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
      header: 'Code',
      accessorKey: 'code',
    },
    {
      header: 'Discount',
      accessorKey: 'discountType',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Type:</span> {row?.original.discountType}
          </p>
          <p>
            <span className="font-bold">Amount:</span> {row?.original.discount} {row?.original.discountType === 'flat' ? 'CAD' : '%'}
          </p>
        </div>
      ),
    },
    {
      header: 'Limit',
      accessorKey: 'limit',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Limit:</span> {row?.original.limit}
          </p>
          <p>
            <span className="font-bold">Min. Purchased Amount:</span> {row?.original.minPurchaseAmount}
          </p>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Validity Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Started At:</span> {convertDateByOffset(row?.original?.startedAt, offset)}
          </p>
          <p>
            <span className="font-bold">Expired At:</span> {convertDateByOffset(row?.original?.expiredAt, offset)}
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
          <Button
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
                validDateRange: `${getFormattedDate(row?.original?.startedAt, offset)} to ${getFormattedDate(row?.original?.expiredAt, offset)}`,
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
        <Button color="danger" onClick={() => setCreateState(true)} text="Add New Coupon" preIcon={<HiPlus className="text-base" />} />
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
        searchPlaceHolder="Search By Title & Code"
        searchFieldWidth="250px"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteCoupon}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
