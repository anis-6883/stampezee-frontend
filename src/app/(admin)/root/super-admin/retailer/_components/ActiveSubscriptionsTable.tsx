'use client';

import _ from 'lodash';
import { Badge } from 'rizzui';
import Table from '../../../_components/Table';

interface SubAdminList {
  _id: string;
  title: string;
  count: string;
}

interface ActiveSubscriptionsTableProps {
  data: SubAdminList[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function ActiveSubscriptionsTable({ data, isLoading, isError }: ActiveSubscriptionsTableProps) {
  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Count',
      accessorKey: 'count',
    },
    {
      header: 'Source',
      accessorKey: 'customer.fullName',
      Cell: ({ row }: any) => {
        return (
          <div>
            <Badge className="!bg-danger text-white">{_.capitalize('add-on')}</Badge>
          </div>
        );
      },
    },
    {
      header: 'Next Renewal',
      Cell: ({ row }: any) => {
        return <div>25-06-2025</div>;
      },
    },
  ];

  const renderDetailPanel = ({ row }: any) => {
    return <div className="mx-20 flex justify-start"></div>;
  };

  return (
    <Table
      isFetching={isLoading}
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
              data: data || [],
              pagination: {
                totalDocuments: 10,
              },
            }
      }
      structure={structure}
      enablePagination={false}
      showGlobalFilter={false}
      renderDetailPanel={renderDetailPanel}
    />
  );
}
