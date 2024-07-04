'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useGetAllSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { IQueryType } from '@/types';
import { useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { Badge } from 'rizzui';
import Button from '../../../../../../components/Formik/Button';
import CreateUpdateModel from './CreateUpdateModel';

export default function StampsImageTable() {
  const [formData, setFormData] = useState({});
  const [createState, setCreateState] = useState(false);
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllSubscriptionQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Info',
      Cell: ({ row }: any) => (
        <div className="">
          <div>
            <h2>
              <span className="font-semibold">Duration: </span>
              {row.original.duration} days
            </h2>
            {row.original.type === 'subscription' ? (
              <>
                <h2>
                  <span className="font-semibold">Allowed Branch: </span>
                  {row.original.allowTotalBranch ?? 'N/A'}
                </h2>
                <h2>
                  <span className="font-semibold">Allowed Members: </span>
                  {row.original.allowTotalTeamMember ?? 'N/A'}
                </h2>
              </>
            ) : (
              <>
                <h2>
                  <span className="font-semibold">Limit: </span>
                  {row.original.limit ?? 'N/A'}
                </h2>
              </>
            )}
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'start',
      },
      mantineTableBodyCellProps: {
        align: 'start',
      },
    },
    {
      header: 'Price(CAD)',
      accessorKey: 'price',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div>
            <h2 className="font-medium">${row?.original?.price}</h2>
          </div>
        </div>
      ),
      mantineTableHeadCellProps: {
        align: 'center',
      },
      mantineTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      header: 'Type',
      accessorKey: 'type',
      Cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <div className="text-white">
            {row?.original?.type === 'addon' ? (
              <Badge className="bg-primary">{row?.original?.type}</Badge>
            ) : (
              <Badge className="bg-danger">{row?.original?.type}</Badge>
            )}
          </div>
        </div>
      ),
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
            color="warning"
            preIcon={<HiOutlinePencil className="text-base" />}
            onClick={() => {
              setFormData({
                ...row.original,
                descriptions: row.original.descriptions,
                image: row.original.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${row.original.image}` : null,
              });
              setCreateState(true);
            }}
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
      <CreateUpdateModel setFormData={setFormData} formData={formData} modalState={createState} setModalState={setCreateState} />

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
        searchPlaceHolder="Search By Title"
      />
    </>
  );
}
