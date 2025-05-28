'use client';

import { routes } from '@/config/routes';
import cn from '@/hooks/class-names';
import { useScrollableSlider } from '@/hooks/use-scrollable-slider';
import { BsPatchCheck } from 'react-icons/bs';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { LuCircleDollarSign, LuUsers } from 'react-icons/lu';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import MetricCard from '../../dashboard/_components/MetricCard';

export default function StatsCardView({
  className,
  totalStamps,
  totalStampCards,
  totalCustomers,
  totalBranches,
  totalRevenue,
  totalSubAdmins,
  isLoading,
  isError,
  businessCurrency,
  id,
}: {
  className: string;
  totalStamps: number;
  totalStampCards: number;
  totalCustomers: number;
  totalRevenue: number;
  totalSubAdmins: number;
  totalBranches: number;
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
        <div ref={sliderEl} className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
            icon={<MdOutlineQrCodeScanner className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Stamps'}
            metric={totalStamps}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            isDetailsView
            icon={<LuUsers className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Customers'}
            metric={totalCustomers}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            isDetailsView
            icon={<BsPatchCheck className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Stamp Cards'}
            metric={totalStampCards}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            isDetailsView
            detailsLink={`${routes?.privateRoutes?.superAdmin?.retailer?.details(id as string)}/loyalty-executives`}
            icon={<LuUsers className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Loyalty Executives'}
            metric={totalSubAdmins}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[200px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />
          <MetricCard
            isDetailsView
            detailsLink={`${routes?.privateRoutes?.superAdmin?.retailer?.details(id as string)}/branches`}
            icon={<LiaMapMarkedAltSolid className="text-xl" />}
            iconClassName="lg:h-9 lg:w-9 h-6 w-6"
            key={1}
            title={'Total Branches'}
            metric={totalBranches}
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
