'use client';

import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import Revenue from './Revenue';
import SignUpStatus from './SignUpStatus';
import StateCardView from './StateCardView';

const DashboardTopSection = ({ title }: { title: string }) => {
  const [dateRange, setDateRange] = useState<Date[] | null>(null);

  return (
    <>
      <DashboardHeader title={title} setDateRange={setDateRange} />
      <StateCardView className="2xl:mb-8 mb-5" />

      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6">
          <Revenue dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <SignUpStatus className="col-span-12 md:col-span-6" />
      </div>
    </>
  );
};

export default DashboardTopSection;
