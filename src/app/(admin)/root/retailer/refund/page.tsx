import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import RefundTable from './_components/RefundTable';

const pageHeader = {
  title: 'Manage Refunds',
  breadcrumb: [
    {
      href: routes.privateRoutes.superAdmin.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Refunds',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const t = await getTranslations('RetailerRefund');
  pageHeader.breadcrumb[0].name = t('Dashboard');
  pageHeader.breadcrumb[1].name = t('refunds');
  pageHeader.title = t('title');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <RefundTable />
    </div>
  );
}
