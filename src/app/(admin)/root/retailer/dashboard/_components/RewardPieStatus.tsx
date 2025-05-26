'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRewardCollectPercentageQuery } from '@/features/retailer/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useTranslations } from 'next-intl';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Text, Title, Tooltip } from 'rizzui';
import CircleProgressbar from './CircleProgressbar';
const statsData = [
  {
    name: '',
    value: 0,
    percentage: 100,
    color: '#eab308',
  },
];
const statsData1 = [
  {
    name: '',
    value: 100,
    percentage: 100,
    color: '#3872FA',
  },
];
const statsData2 = [
  {
    name: '',
    value: 100,
    percentage: 100,
    color: '#eab308',
  },
];

export default function RewardPieStatus({ className, dateRange }: { className?: string; dateRange: string | undefined }) {
  const t = useTranslations('retailerDashboardStampAndCustomerStats');
  const { data: rewardCollect, isLoading, isError, isFetching } = useRewardCollectPercentageQuery({ dateRange });

  const {
    rewardCollectedTruePercentage = 0,
    rewardCollectedFalsePercentage = 0,
    totalEligibleForReward = 0,
    totalRewardCollectedTrue = 0,
    totalRewardCollectedFalse = 0,
    totalReward = 0,
  } = rewardCollect?.data || {};

  const data = [
    { name: `${t('collected')}: (${totalRewardCollectedTrue})`, value: Number(rewardCollectedTruePercentage), color: '#3872FA' },
    { name: `${t('notCollected')}: (${totalRewardCollectedFalse})`, value: Number(rewardCollectedFalsePercentage), color: '#eab308' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderRewardCollectedGraph = () => {
    if (isLoading || isError || isFetching || rewardCollect === undefined) {
      return <Skeleton className="m-auto rounded-full md:size-36 sxl:size-48" />;
    } else if (rewardCollectedTruePercentage === 0 && rewardCollectedFalsePercentage === 0) {
      return (
        <div className="col-span-full mt-10 flex items-center justify-center">
          {statsData.map((item: any) => (
            <div key={item.name} className={cn('w-52 text-center')}>
              <CircleProgressbar
                percentage={item.percentage}
                size={120}
                stroke="#eab308"
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
      );
    } else if (rewardCollectedTruePercentage === 100 && rewardCollectedFalsePercentage === 0) {
      return (
        <div className="col-span-full mt-10 flex items-center justify-center">
          {statsData1.map((item: any) => (
            <div key={item.name} className={cn('w-52 text-center')}>
              <CircleProgressbar
                percentage={item.percentage}
                size={120}
                stroke="#eab308"
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
      );
    } else if (rewardCollectedTruePercentage === 0 && rewardCollectedFalsePercentage === 100) {
      return (
        <div className="col-span-full mt-10 flex items-center justify-center">
          {statsData2.map((item: any) => (
            <div key={item.name} className={cn('w-52 text-center')}>
              <CircleProgressbar
                percentage={item.percentage}
                size={120}
                stroke="#eab308"
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
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            strokeWidth={2}
            dataKey="value"
          >
            {data.map((item, index) => (
              <Cell key={index} fill={item.color} stroke={item.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={cn('flex flex-col gap-5 border-0 p-0 lg:p-0', className)}>
      <div className="grid h-full items-start rounded-lg border border-gray-300 p-5 @xl:grid-cols-2 lg:p-7">
        <div>
          <div className="flex items-center gap-x-1">
            <Title as="h3" className="col-span-full text-base font-semibold sm:text-lg">
              {t('rewardCollectStatus')}
            </Title>
            <Tooltip
              color="danger"
              className={`bg-danger text-white`}
              size="sm"
              placement="top"
              content={
                'Shows the percentage of rewards that have been claimed by customers compared to those that were eligible but unclaimed.'
              }
              arrowClassName={`fill-danger`}
            >
              <span>
                <IoInformationCircleOutline className="cursor-pointer text-xl text-danger" />
              </span>
            </Tooltip>
          </div>

          <p className="flex items-center gap-x-2">
            <span className="font-lexend 2xl:text-2xl text-xl font-semibold text-gray-900">
              {isFetching || isLoading || isError || !rewardCollect ? (
                <Skeleton className="h-6 w-28 rounded" />
              ) : (
                <span>{totalEligibleForReward}</span>
              )}
            </span>
            {totalEligibleForReward <= 1 ? t('rewardEligible') : t('rewardEligibles')}
          </p>
        </div>
        <div className="mb-6 w-full @3xl:w-40 @4xl:mb-0">
          <div className="mx-auto h-44 w-44">{renderRewardCollectedGraph()}</div>
          <p className="mt-4 text-center font-semibold text-gray-800">{t('rewardEfficacy')}</p>
        </div>
        <div className="">
          {isLoading || isError || isFetching || rewardCollect === undefined ? (
            <>
              <Skeleton className="m-auto h-6 w-full rounded-md" />
              <hr className="my-3" />
              <Skeleton className="m-auto h-6 w-full rounded-md" />
            </>
          ) : (
            data.map((item, index) => (
              <div
                key={index}
                className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 last:mb-0 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-start">
                  <span className="me-2 h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <Title as="h5" className=" text-sm font-medium">
                    {item.name}
                  </Title>
                </div>
                <Text as="span">{item.value}%</Text>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
