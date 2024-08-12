import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import RegularNotificationTable from './_components/RegularNotificationTable';

const pageHeader = {
  title: 'Manage Regular Notifications',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Regular Notification',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <RegularNotificationTable offset={data?.data?.general?.timezone?.value} />
    </div>
  );
}
