import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import UpdateBranch from '../../_components/UpdateBranch';

const pageHeader = {
  title: 'Update A Branch',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.retailer.branch.home,
      name: 'Branches',
    },
    {
      name: 'Update',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page({ params }: any) {
  const { id } = params;

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UpdateBranch branchId={id} />
    </>
  );
}
