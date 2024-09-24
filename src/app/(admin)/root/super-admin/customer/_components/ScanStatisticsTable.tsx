import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllCustomerScanBySuperAdminQuery } from '@/features/super-admin/customer/customerApi';

const ScanStatisticsTable = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useGetAllCustomerScanBySuperAdminQuery(id);
  console.log('data', data?.data);
  const tableHeaders = [
    'Serial No.',
    'Branch Name',
    'Branch Address',
    'Sub Admin Name',
    'Sub Admin Email',
    'Total Customer',
    'Total Revenue (CAD)',
  ];

  if (isLoading || isError) {
    return (
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
    );
  }

  const branchStatistics = data || [];

  return (
    <div className="relative my-5 overflow-x-auto shadow-md sm:rounded-lg">
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
          {branchStatistics.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                <div className="flex flex-col justify-center py-5">
                  <img src="/images/no-data.svg" alt="No data" className="m-auto h-40 w-40" />
                  <span>No Data Available!</span>
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
                  {item.address}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4">
                  {item.subAdminName ?? <span className="text-danger">No Assigned</span>}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4">
                  {item.subAdminEmail ?? <span className="text-danger">No Assigned</span>}
                </td>
                <td scope="row" className="flex items-center gap-x-2 px-6 py-4">
                  {item.totalCustomer}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4">
                  ${item.totalRevenue}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScanStatisticsTable;
