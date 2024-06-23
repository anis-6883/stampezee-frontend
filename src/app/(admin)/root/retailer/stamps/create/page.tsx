'use client';
import { routes } from '@/config/routes';
import Create from '../_components/Create';
import PageHeader from '@/components/page-header';

const pageHeader = {
  title: 'Manage Stamps',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamps',
    },
    {
      name: 'Create',
    },
  ],
};

export default function page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <hr />
      <Create />
    </div>
  );
}
