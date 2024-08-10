import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CreateBranch from '../_components/CreateBranch';

const pageHeader = {
  title: 'Add New Branch',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.branch.home,
      name: 'Branches',
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
      <CreateBranch />
    </>
  );
}
