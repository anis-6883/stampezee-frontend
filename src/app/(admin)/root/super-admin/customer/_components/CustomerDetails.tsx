'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { InfoRow } from '../../retailer/_components/InfoRow';
import ScanStatisticsTable from './ScanStatisticsTable';
import StatsCardView from './StatsCardView';

export default function CustomerDetails({ id, offset }: { id: string; offset: number }) {
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
          <InfoRow label="Owner Name" value={fullName} isLoading={isLoading} />
          <InfoRow label="Owner Email" value={email} isLoading={isLoading} />
          <InfoRow label="Owner Phone" value={phone} isLoading={isLoading} />
          <InfoRow label="Country" value={country} isLoading={isLoading} />
        </div>
      </div>

      <StatsCardView
        totalActiveBranch={0}
        totalActiveStamp={0}
        totalCustomer={0}
        totalRevenue={0}
        isLoading={isLoading}
        isError={isError}
        className="2xl:mb-8 my-5"
      />

      <h2 className="my-5 text-lg font-medium">Scan Statistics:</h2>
      <ScanStatisticsTable data={[]} isLoading={false} isError={false} />
    </div>
  );
}
