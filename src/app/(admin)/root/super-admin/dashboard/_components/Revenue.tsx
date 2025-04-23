'use client';

import DatePicker from '@/components/Formik/DatePicker';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardRevenueQuery } from '@/features/super-admin/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useEffect, useState } from 'react';
import { Select, Text, Title } from 'rizzui';
import CircleProgressbar from './CircleProgressbar';
import WidgetCard from './WidgetCard';

export default function Revenue({ className }: { className?: string }) {
  const [dateRange, setDateRange] = useState('');
  const {
    data: dashboardRevenue,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDashboardRevenueQuery({
    dateRange,
  });
  const [showDate, setShowDate] = useState({ label: 'No Date', value: 'no-date' });

  useEffect(() => {
    refetch();
  }, [refetch, dateRange]);

  const {
    activeSubscription = 0,
    totalRevenueInCAD = 0,
    totalSubscriptionRevenueInCAD = 0,
    totalAddonRevenueInCAD = 0,
    subscriptionPercentage = 0,
    addonPercentage = 0,
    totalRefundAmountInCAD = 0,
  } = dashboardRevenue?.data || {};

  const dateOptions = [
    { label: 'No Date', value: 'no-date' },
    { label: 'With Date', value: 'with-date' },
  ];

  const data = [
    {
      name: 'Total Earning',
      value: `$${totalRevenueInCAD.toFixed(2)}`,
      percentage: 100,
      color: '#3872FA',
    },
    // {
    //   name: 'Subscription Earning',
    //   value: `${subscriptionPercentage}%`,
    //   percentage: subscriptionPercentage,
    //   color: '#10b981',
    // },
    // {
    //   name: 'Add-On Earning',
    //   value: `${addonPercentage}%`,
    //   percentage: addonPercentage,
    //   color: '#f1416c',
    // },
  ];

  return (
    <WidgetCard
      title={
        <Title as="h3" className="col-span-full text-base font-semibold text-black sm:text-lg">
          Total Revenue (CAD)
        </Title>
      }
      description={
        <p className="flex gap-x-2">
          <span className="font-lexend 2xl:text-2xl text-xl font-semibold text-gray-900">
            {isFetching || isLoading || isError || !dashboardRevenue ? (
              <Skeleton className="h-6 w-28 rounded" />
            ) : (
              <span>{activeSubscription}</span>
            )}
          </span>
          Active Subscriptions
        </p>
      }
      titleClassName="font-normal text-gray-500 text-sm sm:text-sm 2xl:text-base"
      descriptionClassName="mt-2"
      headerClassName="col-span-full"
      className={cn('relative grid h-full grid-cols-2 pb-0 @2xl:gap-8 @3xl:gap-5 lg:pb-0', className)}
      action={
        <div className="flex items-center justify-between gap-5">
          {showDate.value === 'with-date' && <DatePicker range={true} changeHandler={setDateRange} />}

          <Select
            size="md"
            className="w-32"
            selectClassName="!ring-0"
            options={dateOptions}
            value={showDate}
            onChange={(value: any) => {
              if (value.value === 'no-date') setDateRange('');
              setShowDate(value);
            }}
          />
        </div>
      }
    >
      {isFetching || isLoading || isError || !dashboardRevenue ? (
        <>
          <div className="col-span-full my-6 flex">
            <Skeleton className="m-auto h-52 w-52 rounded-full" />
            <Skeleton className="m-auto h-52 w-52 rounded-full" />
            <Skeleton className="m-auto h-52 w-52 rounded-full" />
          </div>
          <Skeleton className="col-span-full m-auto my-5 h-28" />
        </>
      ) : (
        <>
          <div className="col-span-full mt-10  flex w-full items-center justify-center gap-5 @2xl:gap-12 @7xl:gap-8 @[1429px]:gap-4 @[1553px]:gap-8">
            {data.map((item: any) => (
              <div key={item.name} className={cn('grid w-[230px] gap-6 text-center')}>
                <CircleProgressbar
                  percentage={item.percentage}
                  size={120}
                  stroke="#f0f0f0"
                  strokeWidth={5}
                  progressColor={item.color}
                  useParentResponsive={true}
                  label={<Text className="font-lexend 2xl:text-base text-sm font-bold text-gray-900 dark:text-gray-700">{item.value}</Text>}
                  strokeClassName="dark:stroke-gray-200"
                />
                <Text className="text-sm font-semibold text-gray-900 @md:text-sm @7xl:text-base dark:text-gray-700">{item.name}</Text>
              </div>
            ))}
          </div>
          <div className="2xl:text-base col-span-full -mx-5 mt-5 rounded-b-lg bg-gray-50 p-5 text-sm lg:-mx-7 lg:p-7">
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 lg:gap-7">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-base">
                  <span className="font-semibold">Subscription Earning:</span> ${totalRevenueInCAD.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#f1416c' }} />
                <span className="text-base">
                  <span className="font-semibold">Total Refund:</span> ${totalRefundAmountInCAD.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </WidgetCard>
  );
}
