'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import DatePicker from '@/components/Formik/DatePicker';
import StatusIndicator from '@/components/StatusIndicator';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import {
  useDeleteSuperAdminRetailerMutation,
  useGetAllRetailersQuery,
  useUpdateRetailerStatusMutation,
} from '@/features/super-admin/retailer/retailerApi';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaInfoCircle } from 'react-icons/fa';
import { HiOutlinePencil } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';
import { ImBin } from 'react-icons/im';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import SwitchButton from '../../../_components/SwitchButton';
import CreateUpdateModel from './CreateUpdateModel';
import { IoMdClose } from 'react-icons/io';

export default function RetailerTable({ timezone, googleMapsApiKey }: { timezone: string; googleMapsApiKey: string }) {
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

  const { data, isLoading, isFetching, refetch } = useGetAllRetailersQuery(queryObject, { skip: !accessToken });
  // const { data, isLoading, isFetching, refetch } = useGetAllRetailersQuery(
  //   {
  //     page: query.pageIndex + 1,
  //     limit: query.pageSize,
  //     ...searchQuery,
  //     start.length> 0 && start,
  //     end.length> 0 && end,
  //   },
  //   { skip: !accessToken }
  // );

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

  console.log(dateRange);
  const { data: subscriptions } = useGetSubscriptionQuery(undefined);

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
              <p className="text-center font-semibold">
                {row?.original?.storeName?.length > 26 ? `${row?.original?.storeName?.slice(0, 26)}...` : row?.original?.storeName}
              </p>
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
            <span className="font-bold">Name:</span>{' '}
            {row?.original?.firstName?.length > 26 ? `${row?.original?.firstName?.slice(0, 26)}...` : row?.original?.firstName}{' '}
            {row?.original?.lastName?.length > 26 ? `${row?.original?.lastName?.slice(0, 26)}...` : row?.original?.lastName}
          </p>
          <p>
            <span className="font-bold">Email:</span> {row?.original?.email}
          </p>
          <p>
            <span className="font-bold">Join Date:</span> {getFormatDateByTimezone(row?.original?.createdAt, timezone)}
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
      Cell: ({ row }: any) => {
        let currentPlan = '';
        if (row?.original.currentPlan) {
          currentPlan = subscriptions?.data?.find(
            (item: any) => item?.type === 'subscription' && item?.slug === row?.original.currentPlan
          )?.title;
        } else {
          currentPlan = 'No Enrollment Yet';
        }

        return (
          <div className="text-md mx-auto text-start">
            <p className="flex items-center gap-x-1">
              <span className="font-bold">Plan:</span>
              <span className={`${!currentPlan && 'text-danger'}`}>{currentPlan}</span>
            </p>
            <p>
              <span className="font-bold">Total Active Branch:</span> {row?.original.totalActiveBranch}
            </p>
            <p>
              <span className="font-bold">Total Active Stamp Cards:</span> {row?.original.totalActiveStamp}
            </p>
          </div>
        );
      },

      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 200,
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
      <CreateUpdateModel
        googleMapsApiKey={googleMapsApiKey}
        setFormData={setFormData}
        formData={formData}
        modalState={createState}
        setModalState={setCreateState}
      />
      <div className="mb-5 flex flex-col justify-between gap-y-3 lg:flex-row lg:gap-0">
        <StatusIndicator />
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-shrink-0 items-center gap-2">
            <h5 className="text-base font-medium">Filter by Join Date :</h5>
            {/* date picker */}
            <div className="relative overflow-hidden rounded-md">
              {/* close button */}
              {dateRange.length > 0 && (
                <div
                  onClick={() => setDateRange('')}
                  className="absolute right-0 top-0 flex h-full w-9 cursor-pointer items-center justify-center bg-[#dc2626] text-lg font-semibold"
                >
                  <IoMdClose className="cursor-pointer text-white" />
                </div>
              )}
              <DatePicker
                className="min-w-60 pr-8 text-sm placeholder:text-[12px]"
                value={dateRange}
                range={true}
                changeHandler={setDateRange}
              />
            </div>
          </div>
          <Button
            className="!mb-0 w-full"
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
        searchPlaceHolder="Search By Store, Owner Name Or Email"
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
