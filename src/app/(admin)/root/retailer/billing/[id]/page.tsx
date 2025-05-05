import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getTranslations } from 'next-intl/server';
import SubscriptionDetails from '../_components/SubscriptionDetails';

const pageHeader = {
  title: 'Subscription Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.billing.home,
      name: 'Billing',
    },
    {
      name: 'Subscription Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page({ params }: any) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const { id } = params;
  const t = await getTranslations('RetailerBillingDetails');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('billing');
  pageHeader.breadcrumb[2].name = t('title');
  pageHeader.title = t('title');

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <SubscriptionDetails id={id} stripePublishKey={data?.data?.stripe?.stripePublishKey} />
    </div>
  );
}
