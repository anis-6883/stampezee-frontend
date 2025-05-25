'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { useGetRetailerDashboardCalcQuery } from '@/features/retailer/dashboard/dashboardApi';
import { useTranslations } from 'next-intl';

export default function BranchStatsTable({ dateRange }: { dateRange: string }) {
  const { data, isLoading, isError, isFetching } = useGetRetailerDashboardCalcQuery({ dateRange });
  const { data: retailerProfile, isLoading: isRetailerProfileLoading } = useRetailerGetProfileQuery(null);
  const t = useTranslations('RetailerDashboardTable');
  const t2 = useTranslations('RetailerDashboard');
  const t3 = useTranslations('retailerDashboardStampAndCustomerStats');

  const tableHeaders = [
    t('serialNo'),
    t('branchName'),
    t('totalSubAdmin'),
    t('totalCustomer'),
    t('totalStampCard'),
    t('totalOrder'),
    t('totalRewardsCollected'),
    `${t('totalRevenue')} (${isRetailerProfileLoading ? ' ' : retailerProfile?.data?.businessCurrency})`,
  ];

  if (isLoading || isError || isFetching) {
    return (
      <>
        <h2 className="mb-5 mt-5 text-lg font-medium">{t2('branchStatistics')}:</h2>
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

  const branchStatistics = data?.data?.branches || [];
  const { totalActiveBranches } = data?.data || {};

  return (
    <div className="relative my-5 overflow-x-auto">
      <h2 className="mb-5 text-lg font-medium">
        {t2('branchStatistics')}: ({totalActiveBranches})
      </h2>

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
          {branchStatistics.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                <div className="flex flex-col justify-center py-5">
                  <img src="/images/no-data.svg" alt="No data" className="m-auto h-40 w-40" />
                  <span>{t3('noDataAvailable')}</span>
                </div>
              </td>
            </tr>
          ) : (
            branchStatistics.map((item: any, index: number) => (
              <tr
                key={item._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.name}
                </td>
                {/* <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.address.length > 25 ? `${item.address.slice(0, 25)}...` : item.address}
                </td> */}

                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item?.totalSubAdmins}
                </td>
                {/* <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.subAdminEmail ?? <span className="text-danger">No Assigned</span>}
                </td> */}
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.totalCustomers}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item?.totalStampsCards}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.totalStamps}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {Number(item.totalRewardCollected)}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {Number(item.totalRevenue).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
