import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getLocale, getTranslations } from 'next-intl/server';
import StampsImageTable from './_components/StampsImageTable';

const pageHeader = {
  title: 'Manage Custom Stamp Image',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Manage Custom Stamp',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const t = await getTranslations('RetailerStampImage');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('customStampImage');
  pageHeader.title = t('title');
  const locale = await getLocale();
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <StampsImageTable locale={locale} />
    </div>
  );
}
