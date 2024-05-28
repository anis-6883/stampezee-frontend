'use client';

import AskConfirmation from '@/app/(admin)/root/_components/AskConfirmation';
import Table from '@/app/(admin)/root/_components/Table';
import { routes } from '@/config/routes';
import { useDeleteBranchMutation } from '@/features/retailer/branch/branchApi';
import { useGetAllSubAdminsQuery } from '@/features/retailer/sub-admin/subAdminApi';
import { IQueryType } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';

let popup = false;

export default function MainTable() {
  const router = useRouter();

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSubAdminsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  const [deleteBranch] = useDeleteBranchMutation();

  const structure = [
    {
      header: 'Title',
      accessorKey: 'name',
    },
    {
      header: 'Address',
      accessorKey: 'address',
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.address.name.length > 60 ? `${row?.original?.address.name.substring(0, 60)}...` : row?.original?.address.name}
        </div>
      ),
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
    router.push(routes.retailer.branch.edit(rowData._id));
  };

  const handleDelete = async (rowData: any) => {
    if (popup) return;
    toast((t) => {
      popup = t.visible;
      return AskConfirmation(t, () => deleteBranch({ _id: rowData._id }));
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
