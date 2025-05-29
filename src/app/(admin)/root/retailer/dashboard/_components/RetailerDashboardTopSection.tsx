'use client';
import { useState } from 'react';
import BranchStatsTable from './BranchStatsTable';
import RetailerDashboardCustomHeader from './RetailerDashboardCustomHeader';
import RewardCollectStats from './RewardCollectStats';
import RewardPieStatus from './RewardPieStatus';
import StateCardView from './StateCardView';

const RetailerDashboardTopSection = ({ title }: { title: string }) => {
  const [dateRange, setDateRange] = useState('');
  const [value, setValue] = useState<string[]>([]);
  return (
    <>
      <RetailerDashboardCustomHeader value={value} setValue={setValue} dateRange={dateRange} title={title} setDateRange={setDateRange} />
      <StateCardView value={value} dateRange={dateRange} className="2xl:mb-8 mb-5" />
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6">
          <RewardCollectStats dateRange={dateRange} value={value} />
        </div>
        <RewardPieStatus dateRange={dateRange} value={value} className="col-span-12 md:col-span-6" />
      </div>

      <BranchStatsTable dateRange={dateRange} value={value} />
    </>
  );
};

export default RetailerDashboardTopSection;
