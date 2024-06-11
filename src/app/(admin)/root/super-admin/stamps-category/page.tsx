import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import StampCategoryTable from './_components/StampCategoryTable';

const pageHeader = {
  title: 'Manage Stamp Category',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamp-Category',
    },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <StampCategoryTable />
    </div>
  );
}
