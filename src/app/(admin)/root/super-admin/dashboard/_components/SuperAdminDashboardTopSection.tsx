'use client';

import { useState } from 'react';
import Revenue from './Revenue';
import SignUpStatus from './SignUpStatus';
import StateCardView from './StateCardView';
import SuperAdminDashboardHeader from './SuperAdminDashboardHeader';
import TopBranchTable from './TopBranchTable';
import RetailerAndCustomerStats from './RetailerAndCustomerStats';

const SuperAdminDashboardTopSection = ({ title }: { title: string }) => {
  const [dateRange, setDateRange] = useState('');
  return (
    <>
      <SuperAdminDashboardHeader dateRange={dateRange} title={title} setDateRange={setDateRange} />
      <StateCardView dateRange={dateRange} className="2xl:mb-8 mb-5" />

      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6">
          <Revenue dateRange={dateRange} />
        </div>
        <SignUpStatus dateRange={dateRange} className="col-span-12 md:col-span-6" />
      </div>
      <TopBranchTable dateRange={dateRange} />

      <RetailerAndCustomerStats dateRange={dateRange} className="my-5" />
    </>
  );
};

export default SuperAdminDashboardTopSection;
