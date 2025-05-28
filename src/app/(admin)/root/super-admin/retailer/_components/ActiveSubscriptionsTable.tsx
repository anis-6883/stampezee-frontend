'use client';

import { getFormatDateByTimezone } from '@/utils/getFormatDate';
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
  timezone: string;
}

export default function ActiveSubscriptionsTable({ data, isLoading, isError, timezone }: ActiveSubscriptionsTableProps) {
  const structure = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Source',
      accessorKey: 'customer.fullName',
      Cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.type === 'addon' ? (
              <Badge className="!bg-danger text-white">{_.capitalize(row?.original?.type)}</Badge>
            ) : (
              <Badge className="bg-primary text-white">{_.capitalize(row?.original?.type)}</Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Next Renewal',
      Cell: ({ row }: any) => {
        return <div>{getFormatDateByTimezone(row?.original?.enrollSubscriptions[0]?.enrollment?.validityTo, timezone)}</div>;
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
      enableRowNumbers={true}
      // renderDetailPanel={renderDetailPanel}
    />
  );
}
