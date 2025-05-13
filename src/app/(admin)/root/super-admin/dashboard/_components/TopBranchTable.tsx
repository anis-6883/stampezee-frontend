'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/config/routes';
import { useGetTopOutletsQuery } from '@/features/super-admin/dashboard/dashboardApi';
import Link from 'next/link';

export default function TopBranchTable() {
  const { data, isLoading, isError } = useGetTopOutletsQuery(null);

  const tableHeaders = ['Serial No', 'Retailer Name', 'Retailer Email', 'Branch Name', 'Branch Address', 'Total Revenue'];

  if (isLoading || isError) {
    return (
      <>
        <h2 className="mb-5 text-lg font-medium">Top Branch List:</h2>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
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
            <tr>
              {tableHeaders.map((_, index) => (
                <td key={index} scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                  <Skeleton className="h-6 w-32 rounded" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  const topOutlets = data?.data || [];

  return (
    <div className="relative my-5 overflow-x-auto">
      <h2 className="mb-5 text-lg font-medium">Top Branch List:</h2>

      <table className="w-full text-left text-sm text-gray-500 shadow-md dark:text-gray-400 sm:rounded-lg rtl:text-right">
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
          {topOutlets.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                <div className="flex flex-col justify-center py-5">
                  <img src="/images/no-data.svg" alt="No data" className="m-auto h-40 w-40" />
                  <span>No Data Available!</span>
                </div>
              </td>
            </tr>
          ) : (
            topOutlets.slice(0, 10).map((item: any, index: number) => {
              const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              const retailerEmail = item.retailer.email?.split(/[-\s]/)?.find((part: string) => emailRegex.test(part));
              return (
                <tr
                  key={item._id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <Link href={routes.privateRoutes.superAdmin.retailer.details(item.retailer._id)}>{item.retailer.storeName}</Link>
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {retailerEmail}
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.branch.name}
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.branch.address}
                  </td>
                  <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.totalAmountInCAD.toFixed(2)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
