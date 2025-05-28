'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { useGetSingleRetailerQuery } from '@/features/super-admin/retailer/retailerApi';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import Link from 'next/link';
import { FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import ActiveSubscriptionsTable from './ActiveSubscriptionsTable';
import { RetailerInfoCol } from './RetailerInfoCol';
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
      <div className="">
        <div className="col-span-12 mb-3.5 md:col-span-7">
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

        {/* <div className="col-span-12 flex items-center md:col-span-5">
          <h2 className=" text-lg font-bold">Active Subscriptions List:</h2>
        </div> */}
      </div>
      <div className="mb-6 grid grid-cols-12 gap-7">
        <div className="col-span-12 space-y-6 rounded-xl border border-gray-200 px-5 py-6 md:col-span-7">
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3">
            <RetailerInfoCol label="Owner Name" value={fullName ? fullName : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Owner Email" value={email ? email : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Owner Phone" value={dialCode && phone ? `${dialCode} ${phone}` : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Province" value={province ? province : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="City" value={city ? city : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Country" value={country ? country : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Postal Code" value={postalCode ? postalCode : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Business Currency" value={businessCurrency ? businessCurrency : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol
              label="Current Plan"
              value={<span className={`${currentPlan === 'No Enrollment Yet' && 'text-danger'}`}>{currentPlan}</span>}
              isLoading={isLoading}
            />
            <RetailerInfoCol label="Website" value={website ? website : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="Address" value={address ? address : 'N/A'} isLoading={isLoading} />
            <RetailerInfoCol label="About" value={about ? about : 'N/A'} isLoading={isLoading} />
          </div>
        </div>

        <div className="col-span-12 md:col-span-5">
          <StatsCardView
            totalOrder={totalOrder}
            totalActiveStamp={totalActiveStamp}
            totalCustomer={totalCustomer}
            totalRevenue={totalRevenue}
            totalBranch={branches?.length || 0}
            totalSubAdmin={totalSubAdmin}
            isLoading={isLoading}
            businessCurrency={businessCurrency}
            isError={isError}
            className=""
            id={id}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className=" mb-4 text-lg font-bold">Active Subscriptions List:</h2>
        <Link href={`${routes.privateRoutes.superAdmin.retailer?.details(id)}/subscriptions`}>
          <Button className=" !px-2 !py-1.5" text="Subscription Details" color="danger" preIcon={<FaInfoCircle className="text-base" />} />
        </Link>
      </div>
      <ActiveSubscriptionsTable data={addonSubscriptions} isLoading={isLoading} isError={isError} />
      {/* <AddonListTable data={addonSubscriptions} isLoading={isLoading} isError={isError} /> */}

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

      {/* <h2 className="my-5 text-lg font-bold">Subscriptions:</h2>
      <RetailerPaymentTable timezone={timezone} id={id} /> */}
    </div>
  );
}
