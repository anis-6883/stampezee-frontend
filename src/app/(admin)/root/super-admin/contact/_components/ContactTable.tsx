'use client';

import Table from '@/app/(admin)/root/_components/Table';
import Button from '@/components/Formik/Button';
import { RootState } from '@/features/store';
import { useGetAllContactBySuperAdminQuery } from '@/features/super-admin/contact/contactApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useState } from 'react';
import { IoEyeOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import ContactDetailsModal from './ContactDetailsModal';

export default function ContactTable({ timezone }: { timezone: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const [modalState, setModalState] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllContactBySuperAdminQuery(
    {
      page: query.pageIndex + 1,
      limit: query.pageSize,
      ...searchQuery,
    },
    { skip: !accessToken }
  );

  const structure = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      Cell: ({ row }: any) => {
        return <div>{row.original.phone ? `${row.original.dialCode} ${row.original.phone}` : 'N/A'} </div>;
      },
    },
    {
      header: 'Message',
      accessorKey: 'message',
      Cell: ({ row }: any) => {
        return <div>{row.original.message?.length > 26 ? `${row?.original?.message?.slice(0, 26)}...` : row.original.message} </div>;
      },
    },
    {
      header: 'Sent At',
      Cell: ({ row }: any) => (
        <div className="text-md mx-auto text-start">
          <p>{getFormatDateByTimezone(row?.original?.createdAt, timezone)}</p>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
      size: 230,
    },
    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => {
              setFormData({
                ...row.original,
              });
              setModalState(true);
            }}
            color="primary"
            preIcon={<IoEyeOutline className="text-base" />}
            tooltip="Details"
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
        enableRowNumbers
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
        searchPlaceHolder="Search By Name, Store Or Email"
        searchFieldWidth="280px"
      />
      <ContactDetailsModal modalState={modalState} setModalState={setModalState} message={formData?.message || ''} />
    </>
  );
}
