'use client';

import { useEffect, useState } from 'react';
import RefundTable from './RefundTable';
import SuperAdminRefundsHeaderSection from './SuperAdminRefundsHeaderSection';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeader {
  title: string;
  breadcrumb: BreadcrumbItem[];
}

const SuperAdminRefundTopSection = ({ timezone, pageHeader }: { timezone: string; pageHeader: PageHeader }) => {
  const [dateRange, setDateRange] = useState('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');

  useEffect(() => {
    if (dateRange) {
      if (dateRange.includes('to')) {
        const dates = dateRange.replaceAll(' ', '').split('to');
        setStart(dates[0]);
        setEnd(dates[1]);
      }
    } else {
      setStart('');
      setEnd('');
    }
  }, [dateRange]);

  return (
    <div>
      <SuperAdminRefundsHeaderSection
        dateRange={dateRange}
        setDateRange={setDateRange}
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />

      <RefundTable start={start} end={end} timezone={timezone} />
    </div>
  );
};

export default SuperAdminRefundTopSection;
