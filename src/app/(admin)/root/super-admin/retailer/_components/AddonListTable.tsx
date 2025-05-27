import { Skeleton } from '@/components/ui/skeleton';

interface SubAdminList {
  _id: string;
  title: string;
  count: string;
}

interface SubAdminListTableProps {
  data: SubAdminList[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function AddonListTable({ data, isLoading, isError }: SubAdminListTableProps) {
  const tableHeaders = ['Serial No.', 'Title', 'Count', 'Source', 'Next Renewal'];

  if (isLoading || isError) {
    return (
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableHeaders?.map((header) => (
              <th key={header} scope="col" className="whitespace-nowrap px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {tableHeaders?.map((_, index) => (
              <td key={index} scope="row" className="whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-white">
                <Skeleton className="h-6 w-32 rounded" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }

  const addonList = data || [];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
          {addonList?.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                <div className="flex flex-col justify-center py-5">
                  <img src="/images/no-data.svg" alt="No data" className="m-auto h-40 w-40" />
                  <span>No Data Available!</span>
                </div>
              </td>
            </tr>
          ) : (
            addonList?.map((item, index) => (
              <tr
                key={item._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item?.title}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item?.count}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
