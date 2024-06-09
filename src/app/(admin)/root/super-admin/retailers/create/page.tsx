import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CreateRetailer from '../_components/CreateRetailer';

const pageHeader = {
  title: 'Add New Retailer',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.superAdmin.retailer.home,
      name: 'Retailer',
    },
    {
      name: 'Create',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateRetailer />
    </>
  );
}
