import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import ScanTable from './_components/ScanTable';

const pageHeader = {
  title: 'Manage Stamps',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Stamps',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const t = await getTranslations('RetailerScan');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('stampScan');
  pageHeader.title = t('title');

  return (
    <div>
      <PageHeader title={pageHeader?.title} breadcrumb={pageHeader?.breadcrumb} />
      <ScanTable />
    </div>
  );
}
