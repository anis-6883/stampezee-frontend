'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { useGetAllNotificationQuery } from '@/features/retailer/notification/notificationApi';
import { IQueryType } from '@/types';
import { useState } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import CreateUpdateModel from './CreateUpdateModel';

function capitalizeWords(input: string): string {
  return input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function RegularNotificationTable() {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllNotificationQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    type: 'all',
    ...searchQuery,
  });

  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>{capitalizeWords(row?.original?.title)}</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      enableSorting: false,
      Cell: ({ row }: any) => (
        <div>
          <p>
            {row?.original?.description?.length >= 123 ? `${row?.original?.description?.slice(0, 123)}....` : row?.original?.description}
          </p>
        </div>
      ),
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button className="!m-0 !px-3 !py-2 !text-xs" text="Resend" color="danger" preIcon={<FaRegPaperPlane className="text-base" />} />
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 20,
    },
  ];

  return (
    <>
      <CreateUpdateModel setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />
      <div className="mb-4 flex justify-end">
        <Button
          color="danger"
          onClick={() => setCreateState(true)}
          text="Send Notification"
          preIcon={<FaRegPaperPlane className="text-base" />}
        />
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
        searchPlaceHolder="Search by Title"
      />
    </>
  );
}
