import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import RegularNotificationTable from './_components/RegularNotificationTable';

const pageHeader = {
  title: 'Manage Regular Notifications',
  breadcrumb: [
    {
      href: routes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Regular Notification',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default function Page() {
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <RegularNotificationTable />
    </div>
  );
}
