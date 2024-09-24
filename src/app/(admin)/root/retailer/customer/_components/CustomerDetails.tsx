'use client';

import { useGetSingleCustomerByRetailerQuery } from '@/features/retailer/customer/customerApi';
import { InfoRow } from '../../../super-admin/retailer/_components/InfoRow';
import ScanStatisticsTable from './ScanStatisticsTable';
import StatsCardView from './StatsCardView';

export default function CustomerDetails({ id, offset }: { id: string; offset: number }) {
  const { data, isLoading, isError } = useGetSingleCustomerByRetailerQuery(id);
  const { fullName, email, address, dialCode, phone, country, totalCollectStamp, totalPurchased, totalRewardCollect, totalScan } =
    data?.data || {};

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <InfoRow label="Name" value={fullName} isLoading={isLoading} />
          <InfoRow label="Email" value={email} isLoading={isLoading} />
          <InfoRow label="Phone" value={`${dialCode}${phone}`} isLoading={isLoading} />
          <InfoRow label="Country" value={country} isLoading={isLoading} />
          <InfoRow label="Address" value={address?.name} isLoading={isLoading} />
        </div>
      </div>

      <StatsCardView
        totalCollectStamp={totalCollectStamp}
        totalScan={totalScan}
        totalRewardCollect={totalRewardCollect}
        totalPurchased={totalPurchased}
        isLoading={isLoading}
        isError={isError}
        className="2xl:mb-8 my-5"
      />

      <h2 className="my-5 text-lg font-medium">Scan Statistics:</h2>
      <ScanStatisticsTable id={id} offset={offset} />
    </div>
  );
}
