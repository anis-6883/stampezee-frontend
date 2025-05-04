'use client';

import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import cn from '@/hooks/class-names';
import { useScrollableSlider } from '@/hooks/use-scrollable-slider';
import { useTranslations } from 'next-intl';
import { BsPatchCheck, BsShop } from 'react-icons/bs';
import { LuCircleDollarSign, LuUsers } from 'react-icons/lu';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import MetricCard from '../../dashboard/_components/MetricCard';

export default function StatsCardView({
  className,
  totalCollectStamp,
  totalScan,
  totalRewardCollect,
  totalPurchased,
  isLoading,
  isError,
}: {
  className: string;
  totalScan: number;
  totalCollectStamp: number;
  totalRewardCollect: number;
  totalPurchased: number;
  isLoading: boolean;
  isError: boolean;
}) {
  const t = useTranslations('RetailerCustomerDetailsStats');
  const { data: retailerProfile, isLoading: isRetailerProfileLoading } = useRetailerGetProfileQuery(null);
  const { sliderEl, sliderPrevBtn, sliderNextBtn, scrollToTheRight, scrollToTheLeft } = useScrollableSlider();

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
            title={t('totalCollectStamp')}
            metric={totalCollectStamp}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            icon={<BsPatchCheck className="text-2xl" />}
            key={1}
            title={t('totalScan')}
            metric={totalScan}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            icon={<LuUsers className="text-2xl" />}
            key={1}
            title={t('totalRewardCollect')}
            metric={totalRewardCollect}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            icon={<LuCircleDollarSign className="text-2xl" />}
            key={1}
            title={`${t('totalPurchased')} (${isRetailerProfileLoading ? ' ' : retailerProfile?.data?.businessCurrency})`}
            metric={totalPurchased?.toFixed(2)}
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
