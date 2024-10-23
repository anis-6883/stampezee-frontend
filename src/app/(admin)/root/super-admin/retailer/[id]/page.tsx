import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import RetailerDetails from '../_components/RetailerDetails';

const pageHeader = {
  title: 'Manage Retailer Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.superAdmin.retailer.home,
      name: 'Retailers',
    },
    {
      name: 'Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page({ params }: any) {
  const { id } = params;
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <RetailerDetails id={id} />
    </div>
  );
}
