import PageHeader from '@/components/page-header';
import StatusIndicator from '@/components/shared/StatusIndicator/StatusIndicator';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import CustomerTable from './_components/CustomerTable';

const pageHeader = {
  title: 'Manage Customer',
  breadcrumb: [
    {
      href: routes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Customer',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader?.title} breadcrumb={pageHeader?.breadcrumb} />
      <div className="mb-5 flex justify-between">
        <StatusIndicator />
      </div>
      <CustomerTable />
    </div>
  );
}
