'use client';

import { getFormatDateByTimezone } from '@/utils/getFormatDate';
import _ from 'lodash';
import { SlArrowDown } from 'react-icons/sl';
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
      header: 'Count',
      accessorKey: 'count',
      Cell: ({ row }: any) => {
        return <div>{row?.original?.enrollSubscriptions?.length}</div>;
      },
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
        return (
          <div>
            {row?.original?.enrollSubscriptions?.length === 1 ? (
              <span>{getFormatDateByTimezone(row?.original?.enrollSubscriptions[0]?.enrollment?.validityTo, timezone)}</span>
            ) : (
              <p className="flex items-center gap-1">
                <SlArrowDown className="text-sm " />
              </p>
            )}
          </div>
        );
      },
    },
  ];

  const renderDetailPanel = ({ row }: { row: any }) => {
    if (row?.original?.enrollSubscriptions?.length <= 1) return null;
    const tableHeaders = ['Serial No.', 'Title', 'Next Renewal'];
    return (
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-[50%] text-center text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header} scope="col" className="whitespace-nowrap px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {row?.original?.enrollSubscriptions?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                  <div className="flex flex-col justify-center py-5">
                    <img src="/images/no-data.svg" alt="No data" className="m-auto h-40 w-40" />
                    <span>No Data Available!</span>
                  </div>
                </td>
              </tr>
            ) : (
              row?.original?.enrollSubscriptions?.map((item: any, index: number) => (
                <tr key={item._id} className={`border-b bg-white hover:bg-gray-50 `}>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {row?.original?.title} {index + 1}
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {getFormatDateByTimezone(item?.enrollment?.validityTo, timezone)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const mantineExpandButtonProps = ({ row }: any) => ({
    style: {
      display: row?.original?.enrollSubscriptions?.length === 1 ? 'none' : undefined,
    },
  });

  const mantineTableBodyRowProps = ({ row }: any) => ({
    onClick: () => {
      if (row?.original?.enrollSubscriptions?.length > 1) {
        row.toggleExpanded();
      }
    },
    style: {
      cursor: row?.original?.enrollSubscriptions?.length > 1 ? 'pointer' : 'default',
    },
  });

  const mantineExpandAllButtonProps = {
    style: {
      display: data?.some((item: any) => item?.enrollSubscriptions?.length > 1) ? undefined : 'none',
    },
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
      renderDetailPanel={renderDetailPanel}
      mantineExpandButtonProps={mantineExpandButtonProps}
      mantineTableBodyRowProps={mantineTableBodyRowProps}
      mantineExpandAllButtonProps={mantineExpandAllButtonProps}
    />
  );
}
