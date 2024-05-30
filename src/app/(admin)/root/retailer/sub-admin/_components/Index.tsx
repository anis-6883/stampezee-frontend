'use client';

import AskConfirmation from '@/app/(admin)/root/_components/AskConfirmation';
import Table from '@/app/(admin)/root/_components/Table';
import { routes } from '@/config/routes';
import { useDeleteSubAdminMutation, useGetAllSubAdminsQuery } from '@/features/retailer/sub-admin/subAdminApi';
import { Branch, IQueryType } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';

let popup = false;

export default function BranchTable() {
  const router = useRouter();

  const [modalState, setModalState] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Branch>>({
    _id: '',
    name: '',
    address: '',
    longitude: '',
    latitude: '',
    status: true, // true and false
  });

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSubAdminsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  console.log(data?.data, 'useGetAllSubAdminsQuery');

  const [deleteSubAdmin] = useDeleteSubAdminMutation();

  // const formatDate = (dateString: string) => {
  //   const options = { day: 'numeric', month: 'long', year: 'numeric' };
  //   return new Date(dateString).toLocaleDateString('en-US', options);
  // };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const structure = [
    {
      header: 'First Name',
      accessorKey: 'firstName',
    },

    {
      header: 'Last Name',
      accessorKey: 'lastName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      Cell: ({ row }: any) => <span>{formatDate(row.original.createdAt)}</span>,
    },

    {
      header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row.original)}>
            <HiOutlinePencil className="text-base" />
          </button>
          <button onClick={() => handleDelete(row.original)}>
            <ImBin className="text-base" />
          </button>
        </div>
      ),
    },
  ];
  const handleEdit = (rowData: any) => {
    router.push(routes.retailer.sub_admin.edit(rowData._id));
  };

  const handleDelete = async (rowData: any) => {
    if (popup) return;
    toast((t) => {
      popup = t.visible;
      return AskConfirmation(t, () => deleteSubAdmin({ id: rowData._id }));
    });
  };

  return (
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
      enableDnD={false}
      // sort={sort}
      sortContext="branchTable"
      enableRowActions={false}
    />
  );
}
