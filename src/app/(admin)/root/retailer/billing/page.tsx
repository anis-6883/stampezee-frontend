import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getTranslations } from 'next-intl/server';
import BillingTable from './_components/BillingTable';

const pageHeader = {
  title: 'Billing',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      name: 'Billing',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page() {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const t = await getTranslations('RetailerBilling');
  pageHeader.breadcrumb[0].name = t('Dashboard');
  pageHeader.breadcrumb[1].name = t('Billing');
  pageHeader.title = t('Billing');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <BillingTable offset={data?.data?.general?.timezone?.value} />
    </div>
  );
}
