'use client';

import { useGetSingleCustomerByRetailerQuery } from '@/features/retailer/customer/customerApi';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { InfoRow } from '../../../super-admin/retailer/_components/InfoRow';
import ScanStatisticsTable from './ScanStatisticsTable';
import StatsCardView from './StatsCardView';

export default function CustomerDetails({ id }: { id: string }) {
  const { data: session }: any = useSession();
  const t = useTranslations('RetailerCustomerDetailsCard');
  const t2 = useTranslations('RetailerCustomerDetailsScanTable');
  const { data, isLoading, isError } = useGetSingleCustomerByRetailerQuery(id);
  const { fullName, email, address, dialCode, phone, country, totalCollectStamp, totalPurchased, totalRewardCollect, totalScan } =
    data?.data || {};

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <InfoRow label={t('name')} value={fullName ? fullName : 'N/A'} isLoading={isLoading} />
          {/* <InfoRow label={t('email')} value={email ? email : 'N/A'} isLoading={isLoading} />
          <InfoRow label={t('phone')} value={dialCode && phone ? `${dialCode}${phone}` : 'N/A'} isLoading={isLoading} /> */}
          <InfoRow label={t('country')} value={country ? country : 'N/A'} isLoading={isLoading} />
          {/* <InfoRow label={t('address')} value={address?.name ? address?.name : 'N/A'} isLoading={isLoading} /> */}
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

      <h2 className="my-5 text-lg font-medium">{t2('title')} :</h2>
      <ScanStatisticsTable id={id} timezone={session?.user?.timezone?.label || ''} />
    </div>
  );
}
