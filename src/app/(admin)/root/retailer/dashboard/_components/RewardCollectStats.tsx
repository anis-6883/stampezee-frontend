'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAvgCollectedStampQuery } from '@/features/retailer/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Text, Title, Tooltip } from 'rizzui';
import CircleProgressbar from './CircleProgressbar';
import WidgetCard from './WidgetCard';

export default function RewardCollectStats({ className, dateRange }: { className?: string; dateRange: string }) {
  const t = useTranslations('retailerDashboardStampAndCustomerStats');
  // const [dateRange, setDateRange] = useState('');
  const [showDate, setShowDate] = useState({ label: t('noDate'), value: 'no-date' });
  const {
    data: avgCollectStamp,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAvgCollectedStampQuery({
    dateRange,
  });

  useEffect(() => {
    refetch();
  }, [refetch, dateRange]);

  const { avgStampCollect = 0, totalCustomer = 0, totalStampsCollected = 0 } = avgCollectStamp?.data || {};

  const dateOptions = [
    { label: t('noDate'), value: 'no-date' },
    { label: t('withDate'), value: 'with-date' },
  ];

  const data = [
    {
      name: t('stampCollectStatus'),
      value: `${avgStampCollect}`,
      percentage: 100,
      color: '#3872FA',
    },
  ];

  return (
    <WidgetCard
      title={
        <div className="flex items-center gap-x-1">
          <Title as="h3" className="col-span-full text-base font-semibold text-black sm:text-lg">
            {t('stampCollect')}
          </Title>
          <Tooltip
            color="danger"
            className={`bg-danger text-white`}
            size="sm"
            placement="top"
            content={'Shows the average number of stamps collected by each user across all their stamp cards.'}
            arrowClassName={`fill-danger`}
          >
            <span>
              <IoInformationCircleOutline className="cursor-pointer text-xl text-danger" />
            </span>
          </Tooltip>
        </div>
      }
      // description={
      //   <p className="flex gap-x-2">
      //     <span className="font-lexend 2xl:text-2xl text-xl font-semibold text-gray-900">
      //       {isFetching || isLoading || isError || !avgCollectStamp ? (
      //         <Skeleton className="h-6 w-28 rounded" />
      //       ) : (
      //         <span>{totalStampsCollected}</span>
      //       )}
      //     </span>
      //     {t('activeStampCollect')}
      //   </p>
      // }
      titleClassName="font-normal text-gray-500 text-sm sm:text-sm 2xl:text-base"
      descriptionClassName="mt-2"
      headerClassName="col-span-full flex-col md:flex-row gap-y-3"
      className={cn('relative grid h-full grid-cols-1 pb-0 @2xl:gap-8 @3xl:gap-5 md:grid-cols-2 lg:pb-0', className)}
      // action={
      //   <div className="flex items-center justify-between gap-5">
      //     {showDate.value === 'with-date' && <DatePicker range={true} changeHandler={setDateRange} />}

      //     <Select
      //       size="md"
      //       className="w-full md:w-32"
      //       selectClassName="!ring-0"
      //       options={dateOptions}
      //       value={showDate}
      //       onChange={(value: any) => {
      //         if (value.value === 'no-date') setDateRange('');
      //         setShowDate(value);
      //       }}
      //     />
      //   </div>
      // }
      actionClassName="w-full md:w-auto"
    >
      {isFetching || isLoading || isError || !avgCollectStamp ? (
        <>
          <div className="col-span-full my-6 flex flex-col gap-3 md:flex-row">
            <Skeleton className="m-auto h-52 w-52 rounded-full" />
          </div>
          <Skeleton className="col-span-full m-auto my-5 h-28" />
        </>
      ) : (
        <>
          <div className="col-span-full mt-10 flex items-center justify-center">
            {data.map((item: any) => (
              <div key={item.name} className={cn('w-52 text-center')}>
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
                <Text className="mt-3 text-sm font-semibold text-gray-900 @md:text-sm @7xl:text-base dark:text-gray-700">{item.name}</Text>
              </div>
            ))}
          </div>
          <div className="2xl:text-base col-span-full -mx-5 mt-5 rounded-b-lg bg-gray-50 p-5 text-sm lg:-mx-7 lg:p-7">
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 lg:gap-7">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-base">
                  <span className="font-semibold">{t('totalUniqueCustomer')}:</span> {totalCustomer}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#f1416c' }} />
                <span className="text-base">
                  <span className="font-semibold">{t('totalCollectedStamp')}:</span> {totalStampsCollected}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </WidgetCard>
  );
}
