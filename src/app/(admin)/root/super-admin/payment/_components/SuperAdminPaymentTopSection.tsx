'use client';
import PageHeader from '@/components/page-header';
import PaymentTable from './PaymentTable';
import { useEffect, useState } from 'react';
import SuperAdminPaymentHeader from './SuperAdminPaymentHeader';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeader {
  title: string;
  breadcrumb: BreadcrumbItem[];
}

const SuperAdminPaymentTopSection = ({ timezone, pageHeader }: { timezone: string; pageHeader: PageHeader }) => {
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
    <>
      {/* <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} /> */}
      <SuperAdminPaymentHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <PaymentTable dateRange={dateRange} start={start} end={end} setDateRange={setDateRange} timezone={timezone} />
    </>
  );
};

export default SuperAdminPaymentTopSection;
