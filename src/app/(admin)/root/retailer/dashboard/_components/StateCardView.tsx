'use client';

import FreeTrialCountdownModal from '@/app/(client)/(public)/checkout/_components/FreeTrialCountdownModal';
import FreeTrialExpireModal from '@/app/(client)/(public)/checkout/_components/FreeTrialExpireModal';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { useGetRetailerDashboardCalcQuery } from '@/features/retailer/dashboard/dashboardApi';
import cn from '@/hooks/class-names';
import { useScrollableSlider } from '@/hooks/use-scrollable-slider';
import { countDaysLeft } from '@/utils';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { BsPatchCheck } from 'react-icons/bs';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { LuUsers } from 'react-icons/lu';
import { MdShoppingCartCheckout } from 'react-icons/md';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { Button } from 'rizzui';
import MetricCard from './MetricCard';

export default function StateCardView({ className }: { className: string }) {
  const { data: session }: any = useSession();
  const [modalState, setModalState] = useState(false);
  const [trialCountDownModalState, setTrialCountDownModalState] = useState(true);
  const t = useTranslations('RetailerDashboard');
  const { sliderEl, sliderPrevBtn, sliderNextBtn, scrollToTheRight, scrollToTheLeft } = useScrollableSlider();
  const { data, isLoading, isError } = useGetRetailerDashboardCalcQuery(null);
  const { data: retailerProfile, isLoading: isRetailerProfileLoading, refetch } = useRetailerGetProfileQuery(null);
  const { totalOrder = 0, totalActiveStamp = 0, totalRevenue = 0, totalCustomer = 0 } = data?.data || {};

  useEffect(() => {
    if (retailerProfile?.data?.isLimitExceeded) {
      setModalState(true);
    }
  }, [retailerProfile?.data?.isLimitExceeded]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (countDaysLeft(session?.user?.planValidAt) < 5 && session?.user?.plan === 'trial' && !retailerProfile?.data?.isLimitExceeded) {
      setTrialCountDownModalState(true);
    } else {
      setTrialCountDownModalState(false);
    }
  }, [retailerProfile?.data?.isLimitExceeded, session?.user]);

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
            icon={<MdShoppingCartCheckout className="text-2xl" />}
            key={1}
            title={t('totalOrders')}
            metric={totalOrder}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            icon={<FaMoneyBillAlt className="text-2xl" />}
            key={1}
            title={`${t('totalRevenue')} (${isRetailerProfileLoading ? ' ' : retailerProfile?.data?.businessCurrency})`}
            metric={totalRevenue.toFixed(2)}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError || isRetailerProfileLoading}
          />

          <MetricCard
            icon={<LuUsers className="text-2xl" />}
            key={1}
            title={t('totalCustomer')}
            metric={totalCustomer}
            metricClassName="3xl:text-[22px]"
            className="w-full min-w-[292px] max-w-full justify-between"
            isLoading={isLoading || isError}
          />

          <MetricCard
            icon={<BsPatchCheck className="text-2xl" />}
            key={1}
            title={t('totalActiveStamp')}
            metric={totalActiveStamp}
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

      <FreeTrialExpireModal
        modalState={modalState}
        setModalState={setModalState}
        allowTotalUser={retailerProfile?.data?.allowTotalUser}
        allowTotalScan={retailerProfile?.data?.allowTotalScan}
        // countDownDays={countDaysLeft(session?.user?.planValidAt)}
      />
      <FreeTrialCountdownModal
        modalState={trialCountDownModalState}
        setModalState={setTrialCountDownModalState}
        countDownDays={countDaysLeft(session?.user?.planValidAt)}
      />
    </div>
  );
}
