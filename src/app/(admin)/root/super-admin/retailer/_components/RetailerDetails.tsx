'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import StatsCardView from './StatsCardView';

export default function RetailerDetails({ id, offset }: { id: string; offset: number }) {
  const { data, isLoading, isError } = useGetSingleRetailerQuery(id);
  const { storeName, fullName, email, image, dialCode, phone, country, city, address, province, postalCode } = data?.data || {};
  // const validityToUtc = moment.utc(validityTo).utcOffset(Number(offset));

  return (
    <div className="w-full">
      <div className="mb-3.5">
        {isLoading || isError ? (
          <Skeleton className="my-3 h-8 w-32 rounded" />
        ) : (
          <div className="flex items-center gap-x-1">
            <h3 className="text-base font-semibold">Store Name : </h3>
            <h3 className="text-base font-medium">{storeName}</h3>
            {image ? (
              <div>
                <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${image}`} alt="image" className="h-8 w-8 rounded" />
              </div>
            ) : (
              <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <div className="flex flex-col items-center justify-between font-medium md:flex-row">
            <span className="font-bold">Owner Name</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <div className="flex items-center gap-x-1">{fullName}</div>}
          </div>
          <div className="flex flex-col justify-between font-medium md:flex-row">
            <span className="font-bold">Owner Email</span>
            <span>{isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : email}</span>
          </div>

          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Owner Phone</span>{' '}
            {isLoading || isError ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <span>
                {dialCode} {phone}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Postal Code</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{postalCode}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Province</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{province}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">City</span> {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{city}</span>}
          </div>

          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Country</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{country}</span>}
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="font-bold">Address</span>{' '}
            {isLoading || isError ? <Skeleton className="h-6 w-32 rounded" /> : <span>{address}</span>}
          </div>
        </div>
      </div>

      <StatsCardView className="2xl:mb-8 my-5" />

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
                {true ? (
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
                        <td className="whitespace-nowrap px-6 py-4">{item?.subAdmin?.fullName}</td>
                        <td className="whitespace-nowrap px-6 py-4"> {item?.subAdmin?.email}</td>
                        <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">{item?.totalRewardCollected}</td>
                        <td className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4">${item?.totalAmount}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
