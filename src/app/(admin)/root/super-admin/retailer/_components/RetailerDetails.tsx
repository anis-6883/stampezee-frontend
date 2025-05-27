'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { useSelector } from 'react-redux';
import AddonListTable from './AddonListTable';
import { InfoRow } from './InfoRow';
import StatsCardView from './StatsCardView';

export default function RetailerDetails({ id, timezone }: { id: string; timezone: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data, isLoading, isError } = useGetSingleRetailerQuery(id, { skip: !accessToken });
  const { data: subscriptions } = useGetSubscriptionQuery(undefined);

  let {
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
    totalSubAdmin,
    branches,
    sub_admins,
    addonSubscriptions,
    about,
    website,
    businessCurrency,
  } = data?.data || {};

  // console.log(data?.data);

  if (currentPlan) {
    currentPlan = subscriptions?.data?.find((item: any) => item?.type === 'subscription' && item?.slug === currentPlan)?.title;
  } else {
    currentPlan = 'No Enrollment Yet';
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
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

        <div className="flex items-center">
          <h2 className=" text-lg font-bold">Active Subscriptions List:</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-gray-200 px-5 py-6">
          <InfoRow label="Owner Name" value={fullName ? fullName : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Owner Email" value={email ? email : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Owner Phone" value={dialCode && phone ? `${dialCode} ${phone}` : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Province" value={province ? province : 'N/A'} isLoading={isLoading} />
          <InfoRow label="City" value={city ? city : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Country" value={country ? country : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Postal Code" value={postalCode ? postalCode : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Address" value={address ? address : 'N/A'} isLoading={isLoading} />
          <InfoRow label="About" value={about ? about : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Website" value={website ? website : 'N/A'} isLoading={isLoading} />
          <InfoRow label="Business Currency" value={businessCurrency ? businessCurrency : 'N/A'} isLoading={isLoading} />
          <InfoRow
            label="Current Plan"
            value={<span className={`${currentPlan === 'No Enrollment Yet' && 'text-danger'}`}>{currentPlan}</span>}
            isLoading={isLoading}
          />
        </div>

        <div className="">
          <AddonListTable data={addonSubscriptions} isLoading={isLoading} isError={isError} />
        </div>
      </div>

      <StatsCardView
        totalOrder={totalOrder}
        totalActiveStamp={totalActiveStamp}
        totalCustomer={totalCustomer}
        totalRevenue={totalRevenue}
        totalSubAdmin={totalSubAdmin}
        isLoading={isLoading}
        businessCurrency={businessCurrency}
        isError={isError}
        className="my-5 xxl:mb-8"
        id={id}
      />

      {/* <div className="grid grid-cols-1 gap-x-5 md:grid-cols-6 xxl:gap-x-10">
        <div className="col-span-1 md:col-span-2 xl:col-span-3 xxl:col-span-2">
          <h2 className="my-5 text-lg font-bold">Active Add-Ons List:</h2>
          <AddonListTable data={addonSubscriptions} isLoading={isLoading} isError={isError} />
        </div>
        <div className="col-span-1 md:col-span-4 xl:col-span-3 xxl:col-span-4">
          <h2 className="my-5 text-lg font-bold">Loyalty-Executive List:</h2>
          <SubAdminListTable data={sub_admins} isLoading={isLoading} isError={isError} />
        </div>
      </div>

      <h2 className="my-5 text-lg font-bold">Branch Statistics: ({totalActiveBranch})</h2>

      <BranchStatisticsTable businessCurrency={businessCurrency} data={branches} isLoading={isLoading} isError={isError} />

      <h2 className="my-5 text-lg font-bold">Subscriptions:</h2>
      <RetailerPaymentTable timezone={timezone} id={id} /> */}
    </div>
  );
}
