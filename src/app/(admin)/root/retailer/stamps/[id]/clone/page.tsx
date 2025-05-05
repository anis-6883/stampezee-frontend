import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getLocale, getTranslations } from 'next-intl/server';
import CloneStamp from '../../_components/CloneStamp';

const pageHeader = {
  title: 'Clone Stamps',
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
      name: 'Clone',
    },
  ],
};

export default async function Page({ params }: any) {
  const { id } = params;
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const t = await getTranslations('RetailerCreateAndUpdateStamp');
  const tStamp = await getTranslations('RetailerStamp');
  pageHeader.breadcrumb[0].name = tStamp('dashboard');
  pageHeader.breadcrumb[1].name = tStamp('stamps');
  pageHeader.breadcrumb[2].name = t('clone');
  pageHeader.title = t('cloneStamp');
  const locale = await getLocale();
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CloneStamp Id={id} timezone={data?.data?.general?.timezone?.label} locale={locale} />
    </div>
  );
}
