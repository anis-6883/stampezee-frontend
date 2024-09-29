import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import CreateStamp from '../_components/CreateStamp';

const pageHeader = {
  title: 'Create A Stamp',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.stamp.home,
      name: 'Stamps',
    },
    {
      name: 'Create',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function page() {
  const t = await getTranslations('RetailerCreateAndUpdateStamp');
  const tStamp = await getTranslations('RetailerStamp');
  pageHeader.breadcrumb[0].name = tStamp('dashboard');
  pageHeader.breadcrumb[1].name = tStamp('stamps');
  pageHeader.breadcrumb[2].name = t('createStamp');
  pageHeader.title = t('createStamp');
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateStamp />
    </>
  );
}
