'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import BranchStatisticsTable from './BranchStatisticsTable';
import { InfoRow } from './InfoRow';
import StatsCardView from './StatsCardView';

export default function RetailerDetails({ id, offset }: { id: string; offset: number }) {
  const { data, isLoading, isError } = useGetSingleRetailerQuery(id);
  const {
    storeName,
    fullName,
    email,
    image,
    dialCode,
    phone,
    country,
    city,
    address,
    province,
    postalCode,
    currentPlan,
    totalActiveBranch,
    totalActiveStamp,
    totalCustomer,
    totalRevenue,
    branches,
  } = data?.data || {};
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
          <InfoRow label="Owner Phone" value={`${dialCode} ${phone}`} isLoading={isLoading} />
          <InfoRow label="Province" value={province} isLoading={isLoading} />
          <InfoRow label="City" value={city} isLoading={isLoading} />
          <InfoRow label="Country" value={country} isLoading={isLoading} />
          <InfoRow label="Postal Code" value={postalCode} isLoading={isLoading} />
          <InfoRow label="Address" value={address} isLoading={isLoading} />
          <InfoRow
            label="Current Plan"
            value={currentPlan ?? <span className="text-danger">No Enrollment Yet!</span>}
            isLoading={isLoading}
          />
        </div>
      </div>

      <StatsCardView
        totalActiveBranch={totalActiveBranch}
        totalActiveStamp={totalActiveStamp}
        totalCustomer={totalCustomer}
        totalRevenue={totalRevenue}
        isLoading={isLoading}
        isError={isError}
        className="2xl:mb-8 my-5"
      />

      <h2 className="my-5 text-lg font-medium">Branch Statistics:</h2>
      <BranchStatisticsTable data={branches} isLoading={isLoading} isError={isError} />
    </div>
  );
}
