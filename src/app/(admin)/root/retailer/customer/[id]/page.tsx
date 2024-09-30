import PageHeader from '@/components/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { axiosBackendUrl } from '@/utils/axios/getAxios';
import { getTranslations } from 'next-intl/server';
import CustomerDetails from '../_components/CustomerDetails';

const pageHeader = {
  title: 'Manage Customer Details',
  breadcrumb: [
    {
      href: routes.privateRoutes.retailer.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.privateRoutes.retailer.customer.home,
      name: 'Customers',
    },
    {
      name: 'Details',
    },
  ],
};

export const metadata = { ...metaObject(pageHeader.title) };

export default async function Page({ params }: any) {
  const { data } = await axiosBackendUrl.get('/api/web/get-common-settings');
  const { id } = params;
  const t = await getTranslations('RetailerCustomerDetails');
  pageHeader.breadcrumb[0].name = t('dashboard');
  pageHeader.breadcrumb[1].name = t('customer');
  pageHeader.breadcrumb[2].name = t('details');
  pageHeader.title = t('title');
  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CustomerDetails id={id} offset={data?.data?.general?.timezone?.value} />
    </div>
  );
}
