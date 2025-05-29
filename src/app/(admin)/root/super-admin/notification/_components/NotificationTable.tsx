'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { RootState } from '@/features/store';
import {
  useDeleteNotificationBySuperAdminMutation,
  useSuperAdminNotificationsQuery,
} from '@/features/super-admin/notification/notificationApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from 'react-icons/fa6';
import { ImBin } from 'react-icons/im';
import { LuClock4 } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { Badge } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import CreateUpdateModel from './CreateUpdateModal';
import { IoCloseCircleSharp } from 'react-icons/io5';
import DatePicker from '@/components/Formik/DatePicker';
import { IoMdClose } from 'react-icons/io';

export default function NotificationTable({ timezone, googleMapsApiKey }: { timezone: string; googleMapsApiKey: string }) {
  const [dateRange, setDateRange] = useState('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
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
  const { data, isLoading, isFetching } = useSuperAdminNotificationsQuery(queryObject, { skip: !accessToken });
  // const { data, isLoading, isFetching } = useSuperAdminNotificationsQuery(
  //   {
  //     page: query.pageIndex + 1,
  //     limit: query.pageSize,
  //     ...searchQuery,
  //   },
  //   { skip: !accessToken }
  // );
  const [deleteNotificationBySuperAdmin, { isSuccess, isError }] = useDeleteNotificationBySuperAdminMutation();

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
      toast.success('Notification deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    const element = document.querySelector('.mantine-hnifc4');
    if (element) element.textContent = 'SI No.';
  }, []);

  const structure = [
    {
      header: 'Store / Admin',
      accessorKey: 'retailer.storeName',
      Cell: ({ row }: any) =>
        row?.original?.retailer ? (
          <div className="flex items-center gap-2">
            <div>
              {row?.original?.retailer?.image ? (
                <div>
                  <img
                    src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row?.original?.retailer?.image}`}
                    alt="image"
                    className="h-8 w-8 rounded"
                  />
                </div>
              ) : (
                <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
              )}
            </div>
            <div>
              <div className="text-md">
                <p className="text-center font-semibold">{row?.original?.retailer?.storeName}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {' '}
            <p className="text-center font-semibold">Super Admin</p>{' '}
          </div>
        ),
      size: 200,
    },
    {
      header: 'Title',
      accessorKey: 'title',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{row?.original?.title}</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{row?.original?.description?.length >= 60 ? `${row?.original?.description?.slice(0, 60)}....` : row?.original?.description}</p>
        </div>
      ),
    },
    {
      header: 'Notification Type',
      accessorKey: 'type',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.type === 'all' ? (
            <Badge className="!bg-danger text-white">{_.capitalize(row?.original?.type)}</Badge>
          ) : (
            <Badge className="bg-primary text-white">{_.capitalize(row?.original?.type)}</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Image',
      accessorKey: 'image',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <img src={row.original.image ?? '/images/no-img.png'} alt="image" className="h-16 w-16 rounded-md" />
        </div>
      ),
    },
    {
      header: (
        <span className="flex items-center gap-x-2">
          <FaRegPaperPlane className="text-sm" /> Sent Time / <LuClock4 className="text-lg" /> Scheduled At
        </span>
      ),
      accessorKey: 'scheduleAt',
      Cell: ({ row }: any) =>
        row?.original?.scheduleAt && new Date(row?.original?.scheduleAt) > new Date() ? (
          <div className="text-md mx-auto flex items-center gap-x-2 text-start">
            {getFormatDateByTimezone(row?.original?.scheduleAt, timezone)} <LuClock4 className="text-lg" />
          </div>
        ) : (
          <div className="text-md mx-auto flex items-center gap-x-2 text-start">
            {getFormatDateByTimezone(row?.original?.createdAt, timezone)} <FaRegPaperPlane className="text-sm" />
          </div>
        ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 150,
    },

    {
      header: 'Actions',

      Cell: ({ row }: any) => (
        <Button tooltip="Delete" onClick={() => handleDelete(row.original)} color="danger" preIcon={<ImBin className="text-base" />} />
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'start',
      },
      size: 150,
    },
  ];

  return (
    <>
      <div className="mb-5 flex flex-col justify-end gap-y-3 md:flex-row md:gap-0">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-shrink-0 items-center gap-2">
            <h5 className="text-base font-medium">Filter by Sent Date :</h5>
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
            className="w-full"
            color="danger"
            onClick={() => setCreateState(true)}
            text="Send Notification"
            preIcon={<FaRegPaperPlane className="text-base" />}
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
        searchPlaceHolder="Search by Notification Title or Store Name"
        searchFieldWidth="350px"
        enableRowNumbers={true}
      />

      <CreateUpdateModel
        googleMapsApiKey={googleMapsApiKey}
        setFormData={setFormData}
        formData={formData}
        modalState={createState}
        setModalState={setCreateState}
      />

      <DeleteConfirmModal
        deleteId={deleteId}
        deleteHandler={deleteNotificationBySuperAdmin}
        modalState={deleteState}
        setModalState={setDeleteState}
        isSubmitting={deleteSubmitting}
        setIsSubmitting={setDeleteSubmitting}
      />
    </>
  );
}
