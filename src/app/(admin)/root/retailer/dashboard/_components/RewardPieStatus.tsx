'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRewardCollectPercentageQuery } from '@/features/retailer/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useTranslations } from 'next-intl';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Text, Title, Tooltip } from 'rizzui';

export default function RewardPieStatus({ className }: { className?: string }) {
  const t = useTranslations('retailerDashboardStampAndCustomerStats');
  const { data: rewardCollect, isLoading, isError, isFetching } = useRewardCollectPercentageQuery(null);

  const { rewardCollectedTruePercentage = 0, rewardCollectedFalsePercentage = 0, totalEligibleForReward = 0 } = rewardCollect?.data || {};

  const data = [
    { name: `${t('collected')}:`, value: Number(rewardCollectedTruePercentage), color: '#3872FA' },
    { name: `${t('notCollected')}:`, value: Number(rewardCollectedFalsePercentage), color: '#eab308' },
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
              content={'Hello..'}
              arrowClassName={`fill-danger`}
            >
              <span>
                <IoInformationCircleOutline className="text-xl text-danger " />
              </span>
            </Tooltip>
          </div>

          <p className="flex gap-x-2">
            <span className="font-lexend 2xl:text-2xl text-xl font-semibold text-gray-900">
              {isFetching || isLoading || isError || !rewardCollect ? (
                <Skeleton className="h-6 w-28 rounded" />
              ) : (
                <span>{totalEligibleForReward}</span>
              )}
            </span>
            {t('rewardEligible')}
          </p>
        </div>
        <div className="mb-6 w-full @3xl:w-40 @4xl:mb-0">
          <div className="mx-auto h-44 w-44">
            {isLoading || isError || rewardCollect === undefined ? (
              <Skeleton className="m-auto h-36 w-36 rounded-full" />
            ) : rewardCollectedTruePercentage === 0 && rewardCollectedFalsePercentage === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="font-medium text-danger">{t('noStatsAvailable')}</span>
              </div>
            ) : (
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
            )}
          </div>
          <p className="mt-4 text-center font-semibold text-gray-800">{t('rewardEfficacy')}</p>
        </div>
        <div className="">
          {isLoading || isError || rewardCollect === undefined ? (
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
