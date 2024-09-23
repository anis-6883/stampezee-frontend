'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetRetailerDashboardCalcQuery } from '@/features/retailer/dashboard/dashboardApi';
import { IQueryType } from '@/types';
import { useState } from 'react';

export default function BranchStatsTable() {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching, isError } = useGetRetailerDashboardCalcQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  return (
    <div>
      <h2 className="my-5 text-lg font-medium">Branch Statistics:</h2>
      <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Serial No.
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Branch Name
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Branch Address
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Sub Admin Name
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Sub Admin Email
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Total Reward Collected
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                Total Amount (CAD)
              </th>
            </tr>
          </thead>
          {isLoading || isError ? (
            <tbody>
              <tr>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data?.data?.totalAmountAndRewardSubAdmin?.length <= 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                    <div className="flex flex-col justify-center py-5">
                      <img src="/images/no-data.svg" alt="image" className="m-auto h-40 w-40" />
                      <span>No Data Available!</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.data?.totalAmountAndRewardSubAdmin?.map((item: any, index: number) => {
                  return (
                    <tr
                      key={item?._id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {++index}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item?.subAdmin?.branch?.name}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item?.subAdmin?.branch?.address}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4">
                        {item?.subAdmin?.fullName}
                      </td>
                      <td scope="row" className="whitespace-nowrap px-6 py-4">
                        {item?.subAdmin?.email}
                      </td>
                      <td scope="row" className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                        {item?.totalRewardCollected}
                      </td>
                      <td scope="row" className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">
                        ${item?.totalAmount}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
