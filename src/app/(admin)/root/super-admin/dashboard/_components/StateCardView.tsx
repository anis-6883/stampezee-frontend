'use client';

import { useGetDashboardCalcQuery } from '@/features/super-admin/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useScrollableSlider } from '@/hooks/use-scrollable-slider';
import { BsShop } from 'react-icons/bs';
import { IoDiamondOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { PiCalendarPlusDuotone, PiCaretLeftBold, PiCaretRightBold, PiCurrencyDollar } from 'react-icons/pi';
import { Button } from 'rizzui';
import MetricCard from './MetricCard';

const filesStatData = [
  {
    id: 1,
    title: 'Total Retailer',
    metric: '36,476',
    fill: '#3872FA',
    percentage: 32,
    increased: true,
    decreased: false,
    value: '+32.40',
    icon: <BsShop className="text-2xl" />,
  },
  {
    id: 2,
    title: 'Total Customer',
    metric: '53,406',
    fill: '#3872FA',
    percentage: 48,
    increased: false,
    decreased: true,
    value: '-18.45',
    icon: <LuUsers className="text-2xl" />,
  },
  {
    id: 3,
    title: 'Total Subscription',
    metric: '90,875',
    fill: '#EE0000',
    percentage: 89,
    increased: true,
    decreased: false,
    value: '+20.34',
    icon: <IoDiamondOutline className="text-2xl" />,
  },
  {
    id: 4,
    title: 'Total Revenue',
    metric: '63,076',
    fill: '#3872FA',
    percentage: 54,
    increased: true,
    decreased: false,
    value: '+14.45',
    icon: <PiCurrencyDollar className="text-2xl" />,
  },
];

function FileStatGrid({ className }: { className?: string }) {
  return (
    <>
      {filesStatData.map((stat: any) => {
        return (
          <MetricCard
            icon={stat.icon}
            key={stat.id}
            title={stat.title}
            metric={stat.metric}
            metricClassName="3xl:text-[22px]"
            className={cn('w-full max-w-full justify-between', className)}
          />
        );
      })}
    </>
  );
}

export default function StateCardView({ className }: { className: string }) {
  const { sliderEl, sliderPrevBtn, sliderNextBtn, scrollToTheRight, scrollToTheLeft } = useScrollableSlider();
  const { data, isLoading, isError } = useGetDashboardCalcQuery(null);

  if (!isLoading) {
    console.log(data.data);
  }

  const totalVerifiedRetailer = data?.data?.totalVerifiedRetailer ?? 0;
  const totalVerifiedCustomer = data?.data?.totalVerifiedCustomer ?? 0;
  const newCustomerThisMonth = data?.data?.newCustomerThisMonth ?? 0;
  const newRetailerThisMonth = data?.data?.newRetailerThisMonth ?? 0;

  return (
    <div className={cn('relative flex w-auto items-center overflow-hidden', className)}>
      <Button
        title="Prev"
        variant="text"
        ref={sliderPrevBtn}
        onClick={() => scrollToTheLeft()}
        className="!absolute left-0 top-0 z-10 !h-full w-8 !justify-start rounded-none bg-gradient-to-r from-white via-white to-transparent px-0 text-gray-500 hover:text-black dark:from-gray-50/80 dark:via-gray-50/80 3xl:hidden"
      >
        <PiCaretLeftBold className="h-5 w-5" />
      </Button>
      <div className="w-full overflow-hidden">
        <div ref={sliderEl} className="custom-scrollbar-x 2xl:gap-6 grid grid-flow-col gap-5 overflow-x-auto scroll-smooth 3xl:gap-8">
          <MetricCard
            icon={<BsShop className="text-2xl" />}
            key={1}
            title={'Total Verified Retailer'}
            metric={totalVerifiedRetailer}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            icon={<LuUsers className="text-2xl" />}
            key={1}
            title={'Total Verified Customer'}
            metric={totalVerifiedCustomer}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            icon={<PiCalendarPlusDuotone className="text-2xl" />}
            key={1}
            title={'New Retailer This Month'}
            metric={newRetailerThisMonth}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            icon={<PiCalendarPlusDuotone className="text-2xl" />}
            key={1}
            title={'New Customer This Month'}
            metric={newCustomerThisMonth}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
        </div>
      </div>
      <Button
        title="Next"
        variant="text"
        ref={sliderNextBtn}
        onClick={() => scrollToTheRight()}
        className="!absolute right-0 top-0 z-10 !h-full w-8 !justify-end rounded-none bg-gradient-to-l from-white via-white to-transparent px-0 text-gray-500 hover:text-black dark:from-gray-50/80 dark:via-gray-50/80 3xl:hidden"
      >
        <PiCaretRightBold className="h-5 w-5" />
      </Button>
    </div>
  );
}
