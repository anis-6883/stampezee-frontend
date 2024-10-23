import { Skeleton } from '@/components/ui/skeleton';

interface SubAdminList {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  branchName: string;
  branchAddress: string;
}

interface SubAdminListTableProps {
  data: SubAdminList[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export default function SubAdminListTable({ data, isLoading, isError }: SubAdminListTableProps) {
  const tableHeaders = ['Serial No.', 'First Name', 'Last Name', 'Email', 'Branch Name', 'Branch Address'];

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

  const subadminList = data || [];

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
          {subadminList.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-neutral-500">
                <div className="flex flex-col justify-center py-5">
                  <img src="/images/no-data.svg" alt="No data" className="m-auto h-40 w-40" />
                  <span>No Data Available!</span>
                </div>
              </td>
            </tr>
          ) : (
            subadminList.map((item, index) => (
              <tr
                key={item._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item.firstName}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item.lastName}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item.email}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item.branchName ?? <span className="text-danger">No Assigned</span>}
                </td>
                <td scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {item.branchAddress.length > 25 ? `${item.branchAddress.slice(0, 25)}...` : item.branchAddress}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
