'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { useGetRetailerDashboardCalcQuery } from '@/features/retailer/dashboard/dashboardApi';
import { RootState } from '@/features/store';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function BranchStatsTable() {
  const [selectedCurrency, setSelectedCurrency] = useState<any>();
  const { currencyExchangeRates } = useSelector((state: RootState) => state.currencyExchangeSlice);
  const { data, isLoading, isError } = useGetRetailerDashboardCalcQuery(null);
  const { data: retailerProfile, isLoading: isRetailerProfileLoading } = useRetailerGetProfileQuery(null);
  const t = useTranslations('RetailerDashboardTable');
  const t2 = useTranslations('RetailerDashboard');
  const t3 = useTranslations('retailerDashboardStampAndCustomerStats');

  useEffect(() => {
    const selectedCurrency: any = currencyExchangeRates?.find((item: any) => item?.name === retailerProfile?.data?.businessCurrency);
    setSelectedCurrency(selectedCurrency);
  }, [currencyExchangeRates, retailerProfile?.data?.businessCurrency]);

  const tableHeaders = [
    t('serialNo'),
    t('branchName'),
    t('branchAddress'),
    t('subAdminName'),
    t('subAdminEmail'),
    t('totalCustomer'),
    t('totalOrder'),
    `${t('totalRevenue')} (${isRetailerProfileLoading ? ' ' : retailerProfile?.data?.businessCurrency})`,
  ];

  if (isLoading || isError) {
    return (
      <>
        <h2 className="mb-5 text-lg font-medium">{t2('branchStatistics')}:</h2>
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
  const { totalActiveBranch } = data?.data || {};

  return (
    <div className="relative my-5 overflow-x-auto">
      <h2 className="mb-5 text-lg font-medium">
        {t2('branchStatistics')}: ({totalActiveBranch})
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
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.address.length > 25 ? `${item.address.slice(0, 25)}...` : item.address}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.subAdminName ?? <span className="text-danger">No Assigned</span>}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.subAdminEmail ?? <span className="text-danger">No Assigned</span>}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.totalCustomer}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.totalOrder}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {item.totalRevenue * selectedCurrency?.exchangeRate || 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
