import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getLocale, getTranslations } from 'next-intl/server';
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
  const t = await getTranslations('RetailerNotification');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('regularNotification');
  pageHeader.title = t('title');
  const locale = await getLocale();

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <RegularNotificationTable locale={locale} />
    </div>
  );
}
