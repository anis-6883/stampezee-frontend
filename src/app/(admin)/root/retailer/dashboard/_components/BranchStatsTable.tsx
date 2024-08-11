'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetRetailerDashboardCalcQuery } from '@/features/retailer/dashboard/dashboardApi';
import { IQueryType } from '@/types';
import { useState } from 'react';

export default function BranchStatsTable() {
  const [query, setQuery] = useState<IQueryType>({ pageIndex: 0, pageSize: 10, search: null });
  const searchQuery = query.search ? { search: query.search } : {};
  const { data, isLoading, isFetching } = useGetRetailerDashboardCalcQuery({
    page: query.pageIndex + 1,
    limit: query.pageSize,
    ...searchQuery,
  });

  return (
    <div>
      <h2 className="mb-3 text-lg font-medium">Branch Statistics:</h2>
      <div className="flex flex-col">
        <div className="-m-1.5">
          <div className="inline-block min-w-full p-1.5 align-middle">
            <div className="rounded-sm border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500">
                        Branch Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500">
                        Branch Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500">
                        Sub Admin Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500">
                        Sub Admin Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500">
                        Total Reward Collected
                      </th>
                      <th scope="col" className="px-6 py-3 text-end text-sm font-medium text-gray-500 dark:text-neutral-500">
                        Total Amount (CAD)
                      </th>
                    </tr>
                  </thead>

                  {isLoading ? (
                    <>
                      <tbody>
                        <tr>
                          <td colSpan={6}>
                            <Skeleton className="my-3 h-8 w-full rounded" />
                            <Skeleton className="h-8 w-full rounded" />
                          </td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <>
                      {data?.data?.totalAmountAndRewardSubAdmin?.length === 0 ? (
                        <tbody>
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                              <div className="flex h-full items-center justify-center">No Data Available!</div>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {data?.data?.totalAmountAndRewardSubAdmin?.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-800 dark:text-neutral-200">
                                {item?.subAdmin?.branch?.name}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800 dark:text-neutral-200">
                                {item?.subAdmin?.branch?.address}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800 dark:text-neutral-200">
                                {item?.subAdmin?.fullName}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800 dark:text-neutral-200">
                                {item?.subAdmin?.email}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-center text-xs text-gray-800 dark:text-neutral-200">
                                {item?.totalRewardCollected}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-center text-xs font-medium">${item?.totalAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </>
                  )}
                </table>
              </div>
              {/* End of x-scroll wrapper */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
