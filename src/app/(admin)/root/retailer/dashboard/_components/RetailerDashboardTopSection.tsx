'use client';
import RewardCollectStats from './RewardCollectStats';
import RewardPieStatus from './RewardPieStatus';
import StateCardView from './StateCardView';
import RetailerDashboardCustomHeader from './RetailerDashboardCustomHeader';
import { useState } from 'react';
import BranchStatsTable from './BranchStatsTable';

const RetailerDashboardTopSection = ({ title }: { title: string }) => {
  const [dateRange, setDateRange] = useState('');
  return (
    <>
      <RetailerDashboardCustomHeader dateRange={dateRange} title={title} setDateRange={setDateRange} />
      <StateCardView dateRange={dateRange} className="2xl:mb-8 mb-5" />
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6">
          <RewardCollectStats dateRange={dateRange} />
        </div>
        <RewardPieStatus dateRange={dateRange} className="col-span-12 md:col-span-6" />
      </div>

      <BranchStatsTable dateRange={dateRange} />
    </>
  );
};

export default RetailerDashboardTopSection;
