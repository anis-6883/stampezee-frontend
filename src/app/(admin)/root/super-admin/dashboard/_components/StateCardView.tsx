'use client';

import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { useGetDashboardCalcQuery } from '@/features/super-admin/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useScrollableSlider } from '@/hooks/use-scrollable-slider';
import { BsShop } from 'react-icons/bs';
import { LuUsers } from 'react-icons/lu';
import { PiCalendarPlusDuotone, PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { Button } from 'rizzui';
import MetricCard from './MetricCard';

export default function StateCardView({ className }: { className: string }) {
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { sliderEl, sliderPrevBtn, sliderNextBtn, scrollToTheRight, scrollToTheLeft } = useScrollableSlider();
  const { data, isLoading, isError } = useGetDashboardCalcQuery(null, { skip: !accessToken });

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
            isDetailsView
            detailsLink={routes.privateRoutes.superAdmin.retailer.home}
          />
          <MetricCard
            icon={<LuUsers className="text-2xl" />}
            key={1}
            title={'Total Verified Customer'}
            metric={totalVerifiedCustomer}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
            isDetailsView
            detailsLink={routes.privateRoutes.superAdmin.customer.home}
          />

          {/* ======updated card====== */}
          <MetricCard
            icon={<PiCalendarPlusDuotone className="text-2xl" />}
            key={1}
            title={'Total Active Stamp Card'}
            metric={newRetailerThisMonth}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
            isDetailsView
            detailsLink={routes.privateRoutes.superAdmin.retailer.home}
          />

          {/* ======updated card====== */}
          <MetricCard
            icon={<PiCalendarPlusDuotone className="text-2xl" />}
            key={1}
            title={'Total Active Subscribers'}
            metric={newCustomerThisMonth}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
            isDetailsView
            detailsLink={routes.privateRoutes.superAdmin.customer.home}
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
