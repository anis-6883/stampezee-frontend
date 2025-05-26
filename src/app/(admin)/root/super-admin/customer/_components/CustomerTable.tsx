'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import StatusIndicator from '@/components/StatusIndicator';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import {
  useCustomerStatusUpdateBySuperAdminMutation,
  useDeleteCustomerBySuperAdminMutation,
  useGetAllCustomerBySuperAdminQuery,
} from '@/features/super-admin/customer/customerApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaInfoCircle } from 'react-icons/fa';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import { IoCloseCircleSharp, IoInformationCircleOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Tooltip } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';
import DatePicker from '@/components/Formik/DatePicker';

export default function CustomerTable({ timezone }: { timezone: string }) {
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
  const { data, isLoading, isFetching } = useGetAllCustomerBySuperAdminQuery(queryObject, { skip: !accessToken });
  // const { data, isLoading, isFetching } = useGetAllCustomerBySuperAdminQuery(
  //   {
  //     page: query.pageIndex + 1,
  //     limit: query.pageSize,
  //     ...searchQuery,
  //   },
  //   { skip: !accessToken }
  // );

  const [deleteCustomerBySuperAdmin, { isSuccess, isError }] = useDeleteCustomerBySuperAdminMutation();
  const [customerStatusUpdateBySuperAdmin] = useCustomerStatusUpdateBySuperAdminMutation();

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
      toast.success('Customer deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  const structure = [
    {
      header: 'Info',
      accessorKey: 'name',
      Cell: ({ row }: any) => (
        <div className="">
          <p>
            <span className="font-bold">Name:</span> {row?.original?.fullName}
          </p>
          <p>
            <span className="font-bold">Email:</span> {row?.original?.contactEmail ?? row?.original?.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span>{' '}
            {row?.original?.dialCode && row?.original?.phone
              ? `${row?.original?.dialCode}
            ${row?.original?.phone}`
              : 'N/A'}
          </p>
          <p>
            <span className="font-bold">Country:</span> {row?.original?.country ? row?.original?.country : 'N/A'}
          </p>
        </div>
      ),
      size: 250,
    },
    {
      header: 'Joined Date',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p> {getFormatDateByTimezone(row?.original?.createdAt, timezone)}</p>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Statistics',
      accessorKey: 'totalCollectStamp',
      Cell: ({ row }: any) => (
        <div className="">
          <p className="flex items-center gap-1">
            <span className="font-bold">Total Stamp Cards Collected:</span> {row?.original?.totalStampsCollected}
            <Tooltip
              color="danger"
              className={`bg-danger text-white`}
              size="sm"
              placement="top"
              content={`Active: ${row?.original?.totalActiveStampsCollected}, Deleted: ${row?.original?.totalStampsCollected - row?.original?.totalActiveStampsCollected}`}
              arrowClassName={`fill-danger`}
            >
              <span>
                <IoInformationCircleOutline className="text-lg text-danger " />
              </span>
            </Tooltip>
          </p>
          <p>
            <span className="font-bold">Total Stamps:</span> {row?.original?.totalScan}
          </p>
          <p>
            <span className="font-bold">Total Reward Collected:</span> {row?.original?.totalRewardCollect}
          </p>
        </div>
      ),
      size: 200,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ row }: any) => {
        return <SwitchButton updateStatus={customerStatusUpdateBySuperAdmin} id={row?.original?._id} status={row?.original?.status} />;
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
          <Link href={routes.privateRoutes.superAdmin.customer?.details(row?.original?._id)}>
            <Button color="primary" preIcon={<FaInfoCircle className="text-base" />} tooltip="Details" />
          </Link>
          <Button
            tooltip="Edit"
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row?.original,
                address: row?.original?.address?.name,
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
      <div className="mb-5 flex flex-col justify-between gap-y-3 md:gap-y-4 lg:flex-row lg:gap-0">
        <StatusIndicator />
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-shrink-0 items-center gap-2">
            <h5 className="text-nowrap text-base font-medium">Filter by Joined Date :</h5>
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
            text="Add New Customer"
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
        searchPlaceHolder="Search By Customer Name"
        searchFieldWidth="300px"
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteCustomerBySuperAdmin}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
