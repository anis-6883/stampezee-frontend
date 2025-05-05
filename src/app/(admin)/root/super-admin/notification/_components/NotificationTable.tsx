'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
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
import { Badge } from 'rizzui';
import DeleteConfirmModal from '../../../_components/DeleteConfirmModal';
import CreateUpdateModel from './CreateUpdateModal';

export default function NotificationTable({ timezone, googleMapsApiKey }: { timezone: string; googleMapsApiKey: string }) {
  const [createState, setCreateState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useSuperAdminNotificationsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  const [deleteNotificationBySuperAdmin, { isSuccess, isError }] = useDeleteNotificationBySuperAdminMutation();

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
      toast.success('Notification deleted successfully!');
      setDeleteState(false);
      setDeleteId(null);
    }
  }, [isSuccess, isError]);

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
        <div>
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
