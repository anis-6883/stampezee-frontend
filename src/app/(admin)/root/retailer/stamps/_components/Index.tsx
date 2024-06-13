'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { routes } from '@/config/routes';
import { useDeleteStampMutation, useGetAllStampsQuery } from '@/features/retailer/stamp/stampApi';
import { IQueryType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { ImBin } from 'react-icons/im';

import { HiPlus } from 'react-icons/hi2';
import Button from '../../../_components/Button';

let popup = false;

export default function IndexTable() {
  const router = useRouter();

  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllStampsQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });
  console.log(data?.data, 'useGetAllSubAdminsQuery');

  const [deleteStamp] = useDeleteStampMutation();

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
    },

    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Branch',
      accessorKey: 'branch.name',
    },
    {
      header: 'Stamp Image',
      accessorKey: 'stampImage',
      Cell: ({ row }: any) => (
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.stampImage?.image}`}
            width={50}
            height={50}
            alt="Picture of the author"
          />
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category.name',
    },
    {
      header: 'Reward Type',
      accessorKey: 'rewardType',
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
          {/* <button onClick={() => handleEdit(row.original)}>
            <HiOutlinePencil className="text-base" />
          </button> */}
          <Link onClick={() => handleEdit(row.original)} href={routes.retailer.sub_admin.edit(row.original._id)}>
            <HiOutlinePencil className="text-base" />
          </Link>
          <button>
            <ImBin className="text-base" />
          </button>
        </div>
      ),
    },
  ];
  const handleEdit = (rowData: any) => {
    router.push(routes.retailer.sub_admin.edit(rowData._id));
  };

  // const handleDelete = async (rowData: any) => {
  //   if (popup) return;
  //   toast((t) => {
  //     popup = t.visible;
  //     return AskConfirmation(t, () => deleteStamp({ id: rowData._id }));
  //   });
  // };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => router.push(routes.retailer.stamp.create)} text="Add New Stamp" preIcon={<HiPlus className="text-base" />} />
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
        enableDnD={false}
        // sort={sort}
        sortContext="branchTable"
        enableRowActions={false}
      />
    </>
  );
}
