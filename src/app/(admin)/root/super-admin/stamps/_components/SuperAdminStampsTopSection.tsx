'use client';
import { useEffect, useState } from 'react';
import StampTable from './StampTable';
import SuperAdminStampsHeaderSection from './SuperAdminStampsHeader';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeader {
  title: string;
  breadcrumb: BreadcrumbItem[];
}

const options = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Deleted by Retailer',
    value: 'deletedByRetailer',
  },
  {
    label: 'Deleted by Admin',
    value: 'deletedByAdmin',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Drafted',
    value: 'drafted',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Expired',
    value: 'expired',
  },
];

const SuperAdminStampsTopSection = ({ timezone, pageHeader }: { timezone: string; pageHeader: PageHeader }) => {
  const [dateRange, setDateRange] = useState('');
  const [status, setStatus] = useState(options[0].value);
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
      <SuperAdminStampsHeaderSection
        dateRange={dateRange}
        setDateRange={setDateRange}
        title={pageHeader.title}
        status={status}
        options={options}
        setStatus={setStatus}
        breadcrumb={pageHeader.breadcrumb}
      />

      <StampTable status={status} start={start} end={end} timezone={timezone} />
    </>
  );
};

export default SuperAdminStampsTopSection;
