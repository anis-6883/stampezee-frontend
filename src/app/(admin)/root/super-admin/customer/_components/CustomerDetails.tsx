'use client';

import { RootState } from '@/features/store';
import { useGetSingleCustomerBySuperAdminQuery } from '@/features/super-admin/customer/customerApi';
import { useSelector } from 'react-redux';
import { InfoRow } from '../../retailer/_components/InfoRow';
import ScanStatisticsTable from './ScanStatisticsTable';
import StatsCardView from './StatsCardView';

export default function CustomerDetails({ id, timezone }: { id: string; timezone: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError } = useGetSingleCustomerBySuperAdminQuery(id, { skip: !accessToken });
  const {
    fullName,
    email,
    contactEmail,
    address,
    dialCode,
    phone,
    country,
    totalStampsCollected,
    totalActiveStampsCollected,
    totalPurchased,
    totalRewardCollect,
    totalScan,
  } = data?.data || {};

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <InfoRow label="Name" value={fullName ? fullName : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Email" value={contactEmail ? contactEmail : email ?? 'N/A'} isLoading={isLoading} />
          <InfoRow label="Phone" value={dialCode && phone ? `${dialCode}${phone}` : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Country" value={country ? country : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Address" value={address?.name ? address?.name : 'N/A'} isLoading={isLoading} />
        </div>
      </div>

      <StatsCardView
        totalStampsCollected={totalStampsCollected}
        totalActiveStampsCollected={totalActiveStampsCollected}
        totalScan={totalScan}
        totalRewardCollect={totalRewardCollect}
        totalPurchased={totalPurchased}
        isLoading={isLoading}
        isError={isError}
        className="2xl:mb-8 my-5"
      />

      <h2 className="my-5 text-lg font-medium">Scan Statistics:</h2>
      <ScanStatisticsTable id={id} timezone={timezone} />
    </div>
  );
}
