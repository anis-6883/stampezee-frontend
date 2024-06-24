'use client';
import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import CreateStamp from '../_components/CreateStamp';

const pageHeader = {
  title: 'Create A Stamp',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.retailer.stamp.home,
      name: 'Stamps',
    },
    {
      name: 'Create',
    },
  ],
};

export default function page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateStamp />
    </>
  );
}
