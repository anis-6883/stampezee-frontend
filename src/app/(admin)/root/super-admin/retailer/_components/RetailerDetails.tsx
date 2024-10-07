'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import BranchStatisticsTable from './BranchStatisticsTable';
import { InfoRow } from './InfoRow';
import StatsCardView from './StatsCardView';

export default function RetailerDetails({ id }: { id: string }) {
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
    totalOrder,
    branches,
  } = data?.data || {};

  return (
    <div className="w-full">
      <div className="mb-3.5">
        {isLoading || isError ? (
          <Skeleton className="my-3 h-8 w-32 rounded" />
        ) : (
          <div className="flex items-center gap-x-1">
            <h3 className="text-base font-semibold">Store Name : </h3>
            <div className="flex items-center gap-x-2 rounded-md bg-[#F4F6F8] px-3 py-2">
              {image ? (
                <div>
                  <img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${image}`} alt="image" className="h-8 w-8 rounded" />
                </div>
              ) : (
                <img src={'/images/stamp-logo.png'} alt="image" className="h-8 w-8 rounded" />
              )}
              <h3 className=" text-base font-medium">{storeName}</h3>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <InfoRow label="Owner Name" value={fullName ? fullName : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Owner Email" value={email ? email : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Owner Phone" value={dialCode && phone ? `${dialCode} ${phone}` : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Province" value={province ? province : 'N/A'} isLoading={isLoading} />
          <InfoRow label="City" value={city ? city : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Country" value={country ? country : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Postal Code" value={postalCode ? postalCode : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Address" value={address ? address : 'N/A'} isLoading={isLoading} />
          <InfoRow
            label="Current Plan"
            value={currentPlan ?? <span className="text-danger">No Enrollment Yet!</span>}
            isLoading={isLoading}
          />
        </div>
      </div>

      <StatsCardView
        totalOrder={totalOrder}
        totalActiveStamp={totalActiveStamp}
        totalCustomer={totalCustomer}
        totalRevenue={totalRevenue}
        isLoading={isLoading}
        isError={isError}
        className="2xl:mb-8 my-5"
      />

      <h2 className="my-5 text-lg font-medium">Branch Statistics: ({totalActiveBranch})</h2>
      <BranchStatisticsTable data={branches} isLoading={isLoading} isError={isError} />
    </div>
  );
}
