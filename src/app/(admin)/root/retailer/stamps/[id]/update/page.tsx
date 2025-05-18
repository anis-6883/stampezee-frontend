import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { getTranslations } from 'next-intl/server';
import UpdateStamp from '../../_components/UpdateStamp';

const pageHeader = {
  title: 'Update Stamps',
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
      name: 'Update',
    },
  ],
};

export default async function Page({ params, searchParams }: any) {
  const { id } = params;
  const { publish } = searchParams;

  const t = await getTranslations('RetailerCreateAndUpdateStamp');
  const tStamp = await getTranslations('RetailerStamp');
  pageHeader.breadcrumb[0].name = tStamp('dashboard');
  pageHeader.breadcrumb[1].name = tStamp('stamps');
  pageHeader.breadcrumb[2].name = publish === 'yes' ? 'View Stamp Card' : t('updateStamp');
  pageHeader.title = publish === 'yes' ? 'View A Stamp Card' : t('updateStamp');
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UpdateStamp Id={id} />
    </div>
  );
}
