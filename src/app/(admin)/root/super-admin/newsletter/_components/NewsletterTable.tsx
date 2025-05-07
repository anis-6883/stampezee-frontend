'use client';

import Table from '@/app/(admin)/root/_components/Table';
import { useGetAllNewsletterBySuperAdminQuery } from '@/features/super-admin/newsletter/newsletterApi';
import { IQueryType } from '@/types';
import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import { useEffect, useState } from 'react';

export default function NewsletterTable({ timezone }: { timezone: string }) {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetAllNewsletterBySuperAdminQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  const structure = [
    {
      header: 'Email',
      accessorKey: 'email',
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
      // size: 230,
    },
  ];

  useEffect(() => {
    const element = document.querySelector('.mantine-hnifc4');
    if (element) element.textContent = 'SI No.';
  }, []);

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
        searchPlaceHolder="Search By Email"
        searchFieldWidth="270px"
      />
    </>
  );
}
