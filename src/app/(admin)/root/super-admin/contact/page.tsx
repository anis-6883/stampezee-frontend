import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import ContactTable from './_components/ContactTable';

const pageHeader = {
  title: 'Manage Contacts',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Contacts',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ContactTable />
    </div>
  );
}
