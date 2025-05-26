'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/StatusIndicator';
import { RootState } from '@/features/store';
import { useDeleteCouponMutation, useGetAllCouponQuery, useUpdateCouponStatusMutation } from '@/features/super-admin/coupon/couponApi';
import { IQueryType } from '@/types';
import getFormattedDateByTimezone from '@/utils/get-formatted-date-By-Timezone';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import { useSelector } from 'react-redux';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';
import DatePicker from '@/components/Formik/DatePicker';
import { IoCloseCircleSharp } from 'react-icons/io5';

export default function CouponTable({ timezone }: { timezone: string }) {
  const [dateRange, setDateRange] = useState('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};

  const queryObject: any = {
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  };
  if (start) {
    queryObject.start = start;
  }
  if (end) {
    queryObject.end = end;
  }
  const { data, isLoading, isFetching } = useGetAllCouponQuery(queryObject, { skip: !accessToken });

  // const { data, isLoading, isFetching } = useGetAllCouponQuery(
  //   {
  //     page: query.pageIndex + 1,
  //     limit: query.pageSize,
  //     ...searchQuery,
  //   },
  //   { skip: !accessToken }
  // );

  const [deleteCoupon, { isSuccess, isError }] = useDeleteCouponMutation();
  const [updateStatus] = useUpdateCouponStatusMutation();

  const handleDelete = async (rowData: any) => {
    setDeleteState(true);
    setDeleteId(rowData._id);
  };

  useEffect(() => {
    if (dateRange) {
      if (dateRange.includes('to')) {
        const dates = dateRange.replaceAll(' ', '').split('to');
        setStart(dates[0]);
        setEnd(dates[1]);
      }
    } else {
      setStart('');
      setEnd('');
    }
  }, [dateRange]);

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
      header: 'Coupon',
      accessorKey: 'code',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Title:</span> {row?.original.title}
          </p>
          <p>
            <span className="font-bold">Code:</span> {row?.original.code}
          </p>
        </div>
      ),
    },
    {
      header: 'Discount',
      accessorKey: 'discountType',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Type:</span> {row?.original?.discountType}
          </p>
          <p>
            <span className="font-bold">Amount:</span> {row?.original?.discount} {row?.original?.discountType === 'flat' ? 'CAD' : '%'}
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
            <span className="font-bold">Total User Limit:</span>{' '}
            {row?.original?.totalUserLimit === 0 ? 'Unlimited' : row?.original?.totalUserLimit}
          </p>
          <p>
            <span className="font-bold">Per User Limit:</span>{' '}
            {row?.original?.perUserLimit === 0 ? 'Unlimited' : row?.original?.perUserLimit}
          </p>
          <p>
            <span className="font-bold">Allow Retailer:</span>{' '}
            {row?.original?.allowFor === 'all' ? 'All' : row?.original?.allowedRetailers?.length}
          </p>
          <p>
            <span className="font-bold">Applied Package:</span> {row?.original?.applicablePackages?.length}
          </p>
        </div>
      ),
      size: 320,
    },
    {
      header: 'Validity Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>
            <span className="font-bold">Start:</span> {getFormatDateByTimezone(row?.original?.startedAt, timezone)}
          </p>
          <p>
            <span className="font-bold">Expire:</span> {getFormatDateByTimezone(row?.original?.expiredAt, timezone)}
          </p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 250,
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
            tooltip="Edit"
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                validDateRange: `${getFormattedDateByTimezone(row?.original?.startedAt, timezone)} to ${getFormattedDateByTimezone(row?.original?.expiredAt, timezone)}`,
              });
              setCreateState(true);
            }}
          />

          <Button tooltip="Delete" onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
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
      <div className="mb-5 flex flex-col justify-between gap-y-3 lg:flex-row lg:gap-0">
        <StatusIndicator />
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-shrink-0 items-center gap-2">
            <h5 className="text-base font-medium">Filter by Start Date :</h5>
            {/* date picker */}
            <div className="relative">
              {/* close button */}
              {dateRange.length > 0 && (
                <div className="absolute -right-1 -top-2 text-lg font-semibold">
                  <IoCloseCircleSharp onClick={() => setDateRange('')} className="cursor-pointer text-2xl text-[#dc2626]" />
                </div>
              )}
              <DatePicker value={dateRange} range={true} changeHandler={setDateRange} />
            </div>
          </div>
          <Button
            className="!mb-0 w-full"
            color="danger"
            onClick={() => setCreateState(true)}
            text="Add New Coupon"
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
        searchPlaceHolder="Search By Coupon Title or Code"
        searchFieldWidth="280px"
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
