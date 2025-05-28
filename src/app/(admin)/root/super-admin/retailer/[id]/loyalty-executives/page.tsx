import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { SubAdminDetails } from './_components/SubadminDetails';

export const metadata = { ...metaObject('Manage Retailer Details') };

export default async function Page({ params }: any) {
  const { id } = params;
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
        href: routes.privateRoutes.superAdmin.retailer.details(id),
        name: 'Details',
      },
      {
        name: 'Loyalty Executives',
      },
    ],
  };
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <SubAdminDetails id={id} />
    </div>
  );
}
