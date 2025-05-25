'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { useGetDashboardCalcQuery } from '@/features/super-admin/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import { Text, Title, Tooltip } from 'rizzui';

// Custom tooltip component
const CustomTooltip = ({ active, payload, totalCustomer = 0, totalRetailer = 0 }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="max-w-52 rounded-lg bg-danger px-3 py-2 text-white shadow">
        <p className="font-semibold">{`Retailer : ${totalRetailer}`}</p>
        <p className="font-semibold">{`Customer : ${totalCustomer}`}</p>
      </div>
    );
  }
  return null;
};

export default function SignUpStatus({ className, dateRange }: { className?: string; dateRange: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data: dashBoardData, isLoading, isError, isFetching } = useGetDashboardCalcQuery({ dateRange }, { skip: !accessToken });

  const data = [
    { name: 'Retailer Signup:', value: Number(dashBoardData?.data?.signupRatio?.retailer), color: '#3872FA' },
    { name: 'Customer Signup:', value: Number(dashBoardData?.data?.signupRatio?.customer), color: '#eab308' },
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
        <div className="flex items-center gap-x-1">
          <Title as="h3" className="col-span-full text-base font-semibold sm:text-lg">
            Total Signup Ratio
          </Title>
          <Tooltip
            color="danger"
            className={`bg-danger text-white`}
            size="sm"
            placement="top"
            content={'Total Retailer vs. Total Customer Signup Ratio'}
            arrowClassName={`fill-danger`}
          >
            <span>
              <IoInformationCircleOutline className="cursor-pointer text-xl text-danger" />
            </span>
          </Tooltip>
        </div>
        <div className="mb-6 w-full @3xl:w-40 @4xl:mb-0">
          <div className="mx-auto h-44 w-44">
            {isLoading || isError || isFetching || dashBoardData === undefined ? (
              <Skeleton className="m-auto rounded-full md:size-36 sxl:size-44" />
            ) : dashBoardData?.data?.signupRatio?.retailer == 0 && dashBoardData?.data?.signupRatio?.customer == 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="font-medium text-danger">No Stats Available!</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart className=" [&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
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
                    cursor={'pointer'}
                  >
                    {data.map((item, index) => (
                      <Cell key={index} fill={item.color} stroke={item.color} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '10px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                    content={
                      <CustomTooltip
                        totalRetailer={dashBoardData?.data?.totalVerifiedRetailer}
                        totalCustomer={dashBoardData?.data?.totalVerifiedCustomer}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="mt-4 text-center font-semibold text-gray-800">Retailer vs. Customer</p>
        </div>
        <div className="">
          {isLoading || isError || dashBoardData === undefined ? (
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
