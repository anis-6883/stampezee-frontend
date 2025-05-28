import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { BranchDetails } from './_components/BranchDetails';

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
        name: 'Branches',
      },
    ],
  };
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <BranchDetails id={id} />
    </div>
  );
}
