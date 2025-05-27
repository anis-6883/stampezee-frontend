'use client';

import { routes } from '@/config/routes';
import cn from '@/hooks/class-names';
import { useScrollableSlider } from '@/hooks/use-scrollable-slider';
import { BsPatchCheck } from 'react-icons/bs';
import { LuCircleDollarSign, LuUsers } from 'react-icons/lu';
import { MdShoppingCartCheckout } from 'react-icons/md';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import MetricCard from '../../dashboard/_components/MetricCard';

export default function StatsCardView({
  className,
  totalOrder,
  totalActiveStamp,
  totalCustomer,
  totalRevenue,
  totalSubAdmin,
  isLoading,
  isError,
  businessCurrency,
  id,
}: {
  className: string;
  totalOrder: number;
  totalActiveStamp: number;
  totalCustomer: number;
  totalRevenue: number;
  totalSubAdmin: number;
  isLoading: boolean;
  isError: boolean;
  businessCurrency: string;
  id?: string;
}) {
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
        <div ref={sliderEl} className="custom-scrollbar-x 2xl:gap-2 grid grid-flow-col gap-5 overflow-x-auto scroll-smooth 3xl:gap-3">
          <MetricCard
            isDetailsView
            icon={<MdShoppingCartCheckout className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Stamps'}
            metric={totalOrder}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            isDetailsView
            icon={<LuCircleDollarSign className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={`Total Revenue (${businessCurrency})`}
            metric={totalRevenue}
            hasDecimalTwoDigits={true}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            isDetailsView
            icon={<LuUsers className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Customer'}
            metric={totalCustomer}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            isDetailsView
            icon={<BsPatchCheck className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Active Stamp Cards'}
            metric={totalActiveStamp}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            isDetailsView
            icon={<LuUsers className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Loyalty Executive'}
            metric={totalSubAdmin}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            isDetailsView
            detailsLink={`${routes?.privateRoutes?.superAdmin?.retailer?.details(id as string)}/branches`}
            icon={<LuUsers className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Branches'}
            metric={totalSubAdmin}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
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
