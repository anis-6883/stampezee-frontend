import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getLocale, getTranslations } from 'next-intl/server';
import LocationBaseNotifyTable from './_components/LocationBaseNotifiyTable';

const pageHeader = {
  title: 'Manage Location Base Notifications',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Location Base Notification',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const t = await getTranslations('LocationBasedNotification');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('locationBasedNotifications');
  pageHeader.title = t('title');
  const locale = await getLocale();

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <LocationBaseNotifyTable
        locale={locale}
        offset={data?.data?.general?.timezone?.value}
        googleMapsApiKey={data?.data?.googleMap?.googleMapsApiKey}
      />
    </div>
  );
}
