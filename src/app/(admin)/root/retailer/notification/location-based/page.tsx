import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import LocationBaseNotifyTable from './_components/LocationBaseNotifiyTable';

const pageHeader = {
  title: 'Manage Location Base Notifications',
  breadcrumb: [
    {
      href: routes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Notification',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <LocationBaseNotifyTable />
    </div>
  );
}
