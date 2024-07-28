import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import ScanTable from './_components/ScanTable';

const pageHeader = {
  title: 'Manage Stamp Scan',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamp Scan',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader?.title} breadcrumb={pageHeader?.breadcrumb} />
      <ScanTable />
    </div>
  );
}
